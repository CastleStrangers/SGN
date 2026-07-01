import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Fix: Update all posts that have null locale or empty locale to "ar"
    const fixedNullLocale = await prisma.post.updateMany({
      where: {
        OR: [
          { locale: "" },
        ]
      },
      data: { locale: "ar" }
    });

    // 2. Count articles by locale for diagnostics
    const arCount = await prisma.post.count({ where: { locale: "ar" } });
    const nlCount = await prisma.post.count({ where: { locale: "nl" } });
    const enCount = await prisma.post.count({ where: { locale: "en" } });
    const totalCount = await prisma.post.count();
    
    // 3. Sample posts - check images
    const samples = await prisma.post.findMany({
      select: { id: true, title: true, locale: true, image: true, source: true, published: true },
      take: 15,
      orderBy: { createdAt: "desc" }
    });

    const withImage = await prisma.post.count({ where: { image: { not: null } } });
    const withoutImage = await prisma.post.count({ where: { image: null } });
    const published = await prisma.post.count({ where: { published: true } });

    return NextResponse.json({
      fixed: fixedNullLocale.count,
      counts: { ar: arCount, nl: nlCount, en: enCount, total: totalCount },
      imageStats: { withImage, withoutImage, published },
      samples
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
