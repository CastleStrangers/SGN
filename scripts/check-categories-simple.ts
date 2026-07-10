import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || "file:./prisma/dev.db",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('=== فحص البيانات في قاعدة البيانات ===\n');

  const categories = await prisma.post.groupBy({
    by: ['category'],
    _count: true,
    where: {
      published: true,
    },
  });

  console.log('التصنيفات الفعلية:');
  categories.forEach(c => {
    console.log(`- ${c.category}: ${c._count} مقالة`);
  });

  console.log('\n=== عينة من المقالات في كل تصنيف ===\n');

  for (const cat of categories) {
    const posts = await prisma.post.findMany({
      take: 3,
      where: {
        category: cat.category,
        published: true,
      },
      select: {
        title: true,
        source: true,
      },
    });
    console.log(`\n${cat.category} (${cat._count} مقالة):`);
    posts.forEach(p => {
      console.log(`  - ${p.title} [${p.source}]`);
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
