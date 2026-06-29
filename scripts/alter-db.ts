import { prisma } from "../src/lib/db";

async function main() {
  try {
    console.log("Altering Member table to add isPremiumService...");
    await prisma.$executeRawUnsafe(`ALTER TABLE Member ADD COLUMN isPremiumService BOOLEAN NOT NULL DEFAULT 0`);
    console.log("Successfully added isPremiumService column!");
  } catch (e: any) {
    console.error("Result:", e.message);
  }
}

main();
