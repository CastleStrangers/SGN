import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 60,
    })

    const details = posts.map(p => ({
      id: p.id,
      title: p.title,
      source: p.source,
      image: p.image,
      createdAt: p.createdAt,
      sourceUrl: p.sourceUrl,
    }))

    return NextResponse.json({ success: true, count: posts.length, details })
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : String(err),
    })
  }
}
