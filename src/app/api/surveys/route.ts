import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAuthorize } from "@/lib/auth-helpers";
import { createSystemNotification } from "@/lib/notifications/service";

function unauth() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const active = searchParams.get("active");

  if (active === "true") {
    const surveys = await prisma.survey.findMany({
      where: {
        active: true,
        AND: [
          { OR: [{ startDate: null }, { startDate: { lte: new Date() } }] },
          { OR: [{ endDate: null }, { endDate: { gte: new Date() } }] },
        ],
      },
      include: { options: { orderBy: { votes: "desc" } }, _count: { select: { votes: true } } },
      orderBy: { createdAt: "desc" },
      take: 1,
    });
    return NextResponse.json(surveys);
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await requireAuthorize(session.user.id, "surveys.create"))) return unauth();

  const surveys = await prisma.survey.findMany({
    include: { options: true, _count: { select: { votes: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(surveys);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await requireAuthorize(session.user.id, "surveys.create"))) return unauth();

  const data = await req.json();
  const survey = await prisma.survey.create({
    data: {
      title: data.title,
      description: data.description || null,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      active: data.active ?? true,
      options: { create: data.options?.map((t: string) => ({ text: t })) || [] },
    },
    include: { options: true },
  });

  // Trigger system and push notifications for all users
  createSystemNotification({
    type: "survey",
    title: survey.title,
    descriptionOrContent: survey.description || "",
    link: "/surveys",
  }).catch(err => console.error("Error sending notification for survey:", err));

  return NextResponse.json(survey);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await requireAuthorize(session.user.id, "surveys.edit"))) return unauth();

  const data = await req.json();
  const { id, ...fields } = data;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const updateData: any = { ...fields };
  if (fields.startDate) updateData.startDate = new Date(fields.startDate);
  if (fields.endDate) updateData.endDate = new Date(fields.endDate);
  delete updateData.options;

  const survey = await prisma.survey.update({
    where: { id },
    data: updateData,
    include: { options: true },
  });

  return NextResponse.json(survey);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await requireAuthorize(session.user.id, "surveys.delete"))) return unauth();

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await prisma.survey.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
