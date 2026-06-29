require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');

async function main() {
  const dbUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db';
  console.log("Database URL:", dbUrl);
  const adapter = new PrismaLibSql({
    url: dbUrl,
  });
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("Running members query with correct adapter...");
    const members = await prisma.member.findMany({
      where: {
        isServiceProvider: true,
        showInPublicProfile: true,
        status: "accepted",
      },
      select: {
        id: true,
        nameAr: true,
        nameNl: true,
        profession: true,
        skills: true,
        nlCity: true,
        serviceDescription: true,
        avatar: true,
        whatsapp: true,
        userId: true,
        isPremiumService: true,
      }
    });
    console.log("Success! Query returned", members.length, "members.");
    if (members.length > 0) {
      console.log("First member isPremiumService:", members[0].isPremiumService);
    }
  } catch (e) {
    console.error("Query failed with error:", e.stack || e.message);
  }
}

main();
