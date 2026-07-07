import "dotenv/config"
import { prisma } from './scripts/db.js'

async function main() {
  console.log("Simulating API Query...")
  try {
    const locale = "ar"
    const category = "أخبار الجالية"
    const limit = 50
    const offset = 0
    const localeFilter = { OR: [{ locale: "ar" }, { locale: "" }] }

    const where: any = {
      published: true,
      ...localeFilter,
      category,
    }

    console.log("Query Conditions:", JSON.stringify(where, null, 2))
    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        image: true,
        videoId: true,
        category: true,
        tags: true,
        source: true,
        featured: true,
        views: true,
        published: true,
        locale: true,
        createdAt: true,
        updatedAt: true,
        author: { select: { name: true } },
      }
    })
    console.log(`Successfully fetched ${posts.length} posts!`)
    if (posts.length > 0) {
      console.log("Sample post author:", posts[0].author)
    }
  } catch (err) {
    console.error("API Query Failed with Error:")
    console.error(err)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
