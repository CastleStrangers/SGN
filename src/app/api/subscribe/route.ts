import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAuthorize } from "@/lib/auth-helpers";
import { getApiMessage } from "@/lib/api-messages";

function t(req: Request, key: string) {
  const locale = (req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
  return getApiMessage(locale, key);
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return NextResponse.json({ error: t(req, 'api.emailInvalid') }, { status: 400 });
    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (existing)
      return NextResponse.json({ error: t(req, 'api.emailSubscribed') }, { status: 409 });
    await prisma.subscriber.create({ data: { email } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: t(req, 'api.internalError') }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await requireAuthorize(session.user.id, "subscribers.view")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const subscribers = await prisma.subscriber.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(subscribers);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await requireAuthorize(session.user.id, "subscribers.view")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await req.json();
  await prisma.subscriber.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
