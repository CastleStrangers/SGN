const { prisma } = require('./src/lib/db.ts'); // Wait, src/lib/db.ts is ES module.
// Let's write the query using raw client or require it via ts-node / tsx if we want, or just write a small JS script that initializes Prisma client manually like we did, and runs the query!
const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
const libsql = require('@libsql/client');

async function main() {
  const client = libsql.createClient({
    url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
  });
  const adapter = new PrismaLibSql(client);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("Running members query...");
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
    console.error("Query failed with error:", e.message);
  }
}

main();
