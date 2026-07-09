import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET - جلب جميع الدورات
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const featured = searchParams.get('featured');
    const instructorId = searchParams.get('instructorId');

    const where: any = {
      published: true,
    };
    if (category) {
      where.category = category;
    }
    if (level) {
      where.level = level;
    }
    if (featured === 'true') {
      where.featured = true;
    }
    if (instructorId) {
      where.instructorId = instructorId;
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        instructor: {
          select: { id: true, name: true, image: true },
        },
        _count: {
          select: { lessons: true, enrollments: true },
        },
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
      take: 50,
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

// POST - إنشاء دورة جديدة
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, thumbnail, category, level, duration, price, featured } = body;

    const course = await prisma.course.create({
      data: {
        title,
        description,
        thumbnail,
        category: category || 'general',
        level: level || 'beginner',
        duration,
        price: price || 0,
        featured: featured || false,
        instructorId: session.user.id,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}
