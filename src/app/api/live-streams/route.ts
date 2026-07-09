import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET - جلب جميع البثوث المباشرة
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');

    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (featured === 'true') {
      where.featured = true;
    }

    const streams = await prisma.liveStream.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
      },
      orderBy: [
        { status: 'desc' },
        { scheduledAt: 'asc' },
      ],
      take: 50,
    });

    return NextResponse.json(streams);
  } catch (error) {
    console.error('Error fetching live streams:', error);
    return NextResponse.json({ error: 'Failed to fetch live streams' }, { status: 500 });
  }
}

// POST - إنشاء بث مباشر جديد
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, thumbnail, streamUrl, streamKey, platform, scheduledAt, featured, membersOnly } = body;

    const stream = await prisma.liveStream.create({
      data: {
        title,
        description,
        thumbnail,
        streamUrl,
        streamKey,
        platform: platform || 'youtube',
        status: scheduledAt ? 'scheduled' : 'live',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        startedAt: !scheduledAt ? new Date() : null,
        featured: featured || false,
        membersOnly: membersOnly || false,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(stream);
  } catch (error) {
    console.error('Error creating live stream:', error);
    return NextResponse.json({ error: 'Failed to create live stream' }, { status: 500 });
  }
}
