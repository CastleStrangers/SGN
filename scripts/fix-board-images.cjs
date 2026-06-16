const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const members = await prisma.boardMember.findMany();
  let updated = 0;
  for (const m of members) {
    if (m.image && m.image.endsWith('.jpg') && m.image.startsWith('/images/board/')) {
      const newImage = m.image.replace(/\.jpg$/, '.svg');
      await prisma.boardMember.update({
        where: { id: m.id },
        data: { image: newImage },
      });
      updated++;
    }
  }
  console.log(`Updated ${updated} board member images (jpg → svg)`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
