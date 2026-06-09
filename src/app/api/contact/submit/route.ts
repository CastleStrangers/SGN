import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getApiMessage } from "@/lib/api-messages";

function t(req: Request, key: string) {
  const locale = (req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
  return getApiMessage(locale, key);
}

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();
    if (!name || !email || !subject || !message) return NextResponse.json({ error: t(req, 'api.allFieldsRequired') }, { status: 400 });
    await prisma.contact.create({ data: { name, email, subject, message } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: t(req, 'api.internalError') }, { status: 500 });
  }
}
