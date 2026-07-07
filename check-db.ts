import "dotenv/config"
import { prisma } from './scripts/db.js'

async function main() {
  const total = await prisma.post.count()
  const published = await prisma.post.count({ where: { published: true } })
  const locales = await prisma.post.groupBy({
    by: ['locale'],
    _count: { locale: true }
  })
  const categories = await prisma.post.groupBy({
    by: ['category'],
    _count: { category: true }
  })
  console.log("Database Stats:")
  console.log(`  Total posts: ${total}`)
  console.log(`  Published posts: ${published}`)
  console.log("Locales:")
  console.dir(locales, { depth: null })
  console.log("Categories:")
  console.dir(categories, { depth: null })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
