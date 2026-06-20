import type { SyncSource, ExtractedArticle } from "./types"
import { extractFacebook } from "./facebook"

async function fetchPage(url: string): Promise<string> {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(15000),
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; SYNL-SyncBot/1.0; +https://sy-nl.org)",
      Accept: "text/html,application/xhtml+xml",
    },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`)
  return res.text()
}

function cleanText(text: string): string {
  return text
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\uFFFD]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

function stripHtml(html: string): string {
  return cleanText(html.replace(/<[^>]+>/g, ""))
}

const TITLE_KEYWORDS = [
  "لقاء", "ندوة", "بيان", "تهنئة", "تعزية", "اجتماع", "دعوة",
  "فعالية", "مبادرة", "تقرير", "إعلان", "تصريح", "استمارة",
  "جالية", "منظمة", "مجلس", "اتفاق", "تعاون", "تشغيل",
  "مؤتمر", "حوار", "زيارة", "مشروع", "برنامج", "وقفة",
  "استقبل", "خطوة", "تسجيلات", "متابعة", "سفير",
]

const BAD_TITLE_STARTS = [
  "في ", "من ", "عن ", "على ", "أن ", "إن ", "كوسيلة", "ما قمنا",
  "نحن نقوم", "وتؤكد", "وتشدد", "تُعبّر", "يُعرب", "تُمثل",
  "وأكد", "ونرصد", "بمناسبة", "اشترك", "تتمة", "رحم الله",
]

function isGoodTitle(text: string): boolean {
  const t = cleanText(text)
  if (t.length < 15 || t.length > 200) return false
  if (!/[\u0600-\u06FF]/.test(t)) return false
  if (t.startsWith("?") || t.startsWith(".") || t.startsWith(",")) return false
  if (t.match(/^\d+[\.\)\:]/)) return false
  if (t.includes("@") || t.includes("http") || t.includes("KVK")) return false
  if (t.includes("+31") || t.includes("WhatsApp") || t.includes("البريد")) return false
  if (t.includes("جميع الحقوق محفوظة") || t.includes("All rights reserved")) return false
  if (t.includes("النشرة البريدية")) return false
  for (const bad of BAD_TITLE_STARTS) {
    if (t.startsWith(bad)) return false
  }
  return true
}

function extractImagesFromHtml(html: string, excludeYtThumbs = false): string[] {
  const urls: string[] = []
  const seen = new Set<string>()
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi
  let m: RegExpExecArray | null
  while ((m = imgRegex.exec(html)) !== null) {
    const url = m[1]
    const lowerUrl = url.toLowerCase()
    if (
      url.startsWith("http") &&
      !lowerUrl.includes("logo_sgn") &&
      !lowerUrl.includes("/logo.png") &&
      !lowerUrl.includes("/logo.svg") &&
      !lowerUrl.includes("icon") &&
      !lowerUrl.includes("favicon") &&
      !lowerUrl.includes("sgn_02") &&
      !(excludeYtThumbs && lowerUrl.includes("ytimg.com")) &&
      !seen.has(url)
    ) {
      seen.add(url)
      urls.push(url)
    }
  }
  return urls
}

function extractVideoIdsFromHtml(html: string): string[] {
  const ids = new Set<string>()
  const ytPatterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/g,
    /youtu\.be\/([a-zA-Z0-9_-]+)/g,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/g,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/g,
    /i\.ytimg\.com\/vi\/([a-zA-Z0-9_-]+)/g,
    /i\.ytimg\.com\/vi_webp\/([a-zA-Z0-9_-]+)/g,
    /"videoId"\s*:\s*"([a-zA-Z0-9_-]+)"/g,
    /"id"\s*:\s*"([a-zA-Z0-9_-]{11})"/g,
  ]
  for (const pattern of ytPatterns) {
    let m: RegExpExecArray | null
    while ((m = pattern.exec(html)) !== null) {
      const id = m[1]
      if (id.length >= 10 && id.length <= 12) {
        ids.add(id)
      }
    }
  }
  return [...ids]
}

function makeYoutubeIframeHtml(videoId: string): string {
  return `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:16px 0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.1);background:#f5f5f5;"><iframe src="https://www.youtube.com/embed/${videoId}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" title="YouTube video player"></iframe></div>`
}

