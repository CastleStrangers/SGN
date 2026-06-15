import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { put } from "@vercel/blob";
import { encryptBuffer } from "@/lib/crypto";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "File required" }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["jpg", "jpeg", "png", "webp", "pdf"].includes(ext || "")) {
      return NextResponse.json({ error: "Unsupported format" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const encryptedData = encryptBuffer(buffer);

    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}.enc`;

    // 1. If Vercel Blob token exists, save to Vercel Blob
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(fileName, Buffer.from(encryptedData, "utf8"), {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      return NextResponse.json({ url: blob.url });
    }

    // 2. Otherwise save locally in public/uploads/id-cards
    const uploadDir = path.join(process.cwd(), "public", "uploads", "id-cards");
    await fs.mkdir(uploadDir, { recursive: true });
    
    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, encryptedData, "utf8");

    // Return the local relative URL
    return NextResponse.json({ url: `/uploads/id-cards/${fileName}` });
  } catch (e: any) {
    console.error("ID Card upload error:", e);
    return NextResponse.json({ error: e.message || "Failed to upload ID" }, { status: 500 });
  }
}
