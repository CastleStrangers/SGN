import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getApiMessage } from "@/lib/api-messages";
import { getSessionUser } from "@/lib/mobile-auth";

export async function GET(req: Request) {
  const user = await getSessionUser(req);
  if (!user?.id) {
    return NextResponse.json({ error: tReq(req, 'api.unauthorized') }, { status: 401 });
  }
  const member = await prisma.member.findUnique({
    where: { userId: user.id },
  });
  return NextResponse.json({ member });
}

function tReq(req: Request, key: string) {
  const locale = (req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
  return getApiMessage(locale, key);
}

export async function PATCH(req: Request) {
  const user = await getSessionUser(req);
  if (!user?.id) {
    return NextResponse.json({ error: tReq(req, 'api.unauthorized') }, { status: 401 });
  }
  try {
    const body = await req.json();
    const member = await prisma.member.findUnique({
      where: { userId: user.id },
    });
    if (!member) {
      return NextResponse.json({ error: tReq(req, 'api.noApplication') }, { status: 404 });
    }

    const allowed = ["nameAr", "nameNl", "email", "whatsapp", "originCity", "nlProvincie", "nlCity", "expNl", "expOutside", "educationLevel", "profession", "skills", "maritalStatus", "showInPublicProfile", "isCvPublic", "isServiceProvider", "serviceDescription"];
    const updateData: Record<string, any> = {};
    for (const key of allowed) {
      if (body[key] !== undefined) updateData[key] = body[key];
    }
    if (body.birthYear) updateData.birthYear = parseInt(body.birthYear);
    if (body.gender) updateData.gender = body.gender;

    // Check if editing core profile fields when accepted (only showInPublicProfile and isCvPublic are allowed after acceptance)
    const isEditingCoreFields = Object.keys(updateData).some(key => 
      !["showInPublicProfile", "isCvPublic"].includes(key)
    );

    if (member.status === "accepted" && isEditingCoreFields) {
      return NextResponse.json({ error: tReq(req, 'api.cannotEditAfterAcceptance') }, { status: 403 });
    }

    const updated = await prisma.member.update({
      where: { id: member.id },
      data: updateData,
    });
    return NextResponse.json({ member: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
