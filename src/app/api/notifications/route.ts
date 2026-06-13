import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/mobile-auth";

export async function GET(req: Request) {
  const user = await getSessionUser(req);
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return NextResponse.json(notifications);
}

export async function PATCH(req: Request) {
  const user = await getSessionUser(req);
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const { id } = await req.json();
  if (id === "all") {
    await prisma.notification.updateMany({
      where: { userId: user.id },
      data: { read: true },
    });
  } else {
    await prisma.notification.update({ where: { id }, data: { read: true } });
  }
  return NextResponse.json({ success: true });
}

