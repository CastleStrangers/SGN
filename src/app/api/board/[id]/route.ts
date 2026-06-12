import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const { id } = await params;
  try {
    const body = await req.json();

    const updateData: Record<string, unknown> = { ...body };
    if (Array.isArray(body.committees)) {
      updateData.committees = JSON.stringify(body.committees);
    }
    if (Array.isArray(body.bioPoints)) {
      updateData.bioPoints = JSON.stringify(body.bioPoints);
    }

    const updated = await (prisma as any).boardMember.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      ...updated,
      committees: JSON.parse(updated.committees || "[]"),
      bioPoints: JSON.parse(updated.bioPoints || "[]"),
    });
  } catch (error) {
    console.error("[Board PATCH] error:", error);
    return NextResponse.json({ error: "فشل التحديث" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const { id } = await params;
  try {
    await (prisma as any).boardMember.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Board DELETE] error:", error);
    return NextResponse.json({ error: "فشل الحذف" }, { status: 500 });
  }
}
