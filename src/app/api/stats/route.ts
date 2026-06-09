import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Revalidate public stats every 60 seconds to optimize DB queries
export const revalidate = 60;

export async function GET() {
  try {
    const [posts, users, events] = await Promise.all([
      prisma.post.count(),
      prisma.user.count(),
      prisma.event.count(),
    ]);

    const viewsResult = await prisma.post.aggregate({
      _sum: {
        views: true,
      },
    });

    return NextResponse.json({
      posts,
      users,
      events,
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
