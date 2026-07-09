import { NextRequest, NextResponse } from "next/server";
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

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await requireAuthorize(session.user.id, "volunteers.view")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 200);
    const offset = Number(searchParams.get("offset")) || 0;
    const search = searchParams.get("search");

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { skills: { contains: search } },
      ];
    }

    const [volunteers, total] = await Promise.all([
      prisma.volunteer.findMany({ where, orderBy: { createdAt: "desc" }, take: limit, skip: offset }),
      prisma.volunteer.count({ where }),
    ]);

    return NextResponse.json({ volunteers, total, limit, offset });
  } catch {
    return NextResponse.json({ volunteers: [], total: 0, limit: 50, offset: 0 }, { status: 500 });
  }
}
