import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getApiMessage } from "@/lib/api-messages";

function t(req: Request, key: string) {
  const locale = (req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
  return getApiMessage(locale, key);
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: t(req, 'api.unauthorized') }, { status: 401 });
  }
  const url = new URL(req.url);
  const memberId = url.searchParams.get("memberId");
  const limit = Math.min(100, parseInt(url.searchParams.get("limit") || "50"));
  const where: any = {};
  if (memberId) where.memberId = memberId;
  const logs = await prisma.activityLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return NextResponse.json(logs);
}
