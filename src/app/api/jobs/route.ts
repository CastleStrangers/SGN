import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET - جلب جميع الوظائف
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const city = searchParams.get('city');
    const province = searchParams.get('province');
    const remote = searchParams.get('remote');
    const featured = searchParams.get('featured');

    const where: any = {
      published: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    };
    if (category) {
      where.category = category;
    }
    if (type) {
      where.type = type;
    }
    if (city) {
      where.city = city;
    }
    if (province) {
      where.province = province;
    }
    if (remote === 'true') {
      where.remote = true;
    }
    if (featured === 'true') {
      where.featured = true;
    }

    const jobs = await prisma.job.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
        _count: {
          select: { applications: true },
        },
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
      take: 50,
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

// POST - إنشاء وظيفة جديدة
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { 
      title, 
      description, 
      company, 
      location, 
      city, 
      province, 
      type, 
      category, 
      salary, 
      requirements, 
      remote, 
      featured, 
      expiresAt 
    } = body;

    const job = await prisma.job.create({
      data: {
        title,
        description,
        company,
        location,
        city,
        province,
        type: type || 'full-time',
        category: category || 'general',
        salary,
        requirements,
        remote: remote || false,
        featured: featured || false,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}
