import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const tasks = await prisma.task.findMany({
    where: { status: { not: "completed" } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return NextResponse.json(tasks);
}
