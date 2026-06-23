import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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

    // الحل الجذري: تخزين المحتوى المشفر مباشرة كـ Base64
    const base64Encrypted = Buffer.from(encryptedData, "utf8").toString("base64");
    // we use application/octet-stream since it's an encrypted blob, but keep ext for retrieval
    const dataUri = `data:application/octet-stream;name=${ext}.enc;base64,${base64Encrypted}`;

    // Return the data URI
    return NextResponse.json({ url: dataUri });
  } catch (e: any) {
    console.error("ID Card upload error:", e);
    return NextResponse.json({ error: e.message || "Failed to upload ID" }, { status: 500 });
  }
}
