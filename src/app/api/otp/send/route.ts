import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { getApiMessage } from "@/lib/api-messages";

function tReq(req: Request, key: string) {
  const locale = (req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
  return getApiMessage(locale, key);
}

export async function POST(req: Request) {
  try {
    const locale = (req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
    const { identifier } = await req.json();
    if (!identifier) {
      return NextResponse.json({ error: tReq(req, 'api.otpIdentifierRequired') }, { status: 400 });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Invalidate old codes for this identifier
    await prisma.otpCode.updateMany({
      where: { identifier, used: false },
      data: { used: true },
    });

    await prisma.otpCode.create({
      data: { identifier, code, expiresAt },
    });

    // Send via WhatsApp if it looks like a phone number
    const isPhone = /^\+?\d{7,15}$/.test(identifier.replace(/\s/g, ""));
    if (isPhone) {
      const msg = getApiMessage(locale, 'otp.whatsappMessage', { code, expiresIn: "5" });
      await sendWhatsAppMessage(identifier, msg);
    }

    // Also send via email if it looks like an email
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    if (isEmail) {
      // We'll send via the existing email transport
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.hostinger.com",
        port: Number(process.env.SMTP_PORT) || 465,
        secure: (Number(process.env.SMTP_PORT) || 465) === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      const fromAddr = process.env.SMTP_FROM || process.env.SMTP_USER || "";
      if (fromAddr) {
        const senderName = process.env.SMTP_FROM_NAME || tReq(req, 'otp.senderName');
        await transporter.sendMail({
          from: `"${senderName}" <${fromAddr}>`,
          to: identifier,
          subject: tReq(req, 'otp.emailSubject'),
          html: `
            <div style="font-family: Arial; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
              <h2 style="color: #1a5632;">${getApiMessage(locale, 'otp.emailHeading')}</h2>
              <p>${getApiMessage(locale, 'otp.emailBody')}</p>
              <div style="font-size: 32px; font-weight: bold; text-align: center; color: #1a5632; letter-spacing: 8px; padding: 16px; background: #f0fdf4; border-radius: 8px; margin: 16px 0;">${code}</div>
              <p style="color: #6b7280; font-size: 12px;">${getApiMessage(locale, 'otp.emailExpiry', { minutes: "5" })}</p>
            </div>
          `,
        });
      }
    }

    return NextResponse.json({ message: tReq(req, 'api.otpSent'), expiresIn: 300 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}