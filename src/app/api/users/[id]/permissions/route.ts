import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { authorize } from "@/lib/permissions";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await authorize(session.user.id, "users.edit_role"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const permissions = await prisma.userPermission.findMany({
    where: { userId: id },
    select: { permission: true, granted: true },
  });

  return NextResponse.json(permissions);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await authorize(session.user.id, "users.edit_role"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { permissions } = await req.json();

    // Replace all permissions for this user
    await prisma.userPermission.deleteMany({ where: { userId: id } });

    if (permissions && permissions.length > 0) {
      await prisma.userPermission.createMany({
        data: permissions.map((p: { permission: string; granted: boolean }) => ({
          userId: id,
          permission: p.permission,
          granted: p.granted ?? true,
        })),
      });
    }

    return NextResponse.json({ message: "Permissions updated" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
