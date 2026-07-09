import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== فحص التصنيفات في قاعدة البيانات ===\n');

  // فحص التصنيفات الفعلية
  const categories = await prisma.post.groupBy({
    by: ['category'],
    _count: true,
  });

  console.log('التصنيفات الفعلية في قاعدة البيانات:');
  console.table(categories);

  // فحص عينة من المقالات
  const posts = await prisma.post.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      category: true,
      source: true,
    },
  });

  console.log('\nعينة من المقالات:');
  console.table(posts);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