function pickBestTitle(textBlocks: string[]): string | null {
  for (const block of textBlocks) {
    const text = cleanText(block)
    if (isGoodTitle(text)) {
      const kwMatch = TITLE_KEYWORDS.some((kw) => text.includes(kw))
      if (kwMatch || (text.length < 100 && text.split(" ").length >= 3)) {
        return text
      }
    }
  }
  for (const block of textBlocks) {
    const text = cleanText(block)
    if (isGoodTitle(text)) {
      return text
    }
  }
  return null
}

function extractAllImagesAndText(html: string): ExtractedArticle[] {
  const articles: ExtractedArticle[] = []
  const sectionRegex = /<section[^>]*id=["']([^"']+)["'][^>]*>([\s\S]*?)<\/section>/gi
  let m: RegExpExecArray | null

  while ((m = sectionRegex.exec(html)) !== null) {
    const sectionId = m[1]
    const sectionHtml = m[2]

    const rawText = sectionHtml.replace(/<[^>]+>/g, "").trim()
    if (!rawText) continue

    const textBlocks: string[] = []
    const textPattern = />([^<]{30,2000})<\//g
    let tm: RegExpExecArray | null
    while ((tm = textPattern.exec(sectionHtml)) !== null) {
      const text = cleanText(tm[1])
      if (text.length >= 20 && /[\u0600-\u06FF]/.test(text)) {
        textBlocks.push(text)
      }
    }

    if (textBlocks.length === 0) continue

    const title = pickBestTitle(textBlocks) || textBlocks[0].slice(0, 200)
    if (title.length < 15) continue

    if (title.includes("جميع الحقوق محفوظة") || title.includes("All rights reserved")) continue
    if (title.includes("النشرة البريدية")) continue
    if (title.includes("إرسال الطلب الآن")) continue
    if (title === textBlocks[0] && BAD_TITLE_STARTS.some((b) => textBlocks[0].startsWith(b))) continue

    const imgUrls = extractImagesFromHtml(sectionHtml, true)
    const videoIds = extractVideoIdsFromHtml(sectionHtml)

    let firstImage = imgUrls[0]
    const remainingImages = imgUrls.slice(1)

    if (!firstImage && videoIds.length > 0) {
      firstImage = `https://i.ytimg.com/vi/${videoIds[0]}/hqdefault.jpg`
    }

    const contentParts: string[] = []
    const videoHtmlParts = videoIds.map(makeYoutubeIframeHtml)

    if (videoHtmlParts.length > 0) {
      contentParts.push(...videoHtmlParts)
    }

    for (const imgUrl of remainingImages) {
      contentParts.push(
        `<img src="${imgUrl}" alt="" style="max-width:100%;height:auto;border-radius:8px;margin:12px 0;display:block;" />`
      )
    }

    if (textBlocks.length > 0) {
      const paragraphText = textBlocks
        .filter((t) => t !== title)
        .join("</p>\n<p>")
      if (paragraphText) {
        contentParts.push(`<p>${paragraphText}</p>`)
      }
    }

    const content = contentParts.join("\n")
    const plainText = textBlocks.join(" ")

    articles.push({
      title,
      content,
      excerpt: plainText.slice(0, 300),
      image: firstImage || undefined,
      category: "أخبار الجالية",
      tags: [],
      source: "sy-nl.org",
      sourceUrl: `https://www.sy-nl.org/nbdh-aljalyh#${encodeURIComponent(title.trim().slice(0, 40))}`,
      author: "الجالية السورية في هولندا",
      publishedAt: new Date(),
      mediaUrls: imgUrls,
      iframes: videoIds.map((id) => `https://www.youtube.com/embed/${id}`),
    })
  }

  // Fallback if the webpage is client-side rendered (e.g. Hostinger / Zyro builder pages with JSON props)
  if (articles.length === 0) {
    const match = html.match(/props="([\s\S]*?)"/)
    if (match) {
      try {
        const decoded = match[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&')
        const data = JSON.parse(decoded)
        
        const blocksMap = new Map<string, { texts: string[], images: string[], videoIds: string[] }>()
        
        const traverse = (obj: any, currentBlockId: string | null) => {
          if (!obj) return
          let nextBlockId = currentBlockId
          
          if (typeof obj === "object") {
            if (obj.type === "BlockLayout" || obj.type === "BlockNavigation" || (obj.id && typeof obj.id === "string" && obj.id.startsWith("z"))) {
              nextBlockId = obj.id || currentBlockId
            }
            
            for (const key in obj) {
              const val = obj[key]
              if (typeof val === "string") {
                const trimmed = val.trim()
                if (trimmed.length > 20 && /[\u0600-\u06FF]/.test(trimmed)) {
                  if (nextBlockId) {
                    if (!blocksMap.has(nextBlockId)) {
                      blocksMap.set(nextBlockId, { texts: [], images: [], videoIds: [] })
                    }
                    if (!blocksMap.get(nextBlockId)!.texts.includes(trimmed)) {
                      blocksMap.get(nextBlockId)!.texts.push(trimmed)
                    }
                  }
                } else if (
                  trimmed.startsWith("http") &&
                  trimmed.includes("assets.zyrosite.com") &&
                  (trimmed.includes(".jpg") || trimmed.includes(".png") || trimmed.includes(".jpeg") || trimmed.includes(".webp")) &&
                  !trimmed.toLowerCase().includes("logo_sgn") &&
                  !trimmed.toLowerCase().includes("/logo.png") &&
                  !trimmed.toLowerCase().includes("/logo.svg") &&
                  !trimmed.toLowerCase().includes("icon") &&
                  !trimmed.toLowerCase().includes("favicon")
                ) {
                  if (nextBlockId) {
                    if (!blocksMap.has(nextBlockId)) {
                      blocksMap.set(nextBlockId, { texts: [], images: [], videoIds: [] })
                    }
                    if (!blocksMap.get(nextBlockId)!.images.includes(trimmed)) {
                      blocksMap.get(nextBlockId)!.images.push(trimmed)
                    }
                  }
                } else {
                  const ytPatterns = [
                    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{10,12})/,
                    /youtu\.be\/([a-zA-Z0-9_-]{10,12})/,
                    /youtube\.com\/embed\/([a-zA-Z0-9_-]{10,12})/,
                    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{10,12})/
                  ]
                  for (const pattern of ytPatterns) {
                    const ym = trimmed.match(pattern)
                    if (ym && nextBlockId) {
                      if (!blocksMap.has(nextBlockId)) {
                        blocksMap.set(nextBlockId, { texts: [], images: [], videoIds: [] })
                      }
                      if (!blocksMap.get(nextBlockId)!.videoIds.includes(ym[1])) {
                        blocksMap.get(nextBlockId)!.videoIds.push(ym[1])
                      }
                    }
                  }
                }
              } else {
                traverse(val, nextBlockId)
              }
            }
          } else if (Array.isArray(obj)) {
            for (const val of obj) {
              traverse(val, nextBlockId)
            }
          }
        }
        
        traverse(data, null)
        
        for (const [blockId, blockData] of blocksMap.entries()) {
          const textBlocks = blockData.texts
          if (textBlocks.length === 0) continue
          
          const title = pickBestTitle(textBlocks) || textBlocks[0].slice(0, 200)
          if (title.length < 15) continue
          
          if (title.includes("جميع الحقوق محفوظة") || title.includes("All rights reserved")) continue
          if (title.includes("النشرة البريدية")) continue
          if (title.includes("إرسال الطلب الآن")) continue
          if (BAD_TITLE_STARTS.some((b) => title.startsWith(b))) continue
          
          let firstImage = blockData.images[0]
          const remainingImages = blockData.images.slice(1)
          
          if (!firstImage && blockData.videoIds.length > 0) {
            firstImage = `https://i.ytimg.com/vi/${blockData.videoIds[0]}/hqdefault.jpg`
          }
          
          const contentParts: string[] = []
          const videoHtmlParts = blockData.videoIds.map(makeYoutubeIframeHtml)
          
          if (videoHtmlParts.length > 0) {
            contentParts.push(...videoHtmlParts)
          }
          
          for (const imgUrl of remainingImages) {
            contentParts.push(
              `<img src="${imgUrl}" alt="" style="max-width:100%;height:auto;border-radius:8px;margin:12px 0;display:block;" />`
            )
          }
          
          const paragraphText = textBlocks
            .filter((t) => t !== title)
            .join("</p>\n<p>")
          if (paragraphText) {
            contentParts.push(`<p>${paragraphText}</p>`)
          }
          
          const content = contentParts.join("\n")
          const plainText = textBlocks.join(" ")
          
          articles.push({
            title,
            content,
            excerpt: plainText.slice(0, 300),
            image: firstImage || undefined,
            category: "أخبار الجالية",
            tags: [],
            source: "sy-nl.org",
            sourceUrl: `https://www.sy-nl.org/nbdh-aljalyh#${encodeURIComponent(title.trim().slice(0, 40))}`,
            author: "الجالية السورية في هولندا",
            publishedAt: new Date(),
            mediaUrls: blockData.images,
            iframes: blockData.videoIds.map((id) => `https://www.youtube.com/embed/${id}`),
          })
        }
      } catch (err) {
        console.error("Error parsing Zyro JSON props:", err)
      }
    }
  }

  return articles
}

