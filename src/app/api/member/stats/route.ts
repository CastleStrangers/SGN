import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/mobile-auth";

export async function GET(req: Request) {
  const user = await getSessionUser(req);
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const member = await prisma.member.findUnique({
    where: { userId: user.id },
    select: { id: true, views: true }
  });

  if (!member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  // Get views grouped by day for the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const viewsByDay = await prisma.memberView.findMany({
    where: {
      memberId: member.id,
      createdAt: { gte: thirtyDaysAgo }
    },
    orderBy: { createdAt: "asc" }
  });

  // Group by date string (YYYY-MM-DD)
  const groupedViews = viewsByDay.reduce((acc: any, view) => {
    const date = view.createdAt.toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const viewsChartData = Object.keys(groupedViews).map(date => ({
    date,
    count: groupedViews[date]
  }));

  // Get average rating
  const reviews = await prisma.serviceReview.aggregate({
    where: { serviceId: member.id },
    _avg: { rating: true },
    _count: { id: true }
  });

  return NextResponse.json({
    totalViews: member.views,
    avgRating: reviews._avg.rating || 0,
    reviewCount: reviews._count.id,
    viewsChartData
  });
}
