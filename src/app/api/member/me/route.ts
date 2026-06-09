import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getApiMessage } from "@/lib/api-messages";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: tReq(req, 'api.unauthorized') }, { status: 401 });
  }
  const member = await prisma.member.findUnique({
    where: { userId: session.user.id },
  });
  return NextResponse.json({ member });
}

function tReq(req: Request, key: string) {
  const locale = (req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
  return getApiMessage(locale, key);
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: tReq(req, 'api.unauthorized') }, { status: 401 });
  }
  try {
    const body = await req.json();
    const member = await prisma.member.findUnique({
      where: { userId: session.user.id },
    });
    if (!member) {
      return NextResponse.json({ error: tReq(req, 'api.noApplication') }, { status: 404 });
    }
    if (member.status === "accepted") {
      return NextResponse.json({ error: tReq(req, 'api.cannotEditAfterAcceptance') }, { status: 403 });
    }
    const allowed = ["nameAr", "nameNl", "email", "whatsapp", "originCity", "nlProvincie", "nlCity", "expNl", "expOutside", "educationLevel", "profession", "skills", "maritalStatus", "showInPublicProfile"];
    const updateData: Record<string, any> = {};
    for (const key of allowed) {
      if (body[key] !== undefined) updateData[key] = body[key];
    }
    if (body.birthYear) updateData.birthYear = parseInt(body.birthYear);
    if (body.gender) updateData.gender = body.gender;
    const updated = await prisma.member.update({
      where: { id: member.id },
      data: updateData,
    });
    return NextResponse.json({ member: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
