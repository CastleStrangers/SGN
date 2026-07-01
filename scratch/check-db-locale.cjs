const { PrismaClient } = require("@prisma/client");
const { PrismaLibSql } = require("@prisma/adapter-libsql");

async function checkDb() {
  let prisma;
  try {
    prisma = new PrismaClient();
    
    // Count by locale
    const arCount = await prisma.post.count({ where: { locale: "ar", published: true } });
    const nlCount = await prisma.post.count({ where: { locale: "nl", published: true } });
    const enCount = await prisma.post.count({ where: { locale: "en", published: true } });
    const nullCount = await prisma.post.count({ where: { locale: null, published: true } });
    const totalCount = await prisma.post.count({ where: { published: true } });
    
    // Get 5 sample posts to check their image URLs
    const samples = await prisma.post.findMany({ 
      where: { published: true },
      select: { id: true, title: true, locale: true, image: true, source: true },
      take: 10,
      orderBy: { createdAt: "desc" }
    });
    
    // Count posts with and without images
    const withImage = await prisma.post.count({ where: { published: true, image: { not: null } } });
    const withoutImage = await prisma.post.count({ where: { published: true, image: null } });

    console.log(JSON.stringify({
      counts: { ar: arCount, nl: nlCount, en: enCount, nullLocale: nullCount, total: totalCount },
      imageStats: { withImage, withoutImage },
      samples
    }, null, 2));
  } catch (err) {
    console.error("ERROR:", err.message);
  } finally {
    if (prisma) await prisma.$disconnect();
  }
}

checkDb();
