import "dotenv/config"
import { prisma } from './scripts/db.js'

async function main() {
  const categories = ['أخبار أوروبا', 'أخبار الجالية', 'أخبار هولندا', 'اقتصاد', 'ثقافيات']
  for (const cat of categories) {
    const posts = await prisma.post.findMany({
      where: { category: cat },
      take: 2,
      select: {
        title: true,
        locale: true,
        category: true,
      }
    })
    console.log(`\nCategory: ${cat} (Count: ${posts.length})`)
    posts.forEach((p, idx) => {
      console.log(`  [${idx + 1}] Title: "${p.title}" | Locale: "${p.locale}"`)
    })
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
