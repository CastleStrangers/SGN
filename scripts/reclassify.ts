import { prisma } from "../src/lib/db"
import { categorizeWithAI } from "../src/lib/sync/categorizer"
import * as dotenv from "dotenv"

dotenv.config()

async function main() {
  console.log(`[${new Date().toISOString()}] Starting re-classification of existing news posts...`)
  const start = Date.now()

  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
    })

    console.log(`Found ${posts.length} posts to analyze.`)
    let updatedCount = 0
    let errorCount = 0

    for (const post of posts) {
      // Skip youtube video posts from reclassification since they are always "فيديوهات"
      if (post.source === "youtube" || post.videoId) {
        if (post.category !== "فيديوهات") {
          await prisma.post.update({
            where: { id: post.id },
            data: { category: "فيديوهات" },
          })
          updatedCount++
        }
        continue
      }

      try {
        const articleFake = {
          title: post.title,
          excerpt: post.excerpt || "",
          category: post.category,
          tags: post.tags ? post.tags.split(",") : [],
        } as any

        const newCategory = await categorizeWithAI(articleFake)

        if (newCategory !== post.category) {
          console.log(`- Updating post "${post.title.slice(0, 40)}...": "${post.category}" -> "${newCategory}"`)
          await prisma.post.update({
            where: { id: post.id },
            data: { category: newCategory },
          })
          updatedCount++
        }
      } catch (err) {
        errorCount++
        console.error(`  Error reclassifying post ID ${post.id}:`, err)
      }
    }

    console.log(`[${new Date().toISOString()}] Completed! Updated: ${updatedCount}, Errors: ${errorCount}, Duration: ${((Date.now() - start) / 1000).toFixed(1)}s`)
  } catch (err) {
    console.error("Fatal error during reclassification:", err)
    process.exit(1)
  }
}

main()
