/**
 * Fix articles with empty locale in the local SQLite database.
 * Articles from sy-nl.org and facebook with no locale are assumed to be Arabic.
 * Articles from NOS/Euronews with no locale are assumed to be Dutch (nl).
 */
import { createClient } from "@libsql/client";
import "dotenv/config";

const local = createClient({ url: "file:./prisma/dev.db" });
const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function fixEmptyLocales(db: ReturnType<typeof createClient>, dbName: string) {
  // Get all articles with empty locale
  const result = await db.execute(`SELECT "id", "source", "title" FROM "Post" WHERE "locale" = '' OR "locale" IS NULL`);
  console.log(`\n[${dbName}] Found ${result.rows.length} articles with empty locale`);

  let fixedAr = 0;
  let fixedNl = 0;

  for (const row of result.rows) {
    const source = String(row.source || "");
    const id = row.id;

    // Articles from sy-nl.org or facebook are Arabic
    const isArabicSource = source.includes("sy-nl") || source.includes("facebook");
    const newLocale = isArabicSource ? "ar" : "nl";

    await db.execute({
      sql: `UPDATE "Post" SET "locale" = ? WHERE "id" = ?`,
      args: [newLocale, id],
    });

    if (isArabicSource) fixedAr++;
    else fixedNl++;
  }

  console.log(`  ✅ Fixed: ${fixedAr} → Arabic (ar), ${fixedNl} → Dutch (nl)`);
}

async function main() {
  console.log("🔧 Fixing empty locale articles...");

  await fixEmptyLocales(local, "Local SQLite");
  await fixEmptyLocales(turso, "Turso (Production)");

  console.log("\n✅ Done! All articles now have proper locale.");
  local.close();
  turso.close();
}

main().catch(console.error);
