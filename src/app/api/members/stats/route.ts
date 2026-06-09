  import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getApiMessage } from "@/lib/api-messages";

function tReq(req: Request, key: string) {
  const locale = (req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
  return getApiMessage(locale, key);
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: tReq(req, 'api.unauthorized') }, { status: 403 });
  }
  const members = await prisma.member.findMany();
  const total = members.length;
  const byStatus: Record<string, number> = { pending: 0, accepted: 0, rejected: 0 };
  const byGender: Record<string, number> = {};
  const byOrigin: Record<string, number> = {};
  const byProvince: Record<string, number> = {};
  for (const m of members) {
    byStatus[m.status] = (byStatus[m.status] || 0) + 1;
    byGender[m.gender] = (byGender[m.gender] || 0) + 1;
    byOrigin[m.originCity] = (byOrigin[m.originCity] || 0) + 1;
    byProvince[m.nlProvincie] = (byProvince[m.nlProvincie] || 0) + 1;
  }
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recent = members.filter((m: { createdAt: Date }) => new Date(m.createdAt) >= thirtyDaysAgo);
  const byDay: Record<string, number> = {};
  for (const m of recent) {
    const day = new Date(m.createdAt).toISOString().slice(0, 10);
    byDay[day] = (byDay[day] || 0) + 1;
  }
  return NextResponse.json({ total, byStatus, byGender, byOrigin, byProvince, byDay });
}
