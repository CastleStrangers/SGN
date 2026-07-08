import { createClient } from "@libsql/client"
import { prisma } from "../src/lib/db"

async function main() {
  console.log("Opening backup database...")
  const backupClient = createClient({
    url: "file:./prisma/dev.db.bak"
  })

  try {
    // 1. Fetch distinct sources and total posts from backup database
    console.log("Querying backup database statistics...")
    const statsResult = await backupClient.execute({
      sql: "SELECT count(*) as total FROM Post",
      args: []
    })
    console.log(`Total posts in backup: ${statsResult.rows[0]?.total}`)

    const sourcesResult = await backupClient.execute({
      sql: "SELECT distinct source FROM Post",
      args: []
    })
    console.log("Distinct sources in backup:")
    sourcesResult.rows.forEach(r => console.log(`  - "${r.source}"`))

    console.log("\nFetching Facebook posts from backup...")
    const result = await backupClient.execute({
      sql: "SELECT * FROM Post WHERE source LIKE ? OR tags LIKE ? OR source IS NULL",
      args: ["%facebook%", "%__source:facebook%"]
    })

    const fbPosts = result.rows
    console.log(`Found ${fbPosts.length} Facebook posts in backup.`)

    if (fbPosts.length === 0) {
      console.log("No Facebook posts found in the backup file.")
      return
    }

    // 2. Fetch current posts in dev.db to prevent duplicates
    const currentPosts = await prisma.post.findMany({
      select: { title: true }
    })
    const currentTitles = new Set(currentPosts.map(p => p.title))

    // 3. Restore missing Facebook posts
    let restoredCount = 0
    for (const row of fbPosts) {
      const title = String(row.title)
      if (currentTitles.has(title)) {
        continue
      }

      await prisma.post.create({
        data: {
          title: String(row.title),
          slug: row.slug ? String(row.slug) : null,
          content: String(row.content),
          excerpt: row.excerpt ? String(row.excerpt) : null,
          image: row.image ? String(row.image) : null,
          videoId: row.videoId ? String(row.videoId) : null,
          category: String(row.category),
          tags: row.tags ? String(row.tags) : "",
          source: row.source ? String(row.source) : "facebook",
          featured: Boolean(row.featured),
          published: Boolean(row.published),
          views: Number(row.views || 0),
          locale: row.locale ? String(row.locale) : "ar",
          authorId: String(row.authorId),
          createdAt: new Date(Number(row.createdAt)),
          updatedAt: new Date(Number(row.updatedAt))
        }
      })
      restoredCount++
    }

    console.log(`Successfully restored ${restoredCount} Facebook posts to the active database!`)
  } catch (err) {
    console.error("Error during Facebook restoration:", err)
  } finally {
    backupClient.close()
    await prisma.$disconnect()
  }
}

main()
