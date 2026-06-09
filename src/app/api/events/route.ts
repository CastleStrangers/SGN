import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAuthorize } from "@/lib/auth-helpers";
import { getApiMessage } from "@/lib/api-messages";

function t(req: Request, key: string) {
  const locale = (req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
  return getApiMessage(locale, key);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const upcoming = searchParams.get("upcoming");
  const where: any = {};
  if (upcoming === "true") where.date = { gte: new Date() };
  const events = await prisma.event.findMany({ where, orderBy: { date: "asc" } });
  return NextResponse.json(events);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await requireAuthorize(session.user.id, "events.create")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { title, description, date, location, image, category } = await req.json();
  const event = await prisma.event.create({
    data: { title, description, date: new Date(date), location, image, category: category || t(req, 'events.categoryEvent') },
  });
  return NextResponse.json(event);
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await requireAuthorize(session.user.id, "events.edit")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id, title, description, date, location, image, category, published } = await req.json();
  const data: any = {};
  if (title !== undefined) data.title = title;
  if (description !== undefined) data.description = description;
  if (date !== undefined) data.date = new Date(date);
  if (location !== undefined) data.location = location;
  if (image !== undefined) data.image = image;
  if (category !== undefined) data.category = category;
  if (published !== undefined) data.published = published;
  await prisma.event.update({ where: { id }, data });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await requireAuthorize(session.user.id, "events.delete")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await req.json();
  await prisma.event.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
