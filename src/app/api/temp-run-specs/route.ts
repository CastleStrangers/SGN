import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);

  try {
    const action = url.searchParams.get("action") || "diagnose";

    if (action === "diagnose") {
      const [ar, nl, en, total, withImage, withoutImage, published] = await Promise.all([
        prisma.post.count({ where: { locale: "ar" } }),
        prisma.post.count({ where: { locale: "nl" } }),
        prisma.post.count({ where: { locale: "en" } }),
        prisma.post.count(),
        prisma.post.count({ where: { image: { not: null }, published: true } }),
        prisma.post.count({ where: { image: null, published: true } }),
        prisma.post.count({ where: { published: true } }),
      ]);

      const samples = await prisma.post.findMany({
        select: { id: true, title: true, locale: true, image: true, source: true, published: true },
        take: 10,
        orderBy: { createdAt: "desc" }
      });

      return NextResponse.json({
        counts: { ar, nl, en, total },
        imageStats: { withImage, withoutImage, published },
        samples
      });
    }

    if (action === "fix-images") {
      // Fix posts that have localhost/local image URLs 
      const localPosts = await prisma.post.findMany({
        where: {
          OR: [
            { image: { contains: "localhost" } },
            { image: { contains: "/uploads/sync/" } },
          ]
        },
        select: { id: true, image: true }
      });

      let fixed = 0;
      for (const post of localPosts) {
        await prisma.post.update({
          where: { id: post.id },
          data: { image: null }
        });
        fixed++;
      }

      return NextResponse.json({
        message: "Fixed posts with local image URLs - set to null so placeholders show",
        fixed,
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
