import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getApiMessage } from "@/lib/api-messages";

function t(_req: Request, key: string) {
  const locale = (_req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
  return getApiMessage(locale, key);
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await prisma.member.findUnique({
    where: { id, status: "accepted", showInPublicProfile: true },
    select: {
      id: true, memberNumber: true, nameAr: true, nameNl: true, birthYear: true, gender: true,
      originCity: true, nlProvincie: true, nlCity: true,
      educationLevel: true, profession: true, skills: true, maritalStatus: true,
      expNl: true, expOutside: true, createdAt: true,
    },
  });
  if (!member) {
    return NextResponse.json({ error: t(_req, 'api.notFound') }, { status: 404 });
  }
  return NextResponse.json(member);
}
