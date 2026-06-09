import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const now = new Date();
  const days30 = new Date(now.getTime() - 30 * 86400000);

  const [tasks, users, messages, events, subscribers, posts, comments, volunteers, ads, allComments, members, topPosts] = await Promise.all([
    prisma.task.count(),
    prisma.user.count(),
    prisma.contact.count(),
    prisma.event.count(),
    prisma.subscriber.count(),
    prisma.post.count(),
    prisma.comment.count(),
    prisma.volunteer.count(),
    prisma.ad.count(),
    prisma.comment.findMany({ select: { createdAt: true }, where: { createdAt: { gte: days30 } } }),
    prisma.member.findMany({ select: { status: true, createdAt: true } }),
    prisma.post.findMany({ select: { title: true, views: true, slug: true }, orderBy: { views: "desc" }, take: 10 }),
  ]);

  const totalViews = await prisma.post.aggregate({ _sum: { views: true } });
  const totalAdClicks = await prisma.ad.aggregate({ _sum: { clicks: true } });

  const membersByStatus: Record<string, number> = {};
  for (const m of members) {
    membersByStatus[m.status] = (membersByStatus[m.status] || 0) + 1;
  }

  // Comments per day (last 30 days)
  const commentsByDay: Record<string, number> = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date(now.getTime() - i * 86400000);
    const key = d.toISOString().split("T")[0];
    commentsByDay[key] = 0;
  }
  allComments.forEach((c: { createdAt: Date }) => {
    const key = c.createdAt.toISOString().split("T")[0];
    if (commentsByDay[key] !== undefined) commentsByDay[key]++;
  });

  // Users + Members registered per day (last 30 days)
  const recentUsers = await prisma.user.findMany({
    select: { createdAt: true },
    where: { createdAt: { gte: days30 } },
  });
  const usersByDay: Record<string, number> = {};
  const membersByDay: Record<string, number> = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date(now.getTime() - i * 86400000);
    const key = d.toISOString().split("T")[0];
    usersByDay[key] = 0;
    membersByDay[key] = 0;
  }
  recentUsers.forEach((u: { createdAt: Date }) => {
    const key = u.createdAt.toISOString().split("T")[0];
    if (usersByDay[key] !== undefined) usersByDay[key]++;
  });
  members.forEach((m: { createdAt: Date }) => {
    const key = new Date(m.createdAt).toISOString().split("T")[0];
    if (membersByDay[key] !== undefined) membersByDay[key]++;
  });

  const postCategories = await prisma.post.groupBy({
    by: ["category"],
    _count: true,
    orderBy: { _count: { category: "desc" } },
  });
  const postsByCategory = postCategories.map((p: any) => ({ name: p.category, count: p._count }));

  return NextResponse.json({
    tasks, users, messages, events, subscribers, posts, comments, volunteers, ads,
    totalViews: totalViews._sum.views || 0,
    totalAdClicks: totalAdClicks._sum.clicks || 0,
    membersByStatus,
    topPosts: topPosts.map((p: any) => ({ title: p.title, views: p.views, slug: p.slug })),
    postsByCategory,
    commentsByDay: Object.entries(commentsByDay).reverse().map(([date, count]) => ({ date, count })),
    usersByDay: Object.entries(usersByDay).reverse().map(([date, count]) => ({ date, count })),
    membersByDay: Object.entries(membersByDay).reverse().map(([date, count]) => ({ date, count })),
  });
}
