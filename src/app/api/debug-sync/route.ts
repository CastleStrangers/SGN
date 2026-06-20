import { NextResponse } from "next/server"
import { extractArticles } from "@/lib/sync/extractor"

export async function GET() {
  try {
    const articles = await extractArticles({
      name: "sy-nl.org",
      type: "webpage",
      url: "https://www.sy-nl.org/nbdh-aljalyh",
      enabled: true,
    })

    const details = articles.map(art => ({
      title: art.title,
      image: art.image || null,
      mediaUrls: art.mediaUrls || [],
      contentSnippet: art.content.slice(0, 200),
      sourceUrl: art.sourceUrl,
    }))

    return NextResponse.json({ success: true, count: articles.length, details })
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined
    })
  }
}