function extractRSS(xml: string, source: SyncSource): ExtractedArticle[] {
  const articles: ExtractedArticle[] = []
  const itemPattern = /<item>([\s\S]*?)<\/item>/g
  let m: RegExpExecArray | null
  while ((m = itemPattern.exec(xml)) !== null) {
    const item = m[1]
    const title = cleanText(item.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)?.[1] || "")
    const link = (item.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/)?.[1] || "").trim()
    const c = item.match(/<(?:content:encoded|content|description)>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/(?:content:encoded|content|description)>/)
    const content = c?.[1]?.trim() || ""
    const pubDate = item.match(/<pubDate>([^<]+)<\/pubDate>/)?.[1]?.trim()
    const creator = cleanText(item.match(/<(?:author|dc:creator)>([^<]+)<\/(?:author|dc:creator)>/)?.[1] || "")
    if (!title || title.length < 5) continue
    const mediaUrls = extractImagesFromHtml(content, true)
    const videoIds = extractVideoIdsFromHtml(content)
    const textContent = content.replace(/<[^>]+>/g, "").trim()
    articles.push({
      title,
      content,
      excerpt: textContent.slice(0, 300),
      image: mediaUrls[0] || undefined,
      category: source.category || "أخبار الجالية",
      tags: [],
      source: source.name,
      sourceUrl: link || source.url,
      author: creator || "الجالية السورية في هولندا",
      publishedAt: pubDate ? new Date(pubDate) : new Date(),
      mediaUrls,
      iframes: videoIds.map((id) => `https://www.youtube.com/embed/${id}`),
    })
  }
  return articles
}

