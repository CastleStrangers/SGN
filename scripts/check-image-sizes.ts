import { PrismaClient } from "@prisma/client"
import { stat } from "fs/promises"
import path from "path"

const prisma = new PrismaClient()

async function main() {
  const posts = await prisma.post.findMany({
    where: {
      source: "sy-nl.org",
      image: {
        not: null
      }
    },
    select: {
      title: true,
      image: true
    },
    take: 5
  })

  console.log("Image sizes on disk:")
  for (const post of posts) {
    if (post.image) {
      const fullPath = path.join(process.cwd(), "public", post.image)
      try {
        const fileStat = await stat(fullPath)
        console.log(`- Post: "${post.title.slice(0, 40)}..."`)
        console.log(`  Path: ${post.image}`)
        console.log(`  Size: ${(fileStat.size / 1024).toFixed(2)} KB`)
      } catch (err) {
        console.log(`- Post: "${post.title.slice(0, 40)}..." -> file error: ${err instanceof Error ? err.message : String(err)}`)
      }
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
