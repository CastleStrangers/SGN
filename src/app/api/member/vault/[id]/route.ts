import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/mobile-auth";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser(req);
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const member = await prisma.member.findUnique({
    where: { userId: user.id },
  });

  if (!member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  const doc = await prisma.memberDocument.findUnique({
    where: { id },
  });

  if (!doc || doc.memberId !== member.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.memberDocument.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
