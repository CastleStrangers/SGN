import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAuthorize } from "@/lib/auth-helpers";
import { getApiMessage } from "@/lib/api-messages";

function t(req: Request, key: string) {
  const locale = (req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
  return getApiMessage(locale, key);
}

export async function POST(req: Request) {
  try {
    const { name, email, phone, skills, availability, message } = await req.json();
    if (!name || !email) return NextResponse.json({ error: t(req, 'api.nameEmailRequired') }, { status: 400 });

    await prisma.volunteer.create({
      data: { name, email, phone, skills, availability, message },
    });

    return NextResponse.json({ message: t(req, 'api.volunteerRegistered') });
  } catch {
    return NextResponse.json({ error: t(req, 'api.genericError') }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await requireAuthorize(session.user.id, "volunteers.view")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const volunteers = await prisma.volunteer.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(volunteers);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
