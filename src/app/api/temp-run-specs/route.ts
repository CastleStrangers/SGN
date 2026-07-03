import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const action = url.searchParams.get("action") || "diagnose";

  try {
    if (action === "diagnose") {
      // Try a safe query to see what fields exist
      const total = await prisma.post.count();
      const published = await prisma.post.count({ where: { published: true } });

      // Try locale field
      let arCount = 0, nlCount = 0, enCount = 0, nullCount = 0;
      try {
        arCount = await prisma.post.count({ where: { locale: "ar" } });
        nlCount = await prisma.post.count({ where: { locale: "nl" } });
        enCount = await prisma.post.count({ where: { locale: "en" } });
        nullCount = await prisma.post.count({ where: { locale: null } });
      } catch (e: any) {
        return NextResponse.json({ 
          error: "locale field missing from DB", 
          detail: e.message,
          total, published
        });
      }

      // Sample posts
      const samples = await prisma.post.findMany({
        select: { id: true, title: true, locale: true, image: true, source: true },
        take: 8,
        orderBy: { createdAt: "desc" }
      });

      // Image stats
      const withImage = await prisma.post.count({ where: { image: { not: null } } });
      const withLocalImage = samples.filter(p => p.image?.includes("/uploads/") || p.image?.includes("localhost")).length;

      return NextResponse.json({
        total, published,
        localeCounts: { ar: arCount, nl: nlCount, en: enCount, null: nullCount },
        imageStats: { withImage, withoutImage: total - withImage, withLocalImage },
        samples
      });
    }

    if (action === "fix-locale") {
      // Update posts with null/empty locale to "ar"
      const result = await prisma.$executeRawUnsafe(
        `UPDATE "Post" SET locale = 'ar' WHERE locale IS NULL OR locale = ''`
      );
      return NextResponse.json({ fixed: result });
    }

    if (action === "fix-images") {
      // Clear local/localhost image URLs (they don't work in production)
      const localPosts = await prisma.post.findMany({
        where: {
          OR: [
            { image: { contains: "/uploads/" } },
            { image: { contains: "localhost" } },
          ]
        },
        select: { id: true, image: true }
      });
      for (const p of localPosts) {
        await prisma.post.update({ where: { id: p.id }, data: { image: null } });
      }
      return NextResponse.json({ fixed: localPosts.length, examples: localPosts.slice(0, 5) });
    }

    return NextResponse.json({ error: "unknown action" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, stack: error.stack?.slice(0, 500) }, { status: 500 });
  }
}
