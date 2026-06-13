import { NextResponse } from "next/server";
import { readdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // 1. Get static uploads
    let staticImages: any[] = [];
    try {
      const dir = path.join(process.cwd(), "public", "uploads");
      const files = await readdir(dir);
      staticImages = files
        .filter(f => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f))
        .map(f => ({ 
          url: `/uploads/${f}`, 
          title: f.split(".")[0].replace(/[-_]/g, " "),
          source: "upload" 
        }));
    } catch (e) {
      console.warn("Could not read public/uploads directory:", e);
    }

    // 2. Get database post images
    const posts = await prisma.post.findMany({
      where: {
        published: true,
        image: { not: "" },
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        image: true,
        category: true,
        createdAt: true,
      }
    });

    const postImages = posts
      .filter((p: any) => p.image && p.image.trim() !== "")
      .map((p: any) => ({
        url: p.image,
        title: p.title,
        slug: p.slug || p.id,
        category: p.category,
        createdAt: p.createdAt,
        source: "post"
      }));

    // Combine them (db posts first since they are news articles, then static uploads)
    return NextResponse.json([...postImages, ...staticImages]);
  } catch (error) {
    console.error("[API/uploads] error:", error);
    return NextResponse.json([]);
  }
}
