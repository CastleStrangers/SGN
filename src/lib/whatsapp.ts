import { getApiMessage } from './api-messages';

export async function sendWhatsAppMessage(to: string, message: string) {
  const instanceId = process.env.WHATSAPP_INSTANCE_ID;
  const token = process.env.WHATSAPP_TOKEN;
  if (!instanceId || !token) return;

  const formatted = to.startsWith("+") ? to.slice(1) : to.replace(/\s/g, "");

  try {
    await fetch(`https://api.ultramsg.com/${instanceId}/messages/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ token, to: formatted, body: message }),
    });
  } catch {
    // silently fail
  }
}

export async function sendMemberStatusWhatsApp(whatsapp: string, nameAr: string, status: string, notes?: string | null, locale = 'ar') {
  const isAccepted = status === "accepted";
  const msg = isAccepted
    ? getApiMessage(locale, 'whatsappMessages.accepted', { name: nameAr })
    : getApiMessage(locale, 'whatsappMessages.rejected', { name: nameAr })
      + (notes ? "\n\n" + getApiMessage(locale, 'whatsappMessages.notesLabel') + notes : '')
      + "\n\n" + getApiMessage(locale, 'whatsappMessages.contactPrompt');

  await sendWhatsAppMessage(whatsapp, msg);
}

export async function sendMemberConfirmationWhatsApp(whatsapp: string, nameAr: string, locale = 'ar') {
  const msg = getApiMessage(locale, 'whatsappMessages.confirmation', { name: nameAr });
  await sendWhatsAppMessage(whatsapp, msg);
}

export async function sendAdminNewMemberWhatsApp(nameAr: string, nameNl: string, originCity: string, nlProvincie: string, locale = 'ar') {
  const msg = getApiMessage(locale, 'whatsappMessages.adminNew', { name: nameAr })
    + "\n" + getApiMessage(locale, 'whatsappMessages.adminNewNameNl') + nameNl
    + "\n" + getApiMessage(locale, 'whatsappMessages.adminNewOrigin') + originCity
    + "\n" + getApiMessage(locale, 'whatsappMessages.adminNewProvince') + nlProvincie;

  const adminPhone = process.env.ADMIN_WHATSAPP;
  if (adminPhone) await sendWhatsAppMessage(adminPhone, msg);
}

export async function sendPendingReminderWhatsApp(whatsapp: string, nameAr: string, locale = 'ar') {
  const msg = getApiMessage(locale, 'whatsappMessages.pendingReminder', { name: nameAr })
    + "\n\n" + getApiMessage(locale, 'whatsappMessages.contactPrompt');
  await sendWhatsAppMessage(whatsapp, msg);
}
