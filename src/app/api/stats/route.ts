import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [postsCount, membersCount, usersCount, eventsCount] = await Promise.all([
      prisma.post.count({ where: { published: true } }),
      prisma.member.count(),
      prisma.user.count(),
      prisma.event.count({ where: { published: true } }),
    ]);

    const viewsResult = await prisma.post.aggregate({
      where: { published: true },
      _sum: {
        views: true,
      },
    });

    // Registered members should be from Member table, but fallback to User count if no members are registered yet (e.g. fresh dev DB)
    const members = membersCount > 0 ? membersCount : usersCount;

    return NextResponse.json({
      posts: postsCount,
      users: members,
      events: eventsCount,
      totalViews: viewsResult._sum.views || 0,
    });
  } catch (error) {
    console.error("Failed to fetch public stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
