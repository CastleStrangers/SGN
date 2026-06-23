import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { put } from "@vercel/blob";
import fs from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "يجب تسجيل الدخول كمسؤول" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "لم يتم إرسال ملف" }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["jpg", "jpeg", "png", "webp"].includes(ext || "")) {
      return NextResponse.json(
        { error: "صيغة الملف غير مدعومة. يُسمح بـ: jpg, jpeg, png, webp" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "حجم الملف يتجاوز 5MB المسموح به" },
        { status: 400 }
      );
    }

    const arrayBuf = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    // الحل الجذري: تحويل الصورة إلى Base64 وتخزينها كبيانات نصية
    // هذا يلغي الحاجة لـ Vercel Blob أو أي خدمة خارجية تماماً ويحل مشكلة الحظر!
    const mimeType = file.type || `image/${ext === "svg" ? "svg+xml" : ext}`;
    const base64Data = `data:${mimeType};base64,${buffer.toString("base64")}`;

    return NextResponse.json({ url: base64Data });
  } catch (error: any) {
    return NextResponse.json({
      error: `فشل رفع الصورة: ${error?.message || error || "خطأ غير معروف"}`,
    }, { status: 500 });
  }
}
