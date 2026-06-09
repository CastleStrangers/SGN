import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  prisma.ad.update({ where: { id }, data: { clicks: { increment: 1 } } }).catch(() => {});
  return NextResponse.json({ success: true });
}
