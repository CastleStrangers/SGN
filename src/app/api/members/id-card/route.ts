import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { authorize } from "@/lib/server-permissions";
import { prisma } from "@/lib/db";
import { decryptBuffer } from "@/lib/crypto";
import fs from "fs/promises";
import path from "path";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  // Verify user has permission to verify members / view identities
  if (!session?.user?.id || !(await authorize(session.user.id, "volunteers.view"))) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const memberId = searchParams.get("memberId");

  if (!memberId) {
    return new NextResponse("Member ID is required", { status: 400 });
  }

  try {
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      select: { encryptedIdCard: true }
    });

    if (!member || !member.encryptedIdCard) {
      return new NextResponse("ID Card not found for this member", { status: 404 });
    }

    let encryptedContent = "";
    let extension = "jpeg"; // default

    // If it's a data URI (from Base64 storage)
    if (member.encryptedIdCard.startsWith("data:")) {
      const match = member.encryptedIdCard.match(/^data:.*name=([^;]+)\.enc;base64,(.*)$/);
      if (match) {
        extension = match[1];
        encryptedContent = Buffer.from(match[2], "base64").toString("utf8");
      } else {
        // Fallback generic parsing
        const parts = member.encryptedIdCard.split(",");
        encryptedContent = Buffer.from(parts[1], "base64").toString("utf8");
      }
    } else if (member.encryptedIdCard.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), "public", member.encryptedIdCard);
      encryptedContent = await fs.readFile(filePath, "utf8");
    } else {
      // It's a remote Vercel Blob URL
      const response = await fetch(member.encryptedIdCard);
      if (!response.ok) {
        return new NextResponse("Failed to fetch encrypted ID from storage", { status: 500 });
      }
      encryptedContent = await response.text();
    }

    // Decrypt the content back to buffer
    const decryptedBuffer = decryptBuffer(encryptedContent);

    // Detect file type
    if (!member.encryptedIdCard.startsWith("data:")) {
      extension = member.encryptedIdCard.split(".").reverse()[1]?.toLowerCase() || "jpeg";
    }
    const contentType = extension === "pdf" ? "application/pdf" : `image/${extension}`;

    return new NextResponse(new Uint8Array(decryptedBuffer), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=3600"
      }
    });
  } catch (e: any) {
    console.error("Failed to decrypt ID card:", e);
    return new NextResponse("Failed to retrieve and decrypt ID card", { status: 500 });
  }
}
