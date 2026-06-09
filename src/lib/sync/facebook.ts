/**
 * facebook.ts
 * مستخرج منشورات صفحة الفيسبوك عبر Graph API
 *
 * يتطلب في .env:
 *   FACEBOOK_PAGE_ID=61584301535331
 *   FACEBOOK_PAGE_TOKEN=<page_access_token أو user_access_token مع pages_read_engagement>
 *   FACEBOOK_PAGE_SLUG=DeSyrischeGemeenschapInNederland
 */

import type { SyncSource, ExtractedArticle } from "./types"

const GRAPH_API = "https://graph.facebook.com/v19.0"
const PAGE_NAME = "الجالية السورية في هولندا"

export interface FacebookPost {
  id: string
  message?: string
  story?: string
  full_picture?: string
  created_time: string
  permalink_url: string
  attachments?: {
    data: Array<{
      type: string
      media?: { image?: { src: string }; source?: string }
      subattachments?: { data: Array<{ media?: { image?: { src: string }; source?: string }; type: string }> }
    }>
  }
}

interface GraphResponse {
  data: FacebookPost[]
  paging?: {
    cursors?: { before: string; after: string }
    next?: string
  }
  error?: { message: string; type: string; code: number }
}

/**
 * جلب صفحة واحدة من منشورات الفيسبوك
 */
async function fetchPostsPage(
  pageId: string,
  token: string,
  after?: string,
  sinceTimestamp?: number
): Promise<GraphResponse> {
  const params = new URLSearchParams({
    fields: "id,message,story,full_picture,created_time,permalink_url,attachments",
    limit: "25",
    access_token: token,
  })

  if (sinceTimestamp) {
    params.set("since", String(sinceTimestamp))
  }
  if (after) {
    params.set("after", after)
  }

  const url = `${GRAPH_API}/${pageId}/posts?${params.toString()}`
  const res = await fetch(url, {
    headers: { "User-Agent": "SGN-SyncBot/1.0" },
    next: { revalidate: 0 },
  })

  const json = await res.json()

  if (json.error) {
    throw new Error(`Facebook API Error [${json.error.code}]: ${json.error.message}`)
  }

  return json as GraphResponse
}

/**
 * استخراج الفيديو أو الصور كـ HTML
 */
function extractMediaHtml(post: FacebookPost, title: string): string {
  let mediaHtml = ""
  const att = post.attachments?.data?.[0]
  if (!att) {
    if (post.full_picture) {
      return `<img src="${post.full_picture}" alt="${title}" style="max-width:100%;height:auto;border-radius:8px;margin:0 0 16px 0;" />`
    }
    return ""
  }

  const isVideo = att.type?.includes("video")
  if (isVideo && att.media?.source) {
    mediaHtml += `<video controls src="${att.media.source}" poster="${att.media?.image?.src || post.full_picture || ''}" style="max-width:100%;border-radius:8px;margin:0 0 16px 0;"></video>\n`
  } 
  else if (att.subattachments?.data) {
    const items = att.subattachments.data
    mediaHtml += `<div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:8px;margin-bottom:16px;">\n`
    for (const sub of items) {
      if (sub.type?.includes("video") && sub.media?.source) {
        mediaHtml += `<video controls src="${sub.media.source}" poster="${sub.media?.image?.src || ''}" style="width:100%;height:auto;border-radius:8px;"></video>\n`
      } else if (sub.media?.image?.src) {
        mediaHtml += `<img src="${sub.media.image.src}" alt="${title}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" />\n`
      }
    }
    mediaHtml += `</div>\n`
  } 
  else if (att.media?.image?.src || post.full_picture) {
    const src = att.media?.image?.src || post.full_picture
    mediaHtml += `<img src="${src}" alt="${title}" style="max-width:100%;height:auto;border-radius:8px;margin:0 0 16px 0;" />\n`
  }

  return mediaHtml
}

