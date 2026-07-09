import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getApiMessage } from "@/lib/api-messages";

function tReq(req: Request, key: string) {
  const locale = (req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
  return getApiMessage(locale, key);
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: tReq(req, 'api.unauthorized') }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get("limit")) || 50, 200);
  const offset = Number(searchParams.get("offset")) || 0;
  const search = searchParams.get("search");
  const status = searchParams.get("status");

  const where: any = {};
  if (status && status !== "all") where.status = status;
  if (search) {
    where.OR = [
      { nameAr: { contains: search } },
      { nameNl: { contains: search } },
      { whatsapp: { contains: search } },
      { email: { contains: search } },
      { originCity: { contains: search } },
      { nlCity: { contains: search } },
    ];
  }

  const [members, total] = await Promise.all([
    prisma.member.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.member.count({ where }),
  ]);

  return NextResponse.json({ members, total, limit, offset });
}
