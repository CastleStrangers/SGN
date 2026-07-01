import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);

  try {
    const action = url.searchParams.get("action") || "diagnose";

    if (action === "diagnose") {
      // Diagnostic mode: show counts by locale
      const [ar, nl, en, total, withImage, withoutImage, published, samples] = await Promise.all([
        prisma.post.count({ where: { locale: "ar" } }),
        prisma.post.count({ where: { locale: "nl" } }),
        prisma.post.count({ where: { locale: "en" } }),
        prisma.post.count(),
        prisma.post.count({ where: { image: { not: null }, published: true } }),
        prisma.post.count({ where: { image: null, published: true } }),
        prisma.post.count({ where: { published: true } }),
        prisma.post.findMany({
          select: { id: true, title: true, locale: true, image: true, source: true, published: true },
          take: 10,
          orderBy: { createdAt: "desc" }
        })
      ]);

      return NextResponse.json({
        counts: { ar, nl, en, total },
        imageStats: { withImage, withoutImage, published },
        samples
      });
    }

    if (action === "fix-locale") {
      // Fix all posts that somehow ended up with wrong or missing locale
      // In SQLite, null is stored as empty string sometimes due to schema defaults

      // First, get all posts without locale info to see what we have
      const allPosts = await prisma.post.findMany({
        select: { id: true, locale: true, source: true },
      });

      const needsFix = allPosts.filter(p => !p.locale || p.locale === "");
      
      let fixed = 0;
      for (const post of needsFix) {
        await prisma.post.update({
          where: { id: post.id },
          data: { locale: "ar" }
        });
        fixed++;
      }

      return NextResponse.json({
        message: "Fixed posts without locale",
        fixed,
        total: allPosts.length
      });
    }

    if (action === "fix-images") {
      // Update posts that have localhost image URLs to use a placeholder
      const localPosts = await prisma.post.findMany({
        where: {
          OR: [
            { image: { contains: "localhost" } },
            { image: { contains: "/uploads/sync/" } },
          ]
        },
        select: { id: true, image: true, title: true }
      });

      let fixed = 0;
      for (const post of localPosts) {
        // Set image to null so the placeholder kicks in
        await prisma.post.update({
          where: { id: post.id },
          data: { image: null }
        });
        fixed++;
      }

      return NextResponse.json({
        message: "Fixed posts with localhost/local image URLs",
        fixed,
        examples: localPosts.slice(0, 5).map(p => ({ id: p.id, oldImage: p.image }))
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}
