import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendStatusChangeEmail } from "@/lib/email";
import { sendMemberStatusWhatsApp } from "@/lib/whatsapp";
import { logActivity } from "@/lib/activity";
import { getApiMessage } from "@/lib/api-messages";

function t(req: Request, key: string) {
  const locale = (req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
  return getApiMessage(locale, key);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: t(req, 'api.unauthorized') }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await req.json();
    const { memberNumber, status, notes, nameAr, nameNl, email, whatsapp, originCity, nlProvincie, nlCity, expNl, expOutside, birthYear, gender, educationLevel, profession, skills, maritalStatus, avatar, showInPublicProfile } = body;
    const updateData: Record<string, any> = {};
    if (memberNumber !== undefined) updateData.memberNumber = parseInt(memberNumber);
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (nameAr) updateData.nameAr = nameAr;
    if (nameNl) updateData.nameNl = nameNl;
    if (email !== undefined) updateData.email = email;
    if (whatsapp) updateData.whatsapp = whatsapp;
    if (originCity) updateData.originCity = originCity;
    if (nlProvincie) updateData.nlProvincie = nlProvincie;
    if (nlCity) updateData.nlCity = nlCity;
    if (expNl !== undefined) updateData.expNl = expNl;
    if (expOutside !== undefined) updateData.expOutside = expOutside;
    if (birthYear) updateData.birthYear = parseInt(birthYear);
    if (gender) updateData.gender = gender;
    if (educationLevel !== undefined) updateData.educationLevel = educationLevel;
    if (profession !== undefined) updateData.profession = profession;
    if (skills !== undefined) updateData.skills = skills;
    if (maritalStatus !== undefined) updateData.maritalStatus = maritalStatus;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (showInPublicProfile !== undefined) updateData.showInPublicProfile = showInPublicProfile;
    const member = await prisma.member.update({
      where: { id },
      data: updateData,
    });
    const locale = (req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
    if (status && ["accepted", "rejected"].includes(status)) {
      const targetEmail = member.email || (await prisma.user.findUnique({ where: { id: member.userId || "" } }))?.email;
      if (targetEmail) {
        sendStatusChangeEmail(targetEmail, member.nameAr, status, member.id, notes || body.notes, locale);
      }
      sendMemberStatusWhatsApp(member.whatsapp, member.nameAr, status, notes || body.notes, locale);
    }
    await logActivity(id, status ? `status->${status}` : "update", notes || body.notes || undefined, session.user.id);
    return NextResponse.json(member);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: t(_, 'api.unauthorized') }, { status: 401 });
  }
  try {
    const { id } = await params;
    await prisma.member.delete({ where: { id } });
    return NextResponse.json({ message: t(_, 'api.deleted') });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
