import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        title: true,
        image: true,
        source: true,
        createdAt: true,
        tags: true,
      },
    })
    return NextResponse.json({ success: true, count: posts.length, posts })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) })
  }
}
