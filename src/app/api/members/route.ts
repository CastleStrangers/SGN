import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getApiMessage } from "@/lib/api-messages";

function tReq(req: Request, key: string) {
  const locale = (req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
  return getApiMessage(locale, key);
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: tReq(req, 'api.unauthorized') }, { status: 401 });
  }
  const members = await prisma.member.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(members);
}