/**
 * استخراج صورة مصغرة للمنشور
 */
function extractThumbnail(post: FacebookPost): string | undefined {
  if (post.full_picture) return post.full_picture

  const att = post.attachments?.data?.[0]
  if (!att) return undefined

  if (att.media?.image?.src) return att.media.image.src

  const subAtt = att.subattachments?.data?.[0]
  if (subAtt?.media?.image?.src) return subAtt.media.image.src

  return undefined
}

/**
 * تحويل منشور فيسبوك إلى مقالة
 */
function postToArticle(post: FacebookPost, source: SyncSource): ExtractedArticle {
  const rawText = post.message || post.story || ""
  const lines = rawText.split("\n").filter((l) => l.trim().length > 0)

  // أول سطر طويل بما يكفي يكون العنوان
  let title = ""
  let bodyLines: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!title && line.length >= 15 && /[\u0600-\u06FF]/.test(line)) {
      title = line.length > 180 ? line.slice(0, 180) + "…" : line
      bodyLines = lines.slice(i + 1)
      break
    }
  }

  if (!title) {
    title = rawText.slice(0, 180).trim() || "منشور من صفحة الجالية"
    bodyLines = lines.slice(1)
  }

  // بناء محتوى HTML
  const paragraphs = bodyLines
    .filter((l) => l.trim().length > 0)
    .map((l) => `<p>${l.trim()}</p>`)
    .join("\n")

  const mediaHtml = extractMediaHtml(post, title)
  const image = extractThumbnail(post)

  const content = [mediaHtml, paragraphs].filter(Boolean).join("\n")
  const excerpt = rawText.replace(/\n+/g, " ").slice(0, 350)

  const publishedAt = new Date(post.created_time)

  return {
    title,
    content: content || `<p>${rawText}</p>`,
    excerpt,
    image,
    category: "أخبار الجالية",
    tags: ["فيسبوك", "الجالية السورية"],
    source: "facebook-sgn",
    sourceUrl: post.permalink_url || `https://www.facebook.com/DeSyrischeGemeenschapInNederland`,
    author: PAGE_NAME,
    publishedAt,
    mediaUrls: image ? [image] : [],
    iframes: [],
  }
}

/**
 * جلب كل المنشورات منذ تاريخ معين (مع pagination)
 */
export async function extractFacebook(
  source: SyncSource,
  since?: Date
): Promise<ExtractedArticle[]> {
  const pageId = process.env.FACEBOOK_PAGE_ID
  const token = process.env.FACEBOOK_PAGE_TOKEN

  if (!pageId || !token) {
    throw new Error(
      "FACEBOOK_PAGE_ID أو FACEBOOK_PAGE_TOKEN غير محددَين في ملف .env"
    )
  }

  const articles: ExtractedArticle[] = []

  // محاولة Graph API أولاً
  if (pageId && token) {
    try {
      const sinceTimestamp = since ? Math.floor(since.getTime() / 1000) : undefined
      let after: string | undefined = undefined
      let pageCount = 0
      const MAX_PAGES = 20

      while (pageCount < MAX_PAGES) {
        const response = await fetchPostsPage(pageId, token, after, sinceTimestamp)
        const posts = response.data || []

        if (posts.length === 0) break

        for (const post of posts) {
          const postDate = new Date(post.created_time)
          if (since && postDate < since) continue
          const rawText = post.message || post.story || ""
          if (!rawText || rawText.trim().length < 10) continue
          articles.push(postToArticle(post, source))
        }

        const nextUrl = response.paging?.next
        if (!nextUrl) break

        const afterCursor = response.paging?.cursors?.after
        if (!afterCursor || afterCursor === after) break
        after = afterCursor
        pageCount++
        await new Promise((r) => setTimeout(r, 300))
      }
    } catch (err) {
      console.log(`Graph API failed: ${err instanceof Error ? err.message : err}`)
    }
  }

  return articles
}
