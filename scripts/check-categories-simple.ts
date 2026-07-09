import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || "file:./prisma/dev.db",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('=== فحص البيانات في قاعدة البيانات ===\n');

  const posts = await prisma.post.findMany({
    take: 1,
    select: {
      id: true,
      title: true,
      category: true,
      locale: true,
      published: true,
    },
  });

  console.log('عينة من المقالات:');
  console.log(posts);

  if (posts.length > 0) {
    console.log('\nالحقول المتاحة في أول مقال:');
    console.log(Object.keys(posts[0]));
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
