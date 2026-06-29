const { createClient } = require('@libsql/client');

async function main() {
  const client = createClient({
    url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
  });

  try {
    console.log("Altering Member table via libsql client...");
    await client.execute(`ALTER TABLE Member ADD COLUMN isPremiumService INTEGER NOT NULL DEFAULT 0`);
    console.log("Successfully added isPremiumService column via libsql!");
  } catch (e) {
    console.error("SQL Execution Result/Error:", e.message);
  }
}

main();
