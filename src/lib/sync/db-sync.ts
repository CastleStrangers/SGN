import { prisma } from "../db"
import type { ExtractedArticle } from "./types"
import crypto from "crypto"

function generateContentHash(article: ExtractedArticle): string {
  const content = `${article.title}|${article.excerpt}|${article.sourceUrl}`
  return crypto.createHash("sha256").update(content).digest("hex").slice(0, 16)
}

function generateSlug(title: string): string {
  return title
    .trim()
    .replace(/[^\w\s\u0600-\u06FF-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase()
    .slice(0, 80)
    .replace(/^-|-$/g, "")
}

async function getOrCreateSyncUser(): Promise<string> {
  let user = await prisma.user.findFirst({
    where: { role: "admin" },
    orderBy: { id: "asc" },
  })

  if (!user) {
    user = await prisma.user.findFirst({
      orderBy: { id: "asc" },
    })
  }

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: "System Sync",
        email: "sync@sy-nl.local",
        role: "admin",
        password: crypto.randomBytes(32).toString("hex"),
      },
    })
  }

  return user.id
}

async function findExistingBySourceInfo(source: string, url: string): Promise<boolean> {
  const count = await prisma.post.count({
    where: { tags: { contains: `__source:${source}:${url}` } },
  })
  return count > 0
}

async function findExistingByContentHash(hash: string): Promise<boolean> {
  const count = await prisma.post.count({
    where: { tags: { contains: `__hash:${hash}` } },
  })
  return count > 0
}

export async function syncArticleToDb(
  article: ExtractedArticle,
  category: string
): Promise<{ status: "new" | "updated" | "skipped"; id?: string }> {
  const contentHash = generateContentHash(article)

  const sourceInfo = `${article.source || "unknown"}:${article.sourceUrl}`
  const existsByUrl = await findExistingBySourceInfo(article.source || "unknown", article.sourceUrl)
  const existsByHash = await findExistingByContentHash(contentHash)

  if (existsByUrl || existsByHash) {
    return { status: "skipped" }
  }

  const slug = generateSlug(article.title)
  if (slug) {
    const existingSlug = await prisma.post.findUnique({ where: { slug } })
    if (existingSlug) return { status: "skipped" }
  }

  const authorId = await getOrCreateSyncUser()

  const tags = [
    ...article.tags,
    `__hash:${contentHash}`,
    `__source:${article.source || "unknown"}:${article.sourceUrl}`,
  ].join(",")

  let finalContent = article.content
  let finalImage = article.image || null

  try {
    const { processArticleMedia, downloadMedia } = await import("./media")
    // Process content (download any images in content)
    const mediaResult = await processArticleMedia(article.content, article.sourceUrl)
    finalContent = mediaResult.content

    // Process main article.image
    if (article.image) {
      const localImage = await downloadMedia(article.image, article.sourceUrl)
      if (localImage) {
        finalImage = localImage
      }
    } else if (mediaResult.thumbnail) {
      finalImage = mediaResult.thumbnail
    }
  } catch (err) {
    console.error("Error downloading media in syncArticleToDb:", err)
  }

  const post = await prisma.post.create({
    data: {
      title: article.title,
      content: finalContent,
      excerpt: article.excerpt || null,
      image: finalImage,
      videoId: article.videoId || null,
      category,
      tags,
      source: article.source || article.sourceUrl,
      featured: false,
      published: true,
      slug: slug || undefined,
      authorId,
      createdAt: article.publishedAt,
    },
  })

  return { status: "new", id: post.id }
}
