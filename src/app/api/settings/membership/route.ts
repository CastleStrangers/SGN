import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getApiMessage } from "@/lib/api-messages";

function tReq(req: Request, key: string) {
  const locale = (req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
  return getApiMessage(locale, key);
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: tReq(req, 'api.unauthorized') }, { status: 403 });
  }
  const row = await prisma.appSetting.findUnique({ where: { key: "membership" } });
  const settings = row ? JSON.parse(row.value) : defaultSettings();
  return NextResponse.json(settings);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: tReq(req, 'api.unauthorized') }, { status: 403 });
  }
  const body = await req.json();
  await prisma.appSetting.upsert({
    where: { key: "membership" },
    update: { value: JSON.stringify(body) },
    create: { key: "membership", value: JSON.stringify(body) },
  });
  return NextResponse.json({ ok: true });
}

function defaultSettings() {
  return {
    nameAr: true, nameNl: true, birthYear: true, gender: true,
    originCity: true, whatsapp: true, email: true,
    nlProvincie: true, nlCity: true,
    expNl: true, expOutside: true,
    educationLevel: true, profession: true, skills: true, maritalStatus: true,
    aiScanner: true, transliterate: true, polish: true,
  };
}
