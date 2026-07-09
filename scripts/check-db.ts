import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== فحص قاعدة البيانات ===\n');

  // فحص المقالات
  const posts = await prisma.post.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      category: true,
      locale: true,
      published: true,
    },
  });

  console.log(`عدد المقالات الكلي: ${await prisma.post.count()}`);
  console.log('\nأول 5 مقالات:');
  console.table(posts);

  // فحص التصنيفات
  const categories = await prisma.post.groupBy({
    by: ['category'],
    _count: true,
  });
  console.log('\nالتصنيفات المتاحة:');
  console.table(categories);

  // فحص اللغات
  const locales = await prisma.post.groupBy({
    by: ['locale'],
    _count: true,
  });
  console.log('\nاللغات المتاحة:');
  console.table(locales);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
