import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { eventId } = await req.json();
  if (!eventId) {
    return NextResponse.json({ error: "Missing eventId" }, { status: 400 });
  }

  const member = await prisma.member.findUnique({
    where: { userId: session.user.id },
  });

  if (!member) {
    return NextResponse.json({ error: "Member profile not found" }, { status: 404 });
  }

  if (member.status !== "accepted") {
    return NextResponse.json({ error: "Membership not accepted yet" }, { status: 403 });
  }

  try {
    const registration = await prisma.eventRegistration.create({
      data: {
        eventId,
        memberId: member.id,
      },
    });
    return NextResponse.json(registration);
  } catch (e) {
    return NextResponse.json({ error: "Already registered" }, { status: 400 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");

  const member = await prisma.member.findUnique({
    where: { userId: session.user.id },
  });

  if (!member) {
    return NextResponse.json({ error: "Member profile not found" }, { status: 404 });
  }

  if (eventId) {
    const reg = await prisma.eventRegistration.findUnique({
      where: {
        eventId_memberId: {
          eventId,
          memberId: member.id,
        },
      },
    });
    return NextResponse.json({ registered: !!reg });
  }

  const regs = await prisma.eventRegistration.findMany({
    where: { memberId: member.id },
    include: { event: true },
  });
  return NextResponse.json(regs);
}
