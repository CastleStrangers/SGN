import nodemailer from "nodemailer";
import { getApiMessage } from './api-messages';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.hostinger.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: (Number(process.env.SMTP_PORT) || 465) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const fromName = process.env.SMTP_FROM_NAME;
const fromAddr = process.env.SMTP_FROM || process.env.SMTP_USER || "";
const isConfigured = () => !!process.env.SMTP_HOST && !!process.env.SMTP_USER && !!process.env.SMTP_PASS;

function t(locale: string, key: string, vars?: Record<string, string>) {
  return getApiMessage(locale, key, vars);
}

export async function sendPasswordResetEmail(email: string, token: string, locale = 'ar') {
  if (!isConfigured()) return;
  const senderName = fromName || t(locale, 'emailTemplates.senderName');
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${token}`;
  await transporter.sendMail({
    from: `"${senderName}" <${fromAddr}>`,
    to: email,
    subject: t(locale, 'emailTemplates.resetPasswordSubject'),
    html: `
      <div style="font-family: Arial; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo.png" style="width: 48px; height: 48px;" />
        <h2 style="color: #1a5632;">${t(locale, 'emailTemplates.resetPasswordHeading')}</h2>
        <p>${t(locale, 'emailTemplates.resetPasswordBody')}</p>
        <a href="${resetUrl}" style="display: inline-block; background: #1a5632; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">
          ${t(locale, 'emailTemplates.resetPasswordBtn')}
        </a>
        <p style="color: #6b7280; font-size: 12px;">${t(locale, 'emailTemplates.resetPasswordFooter')}</p>
      </div>
    `,
  });
}

export async function sendMemberConfirmationEmail(email: string | undefined, nameAr: string, locale = 'ar') {
  if (!isConfigured() || !email) return;
  const senderName = fromName || t(locale, 'emailTemplates.senderName');
  await transporter.sendMail({
    from: `"${senderName}" <${fromAddr}>`,
    to: email,
    subject: t(locale, 'emailTemplates.memberConfirmSubject'),
    html: `
      <div style="font-family: Arial; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo.png" style="width: 48px; height: 48px;" />
        <h2 style="color: #1a5632;">${t(locale, 'emailTemplates.memberConfirmGreeting', { name: nameAr })}</h2>
        <p>${t(locale, 'emailTemplates.memberConfirmBody')}</p>
        <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">${t(locale, 'emailTemplates.memberConfirmFooter')}</p>
      </div>
    `,
  });
}

export async function sendAdminNotificationEmail(nameAr: string, nameNl: string, whatsapp: string, originCity: string, locale = 'ar') {
  if (!isConfigured()) return;
  const senderName = fromName || t(locale, 'emailTemplates.senderName');
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/members`;
  if (!fromAddr) return;
  await transporter.sendMail({
    from: `"${senderName}" <${fromAddr}>`,
    to: fromAddr,
    subject: t(locale, 'emailTemplates.adminNewSubject', { name: nameAr }),
    html: `
      <div style="font-family: Arial; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #1a5632;">${t(locale, 'emailTemplates.adminNewHeading')}</h2>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${t(locale, 'emailTemplates.adminNameLabel')}</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${nameAr}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${t(locale, 'emailTemplates.adminNameNlLabel')}</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;" dir="ltr">${nameNl}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${t(locale, 'emailTemplates.adminWhatsappLabel')}</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;" dir="ltr">${whatsapp}</td></tr>
          <tr><td style="padding: 8px; color: #6b7280;">${t(locale, 'emailTemplates.adminOriginLabel')}</td><td style="padding: 8px;">${originCity}</td></tr>
        </table>
        <a href="${dashboardUrl}" style="display: inline-block; background: #1a5632; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
          ${t(locale, 'emailTemplates.adminViewDashboard')}
        </a>
      </div>
    `,
  });
}

export async function sendStatusChangeEmail(email: string, nameAr: string, status: string, memberId: string, notes?: string | null, locale = 'ar') {
  if (!isConfigured() || !email) return;
  const senderName = fromName || t(locale, 'emailTemplates.senderName');
  const isAccepted = status === "accepted";
  const subject = isAccepted ? t(locale, 'emailTemplates.statusAcceptedSubject') : t(locale, 'emailTemplates.statusUpdatedSubject');
  const headline = isAccepted
    ? t(locale, 'emailTemplates.statusAcceptedGreeting', { name: nameAr })
    : t(locale, 'emailTemplates.statusRejectedGreeting', { name: nameAr });
  const body = isAccepted
    ? t(locale, 'emailTemplates.statusAcceptedBody')
    : t(locale, 'emailTemplates.statusRejectedBody');
  const profileUrl = `${process.env.NEXT_PUBLIC_APP_URL}/member/${memberId}`;

  await transporter.sendMail({
    from: `"${senderName}" <${fromAddr}>`,
    to: email,
    subject,
    html: `
      <div style="font-family: Arial; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo.png" style="width: 48px; height: 48px;" />
        <h2 style="color: #1a5632;">${headline}</h2>
        <p>${body}</p>
        ${notes ? `<div style="background: #fef3c7; padding: 12px; border-radius: 8px; margin: 16px 0; color: #92400e; font-size: 13px;"><strong>${t(locale, 'emailTemplates.notesLabel')}</strong> ${notes}</div>` : ""}
        ${isAccepted ? `<a href="${profileUrl}" style="display: inline-block; background: #1a5632; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">${t(locale, 'emailTemplates.viewProfileBtn')}</a>` : ""}
        <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">${t(locale, 'emailTemplates.footerTagline')}</p>
      </div>
    `,
  });
}
