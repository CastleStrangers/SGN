import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { taskId } = await req.json();
  if (!taskId) {
    return NextResponse.json({ error: "Missing taskId" }, { status: 400 });
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
    const app = await prisma.taskApplication.create({
      data: {
        taskId,
        memberId: member.id,
      },
    });
    return NextResponse.json(app);
  } catch (e) {
    return NextResponse.json({ error: "Already applied" }, { status: 400 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get("taskId");

  const member = await prisma.member.findUnique({
    where: { userId: session.user.id },
  });

  if (!member) {
    return NextResponse.json({ error: "Member profile not found" }, { status: 404 });
  }

  if (taskId) {
    const app = await prisma.taskApplication.findUnique({
      where: {
        taskId_memberId: {
          taskId,
          memberId: member.id,
        },
      },
    });
    return NextResponse.json({ applied: !!app, status: app?.status || null });
  }

  const apps = await prisma.taskApplication.findMany({
    where: { memberId: member.id },
    include: { task: true },
  });
  return NextResponse.json(apps);
}
