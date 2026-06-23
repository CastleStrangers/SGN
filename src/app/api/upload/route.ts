import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAuthorize } from "@/lib/auth-helpers";
import { getApiMessage } from "@/lib/api-messages";
import fs from "fs/promises";
import path from "path";

function t(req: Request, key: string) {
  const locale = (req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
  return getApiMessage(locale, key);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await requireAuthorize(session.user.id, "media.upload")))
    return NextResponse.json({ error: t(req, 'api.unauthorized') }, { status: 403 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: t(req, 'api.fileRequired') }, { status: 400 });

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext || ""))
      return NextResponse.json({ error: t(req, 'api.unsupportedFormat') }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    // الحل الجذري: تحويل الصورة إلى Base64 وتخزينها كبيانات نصية
    // هذا يلغي الحاجة لـ Vercel Blob أو أي خدمة خارجية تماماً ويحل مشكلة الحظر!
    const mimeType = file.type || `image/${ext === "svg" ? "svg+xml" : ext}`;
    const base64Data = `data:${mimeType};base64,${buffer.toString("base64")}`;

    return NextResponse.json({ url: base64Data });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: t(req, 'api.internalError') }, { status: 500 });
  }
}
