import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { authorize } from "@/lib/permissions";
import { prisma } from "@/lib/db";
import { decryptBuffer } from "@/lib/crypto";
import { ollamaGenerate } from "@/lib/ai/ollama";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await authorize(session.user.id, "volunteers.view"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { memberId } = await req.json();
    if (!memberId) {
      return NextResponse.json({ error: "Member ID is required" }, { status: 400 });
    }

    const member = await prisma.member.findUnique({
      where: { id: memberId },
      select: { nameAr: true, nameNl: true, birthYear: true, encryptedIdCard: true }
    });

    if (!member || !member.encryptedIdCard) {
      return NextResponse.json({ error: "ID card not found for this member" }, { status: 404 });
    }

    let encryptedContent = "";

    // Load encrypted data
    if (member.encryptedIdCard.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), "public", member.encryptedIdCard);
      encryptedContent = await fs.readFile(filePath, "utf8");
    } else {
      const response = await fetch(member.encryptedIdCard);
      if (!response.ok) {
        return NextResponse.json({ error: "Failed to fetch encrypted ID from storage" }, { status: 500 });
      }
      encryptedContent = await response.text();
    }

    // Decrypt
    const decryptedBuffer = decryptBuffer(encryptedContent);
    const base64Image = decryptedBuffer.toString("base64");

    // Detect file type
    const extension = member.encryptedIdCard.split(".").reverse()[1]?.toLowerCase() || "jpeg";
    const contentType = extension === "pdf" ? "application/pdf" : `image/${extension}`;

    if (contentType === "application/pdf") {
      return NextResponse.json({ error: "AI verification only supports image formats, not PDF files directly" }, { status: 400 });
    }

    const systemPrompt = `You are an AI document verification bot for SGN.
Analyze the provided ID card image and extract the Name and Birth Year.
You MUST output your response strictly as a JSON object:
{
  "name": "extracted full name",
  "birthYear": 1990,
  "confidence": "high" | "medium" | "low",
  "readable": true | false
}`;

    const userPrompt = "Analyze this ID card image and extract the full name and birth year of the cardholder.";

    const aiResponse = await ollamaGenerate(
      [
        { text: userPrompt },
        { inlineData: { mimeType: contentType, data: base64Image } }
      ],
      systemPrompt,
      "application/json"
    );

    let parsed;
    try {
      parsed = JSON.parse(aiResponse);
    } catch {
      const match = aiResponse.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        throw new Error("Failed to parse JSON response from AI");
      }
    }

    // Match analysis
    const matchesName = parsed.name ? (
      member.nameNl.toLowerCase().includes(parsed.name.toLowerCase()) || 
      parsed.name.toLowerCase().includes(member.nameNl.toLowerCase())
    ) : false;

    const matchesBirthYear = parsed.birthYear ? Number(parsed.birthYear) === member.birthYear : false;

    return NextResponse.json({
      extracted: parsed,
      matches: {
        name: matchesName,
        birthYear: matchesBirthYear
      },
      memberInfo: {
        nameNl: member.nameNl,
        birthYear: member.birthYear
      }
    });

  } catch (e: any) {
    console.error("AI ID verification error:", e);
    return NextResponse.json({ error: e.message || "AI Verification failed" }, { status: 500 });
  }
}
