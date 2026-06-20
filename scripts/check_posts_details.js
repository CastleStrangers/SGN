const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function run() {
  const posts = await p.post.findMany({
    orderBy: { createdAt: 'desc' },
    take: 15
  });
  console.log('--- LATEST 15 POSTS ---');
  posts.forEach((post, i) => {
    console.log(`${i+1}. [${post.source}] ${post.title.substring(0, 50)}`);
    console.log(`   Image: ${post.image}`);
    console.log(`   SourceUrl: ${post.sourceUrl}`);
    console.log(`   Created: ${post.createdAt}`);
  });
  await p.$disconnect();
}

run().catch(e => {
  console.error(e);
  p.$disconnect();
});
