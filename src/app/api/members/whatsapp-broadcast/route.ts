import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { getApiMessage } from "@/lib/api-messages";

function t(req: Request, key: string) {
  const locale = (req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
  return getApiMessage(locale, key);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: t(req, 'api.unauthorized') }, { status: 401 });
  }
  try {
    const { status, message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: t(req, 'api.subjectMessageRequired') }, { status: 400 });
    }
    const where: any = {};
    if (status && status !== "all") where.status = status;
    const members = await prisma.member.findMany({ where, select: { whatsapp: true, nameAr: true } });
    const phones = members.filter((m: { whatsapp: string }) => m.whatsapp).map((m: { whatsapp: string }) => m.whatsapp);

    if (phones.length === 0) {
      return NextResponse.json({ error: t(req, 'api.noMembersForStatus') }, { status: 400 });
    }

    let sent = 0;
    for (const phone of phones) {
      try {
        await sendWhatsAppMessage(phone, message);
        sent++;
      } catch {}
    }

    return NextResponse.json({ sent, total: phones.length });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}