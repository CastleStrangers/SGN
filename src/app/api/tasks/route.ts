import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAuthorize } from "@/lib/auth-helpers";
import { getApiMessage } from "@/lib/api-messages";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const tasks = await prisma.task.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(tasks);
}

async function notifyAssigned(assignedTo: string, taskId: string, taskTitle: string, t: (key: string, vars?: Record<string, string>) => string) {
  await prisma.notification.create({
    data: {
      userId: assignedTo,
      title: t('notification.newTask'),
      message: t('notification.newTaskMessage', { title: taskTitle }),
      link: `/dashboard/tasks`,
    },
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await requireAuthorize((session.user as any).id, "tasks.create")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { title, description, priority, assignedTo } = await req.json();
  const task = await prisma.task.create({
    data: { title, description, priority: priority || "medium", createdBy: (session.user as any).id, assignedTo: assignedTo || null },
  });
  const locale = (req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
  const t = (key: string, vars?: Record<string, string>) => getApiMessage(locale, key, vars);
  if (assignedTo) {
    await notifyAssigned(assignedTo, task.id, title, t);
  }
  return NextResponse.json(task);
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await requireAuthorize((session.user as any).id, "tasks.edit")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id, status, title, description, priority, assignedTo } = await req.json();
  const existing = await prisma.task.findUnique({ where: { id } });
  const data: any = {};
  if (title !== undefined) data.title = title;
  if (description !== undefined) data.description = description;
  if (priority !== undefined) data.priority = priority;
  if (status !== undefined) data.status = status;
  if (assignedTo !== undefined) data.assignedTo = assignedTo;
  const task = await prisma.task.update({ where: { id }, data });
  const locale = (req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
  const t = (key: string, vars?: Record<string, string>) => getApiMessage(locale, key, vars);
  if (assignedTo && assignedTo !== existing?.assignedTo) {
    await notifyAssigned(assignedTo, id, task.title, t);
  }
  return NextResponse.json(task);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await requireAuthorize((session.user as any).id, "tasks.delete")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await req.json();
  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
