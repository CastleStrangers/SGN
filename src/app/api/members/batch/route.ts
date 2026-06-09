import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logActivity } from "@/lib/activity";
import { sendStatusChangeEmail } from "@/lib/email";
import { sendMemberStatusWhatsApp } from "@/lib/whatsapp";
import { getApiMessage } from "@/lib/api-messages";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const locale = (req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
  const err = (key: string) => getApiMessage(locale, key);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: err('api.unauthorized') }, { status: 401 });
  }
  try {
    const { ids, action, status, notes } = await req.json();
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: err('api.selectMembersFirst') }, { status: 400 });
    }
    if (action === "delete") {
      await prisma.member.deleteMany({ where: { id: { in: ids } } });
      for (const id of ids) {
        await logActivity(id, "delete", err('activity.batchDelete'), session.user.id);
      }
      return NextResponse.json({ message: err('api.deleted') });
    }
    if (action === "status" && status) {
      const members = await prisma.member.findMany({ where: { id: { in: ids } } });
      await prisma.member.updateMany({ where: { id: { in: ids } }, data: { status, notes: notes || undefined } });
      for (const m of members) {
        await logActivity(m.id, `status->${status}`, notes || undefined, session.user.id);
        const email = m.email || (await prisma.user.findUnique({ where: { id: m.userId || "" } }))?.email;
        if (email) sendStatusChangeEmail(email, m.nameAr, status, m.id, notes);
        sendMemberStatusWhatsApp(m.whatsapp, m.nameAr, status, notes);
      }
      return NextResponse.json({ message: err('api.membersUpdated').replace('{count}', String(ids.length)) });
    }
    return NextResponse.json({ error: err('api.unknownAction') }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
