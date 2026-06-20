import { NextResponse } from "next/server"
import { extractArticles } from "@/lib/sync/extractor"

export async function GET() {
  try {
    const pageId = process.env.FACEBOOK_PAGE_ID
    const token = process.env.FACEBOOK_PAGE_TOKEN

    if (!pageId || !token) {
      return NextResponse.json({ error: "Missing FACEBOOK_PAGE_ID or FACEBOOK_PAGE_TOKEN in .env" })
    }

    const params = new URLSearchParams({
      fields: "id,message,story,full_picture,created_time,permalink_url,attachments",
      limit: "25",
      access_token: token,
    })

    const url = `https://graph.facebook.com/v19.0/${pageId}/posts?${params.toString()}`
    const res = await fetch(url)
    const json = await res.json()

    if (json.error) {
      return NextResponse.json({ error: json.error })
    }

    const posts = json.data || []
    const fbDetails = posts.map((post: any) => {
      const atts = post.attachments?.data || []
      const subAtts = atts[0]?.subattachments?.data || []
      
      return {
        id: post.id,
        message: post.message ? post.message.substring(0, 100) : null,
        full_picture: post.full_picture || null,
        attachments: atts.map((a: any) => ({
          type: a.type,
          imageSrc: a.media?.image?.src || null,
          mediaSource: a.media?.source || null,
        })),
        subattachments: subAtts.map((sa: any) => ({
          type: sa.type,
          imageSrc: sa.media?.image?.src || null,
          mediaSource: sa.media?.source || null,
        }))
      }
    })

    return NextResponse.json({ success: true, count: fbDetails.length, fbDetails })
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : String(err),
    })
  }
}
