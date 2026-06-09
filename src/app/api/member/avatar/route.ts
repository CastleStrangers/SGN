import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { getApiMessage } from "@/lib/api-messages";

function t(req: Request, key: string) {
  const locale = (req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
  return getApiMessage(locale, key);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: t(req, 'api.unauthorized') }, { status: 401 });
  }
  const member = await prisma.member.findUnique({ where: { userId: session.user.id } });
  if (!member) {
    return NextResponse.json({ error: t(req, 'api.noApplication') }, { status: 404 });
  }
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: t(req, 'api.fileRequired') }, { status: 400 });

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["jpg", "jpeg", "png", "gif", "webp"].includes(ext || ""))
      return NextResponse.json({ error: t(req, 'api.unsupportedFormat') }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `avatar-${member.id}-${Date.now()}.${ext}`;
    const dir = path.join(process.cwd(), "public", "uploads", "avatars");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, fileName), buffer);

    const url = `/uploads/avatars/${fileName}`;
    await prisma.member.update({ where: { id: member.id }, data: { avatar: url } });

    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: t(req, 'api.internalError') }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: t(req, 'api.unauthorized') }, { status: 401 });
  }
  const member = await prisma.member.findUnique({ where: { userId: session.user.id } });
  if (!member?.avatar) {
    return NextResponse.json({ error: t(req, 'api.noImage') }, { status: 404 });
  }
  try {
    const filePath = path.join(process.cwd(), "public", member.avatar);
    await unlink(filePath).catch(() => {});
    await prisma.member.update({ where: { id: member.id }, data: { avatar: null } });
    return NextResponse.json({ message: t(req, 'api.imageDeleted') });
  } catch {
    return NextResponse.json({ error: t(req, 'api.internalError') }, { status: 500 });
  }
}
