import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
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
    const { status, subject, message } = await req.json();
    if (!subject || !message) {
      return NextResponse.json({ error: t(req, 'api.subjectMessageRequired') }, { status: 400 });
    }
    const where: any = {};
    if (status && status !== "all") where.status = status;
    const members = await prisma.member.findMany({ where, select: { email: true, nameAr: true } });
    const emails = members.filter((m: { email: string | null }) => m.email).map((m: { email: string | null }) => m.email as string);

    if (emails.length === 0) {
      return NextResponse.json({ error: t(req, 'api.noMembersForStatus') }, { status: 400 });
    }

    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.hostinger.com",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: (Number(process.env.SMTP_PORT) || 465) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    let sent = 0;
    const fromName = process.env.SMTP_FROM_NAME || t(req, 'emailTemplates.senderName');
    const fromAddr = process.env.SMTP_FROM || process.env.SMTP_USER || "";
    if (!fromAddr) return NextResponse.json({ error: t(req, 'api.smtpNotConfigured') }, { status: 500 });

    for (const email of emails) {
      try {
        await transporter.sendMail({
          from: `"${fromName}" <${fromAddr}>`,
          to: email,
          subject,
          html: message,
        });
        sent++;
      } catch {}
    }

    return NextResponse.json({ sent, total: emails.length });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