function extractYoutube(xml: string, source: SyncSource): ExtractedArticle[] {
  const articles: ExtractedArticle[] = []
  const entryPattern = /<entry>([\s\S]*?)<\/entry>/g
  let m: RegExpExecArray | null
  while ((m = entryPattern.exec(xml)) !== null) {
    const entry = m[1]
    const videoId = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] || ""
    const title = cleanText(entry.match(/<title>([^<]+)<\/title>/)?.[1] || "")
    const link = `https://www.youtube.com/watch?v=${videoId}`
    const description = cleanText(entry.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1] || "")
    const pubDate = entry.match(/<published>([^<]+)<\/published>/)?.[1]
    const creator = cleanText(entry.match(/<author>\s*<name>([^<]+)<\/name>/)?.[1] || "")
    const thumbUrl = entry.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/)?.[1] || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`

    if (!videoId || !title) continue

    const iframeHtml = makeYoutubeIframeHtml(videoId)
    const content = `${iframeHtml}\n<p>${description.replace(/\n/g, "<br/>")}</p>`

    articles.push({
      title,
      content,
      excerpt: description.slice(0, 300),
      image: thumbUrl,
      videoId,
      category: source.category || "فيديوهات",
      tags: ["فيديو", "يوتيوب"],
      source: "youtube",
      sourceUrl: link,
      author: creator || "الجالية السورية في هولندا",
      publishedAt: pubDate ? new Date(pubDate) : new Date(),
      mediaUrls: [thumbUrl],
      iframes: [`https://www.youtube.com/embed/${videoId}`],
    })
  }
  return articles
}

export async function extractArticles(source: SyncSource): Promise<ExtractedArticle[]> {
  switch (source.type) {
    case "rss": {
      const raw = await fetchPage(source.url)
      return extractRSS(raw, source)
    }
    case "webpage": {
      const raw = await fetchPage(source.url)
      return extractAllImagesAndText(raw)
    }
    case "youtube": {
      const raw = await fetchPage(source.url)
      return extractYoutube(raw, source)
    }
    case "facebook": {
      const since = source.since ? new Date(source.since) : undefined
      return extractFacebook(source, since)
    }
    default:
      throw new Error(`Unknown source type: ${(source as SyncSource).type}`)
  }
}

