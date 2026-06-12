import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAuthorize } from "@/lib/auth-helpers";
import { put } from "@vercel/blob";
import { getApiMessage } from "@/lib/api-messages";

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

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ error: "التخزين السحابي غير متاح" }, { status: 500 });
    }

    const blob = await put(fileName, buffer, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return NextResponse.json({ url: blob.url });
  } catch {
    return NextResponse.json({ error: t(req, 'api.internalError') }, { status: 500 });
  }
}
