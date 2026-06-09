import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const skip = parseInt(searchParams.get("skip") || "0", 10);
  const take = parseInt(searchParams.get("take") || "50", 10);

  const [donations, total] = await Promise.all([
    prisma.donation.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.donation.count(),
  ]);

  return NextResponse.json({ donations, total, skip, take });
}
