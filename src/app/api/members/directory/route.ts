import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const gender = searchParams.get("gender") || "";
  const originCity = searchParams.get("originCity") || "";
  const nlProvincie = searchParams.get("nlProvincie") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { status: "accepted", showInPublicProfile: true };

  if (q) {
    where.OR = [
      { nameAr: { contains: q } },
      { nameNl: { contains: q, mode: "insensitive" } },
      { nlCity: { contains: q } },
    ];
  }
  if (gender) where.gender = gender;
  if (originCity) where.originCity = originCity;
  if (nlProvincie) where.nlProvincie = nlProvincie;

  const [members, total] = await Promise.all([
    prisma.member.findMany({
      where: where as any,
      select: {
        id: true, nameAr: true, nameNl: true, birthYear: true, gender: true,
        originCity: true, nlProvincie: true, nlCity: true, createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.member.count({ where: where as any }),
  ]);

  return NextResponse.json({ members, total, page, limit, totalPages: Math.ceil(total / limit) });
}
