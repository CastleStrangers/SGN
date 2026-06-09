import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendAdminNotificationEmail, sendMemberConfirmationEmail } from "@/lib/email";
import { sendMemberConfirmationWhatsApp, sendAdminNewMemberWhatsApp } from "@/lib/whatsapp";
import { sendTelegramNotification } from "@/lib/telegram";
import { getApiMessage } from "@/lib/api-messages";

function t(req: Request, key: string, vars?: Record<string, string>) {
  const locale = (req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
  return getApiMessage(locale, key, vars);
}

export async function POST(req: Request) {
  try {
    // rate limit: check duplicate whatsapp in last 24h
    const body = await req.json();
    const { nameAr, nameNl, birthYear, gender, originCity, whatsapp, email, nlProvincie, nlCity, expNl, expOutside, educationLevel, profession, skills, maritalStatus, agreed } = body;
    if (!nameAr || !nameNl || !birthYear || !gender || !originCity || !whatsapp || !nlProvincie || !nlCity) {
      return NextResponse.json({ error: t(req, 'api.allFieldsRequired') }, { status: 400 });
    }
    const lastDay = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recent = await prisma.member.findFirst({
      where: { whatsapp, createdAt: { gte: lastDay } },
    });
    if (recent) {
      return NextResponse.json({ error: t(req, 'api.duplicateRequest') }, { status: 429 });
    }
    // verify reCAPTCHA if configured
    const token = body.recaptchaToken;
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (token && recaptchaSecret) {
      const verify = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${recaptchaSecret}&response=${token}`,
      });
      const data = await verify.json();
      if (!data.success || data.score < 0.5) {
        return NextResponse.json({ error: t(req, 'api.recaptchaFailed') }, { status: 403 });
      }
    }
    const session = await getServerSession(authOptions);
    const last = await prisma.member.findFirst({ orderBy: { memberNumber: "desc" }, select: { memberNumber: true } });
    const memberNumber = (last?.memberNumber ?? 0) + 1;
    const member = await prisma.member.create({
      data: { memberNumber, nameAr, nameNl, birthYear: parseInt(birthYear), gender, originCity, whatsapp, email: email || null, nlProvincie, nlCity, expNl: expNl || null, expOutside: expOutside || null, educationLevel: educationLevel || null, profession: profession || null, skills: skills || null, maritalStatus: maritalStatus || null, agreed: agreed !== false, userId: session?.user?.id || null },
    });
    // notify all admins (in-app)
    const admins = await prisma.user.findMany({ where: { role: "admin" }, select: { id: true } });
    await prisma.notification.createMany({
      data: admins.map((a: { id: string }) => ({
        userId: a.id,
        title: t(req, 'api.newApplication'),
        message: t(req, 'api.newApplicationBy').replace('{name}', nameAr),
        link: "/dashboard/members",
      })),
    });
    const locale = (req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
    // email notifications (skip if SMTP not configured)
    await sendAdminNotificationEmail(nameAr, nameNl, whatsapp, originCity, locale);
    // use email from form first, fallback to session email
    const memberEmail = email || session?.user?.email || undefined;
    if (memberEmail) await sendMemberConfirmationEmail(memberEmail, nameAr, locale);
    // WhatsApp notifications (skip if WHATSAPP_INSTANCE_ID not set)
    await sendMemberConfirmationWhatsApp(whatsapp, nameAr, locale);
    await sendAdminNewMemberWhatsApp(nameAr, nameNl, originCity, nlProvincie, locale);
    // Telegram notification (skip if TELEGRAM_BOT_TOKEN not configured)
    await sendTelegramNotification(
      t(req, 'notification.telegramNewMember', {
        nameAr, nameNl, whatsapp, originCity, nlProvincie, nlCity,
        url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/members`
      })
    );
    return NextResponse.json({ message: t(req, 'api.registrationSuccess'), id: member.id });
  } catch (e: any) {
    console.error("Member registration error:", e?.message || e);
    return NextResponse.json({ error: t(req, 'api.registrationError') }, { status: 500 });
  }
}
