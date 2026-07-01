import { writeFile, mkdir } from "fs/promises"
import path from "path"
import crypto from "crypto"

const MEDIA_DIR = path.join(process.cwd(), "public", "uploads", "sync")

function ensureAbsolute(url: string, baseUrl: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) return url
  try {
    const base = new URL(baseUrl)
    return new URL(url, base.origin).href
  } catch {
    return url
  }
}

async function downloadFile(url: string): Promise<Buffer | null> {
  try {
    const headers: Record<string, string> = { "User-Agent": "SYNL-SyncBot/1.0" }
    if (url.includes("fbcdn.net")) {
      headers["Referer"] = "https://www.facebook.com/"
    }
    const res = await fetch(url, {
      signal: AbortSignal.timeout(30000),
      headers,
    })
    if (!res.ok) return null
    const buffer = Buffer.from(await res.arrayBuffer())
    if (buffer.length < 100) return null
    return buffer
  } catch {
    return null
  }
}

function getExtension(url: string, contentType?: string): string {
  const ext = url.split(".").pop()?.split("?")[0]?.toLowerCase()
  if (ext && ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return ext
  if (contentType?.includes("jpeg")) return "jpg"
  if (contentType?.includes("png")) return "png"
  if (contentType?.includes("gif")) return "gif"
  if (contentType?.includes("webp")) return "webp"
  return "jpg"
}

export async function downloadMedia(
  url: string,
  baseUrl: string
): Promise<string | null> {
  if (!url) return null
  if (
    url.startsWith("/") ||
    url.startsWith("data:") ||
    url.startsWith("blob:") ||
    url.startsWith("file://") ||
    url.includes("localhost") ||
    url.includes("sy-nl.org") ||
    url.includes("sgn-indol.vercel.app")
  ) {
    return url
  }

  let targetUrl = url
  if (url.includes("assets.zyrosite.com/cdn-cgi/image/")) {
    targetUrl = url.replace(/cdn-cgi\/image\/[^/]+\//, "")
  }
  let absoluteUrl = ensureAbsolute(targetUrl, baseUrl)
  let buffer: Buffer | null = null

  // If it's a YouTube thumbnail, try to download higher resolutions first
  if (absoluteUrl.includes("i.ytimg.com/vi/")) {
    const videoIdMatch = absoluteUrl.match(/\/vi\/([^/]+)\//)
    if (videoIdMatch) {
      const videoId = videoIdMatch[1]
      const maxResUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
      const sdResUrl = `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`
      
      // Try maxresdefault first
      buffer = await downloadFile(maxResUrl)
      if (buffer) {
        absoluteUrl = maxResUrl
      } else {
        // Fall back to sddefault
        buffer = await downloadFile(sdResUrl)
        if (buffer) {
          absoluteUrl = sdResUrl
        }
      }
    }
  }

  // If we didn't fetch a YouTube thumbnail or higher resolution failed, download the default URL
  if (!buffer) {
    buffer = await downloadFile(absoluteUrl)
  }

  if (!buffer) return null

  // Detect YouTube "no thumbnail available" image (usually exactly 1097 bytes, always < 2000 bytes)
  if (absoluteUrl.includes("ytimg.com") && buffer.length <= 2000) {
    console.log(`⚠️ Detected placeholder/unavailable YouTube thumbnail (size: ${buffer.length} bytes) for: ${absoluteUrl}`)
    return null
  }

  // ⚠️ Vercel Blob is suspended — skip blob upload entirely
  // Try local filesystem storage for development
  if (process.env.NODE_ENV !== "production") {
    try {
      const hash = crypto.createHash("md5").update(buffer).digest("hex").slice(0, 12)
      const ext = getExtension(absoluteUrl)
      const fileName = `${hash}.${ext}`
      const filePath = path.join(MEDIA_DIR, fileName)

      await mkdir(MEDIA_DIR, { recursive: true })
      await writeFile(filePath, buffer)
      return `/uploads/sync/${fileName}`
    } catch {
      // Fall through to return external URL
    }
  }

  // In production (or if local save failed), return the original external URL
  // This is the safest option to ensure images always display
  return absoluteUrl
}

export function extractIframeUrl(iframeHtml: string): string | null {
  const match = iframeHtml.match(/src=["']([^"']+)["']/)
  if (match) return match[1]

  const srcMatch = iframeHtml.match(/src=(["'])(.*?)\1/)
  if (srcMatch) return srcMatch[2]

  return null
}

export function convertYouTubeUrl(url: string): string {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`
    }
  }
  return url
}

export async function processArticleMedia(
  content: string,
  baseUrl: string
): Promise<{
  content: string
  thumbnail: string | null
  mediaUrls: string[]
  iframeUrls: string[]
}> {
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi
  const iframeRegex = /<iframe[^>]+src=["']([^"']+)["'][^>]*>/gi
  let thumbnail: string | null = null
  const downloadedUrls: string[] = []
  const iframeUrls: string[] = []

  let newContent = content

  const imgMatches: { full: string; url: string }[] = []
  let m: RegExpExecArray | null
  while ((m = imgRegex.exec(content)) !== null) {
    imgMatches.push({ full: m[0], url: m[1] })
  }

  for (const img of imgMatches) {
    const localUrl = await downloadMedia(img.url, baseUrl)
    if (localUrl) {
      newContent = newContent.replace(img.url, localUrl)
      downloadedUrls.push(localUrl)
      if (!thumbnail) thumbnail = localUrl
    }
  }

  while ((m = iframeRegex.exec(content)) !== null) {
    const originalSrc = m[1]
    const converted = convertYouTubeUrl(originalSrc)
    iframeUrls.push(converted)
    newContent = newContent.replace(originalSrc, converted)
  }

  return {
    content: newContent,
    thumbnail,
    mediaUrls: downloadedUrls,
    iframeUrls,
  }
}
