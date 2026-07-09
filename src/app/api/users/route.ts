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
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await requireAuthorize(session.user.id, "users.view"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get("limit")) || 50, 200);
  const offset = Number(searchParams.get("offset")) || 0;
  const search = searchParams.get("search");
  const role = searchParams.get("role");

  const where: any = {};
  if (role) where.role = role;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
    ];
  }

  const SELECT = { id: true, name: true, email: true, role: true, roleId: true, createdAt: true };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: SELECT,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({ users, total, limit, offset });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await requireAuthorize(session.user.id, "users.edit_role"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id, role } = await req.json();
  if (!["admin", "member"].includes(role)) return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  const updated = await prisma.user.update({ where: { id }, data: { role }, select: { id: true, name: true, email: true, role: true, createdAt: true } });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await requireAuthorize(session.user.id, "users.delete"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await req.json();
  if (id === session.user.id) return NextResponse.json({ error: t(req, 'api.cannotDeleteSelf') }, { status: 400 });
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
