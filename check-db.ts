import "dotenv/config"
import { prisma } from './scripts/db.js'

async function main() {
  const counts = await prisma.post.groupBy({
    by: ['category'],
    _count: {
      category: true,
    },
  })
  console.log("Local Database Category Counts:")
  console.dir(counts, { depth: null })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
