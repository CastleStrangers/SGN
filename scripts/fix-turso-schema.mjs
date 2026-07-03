/**
 * سكريبت طارئ لمزامنة schema مع Turso وإصلاح حقول locale والصور
 * شغّله مرة واحدة فقط: node scripts/fix-turso-schema.mjs
 */
import { createClient } from "@libsql/client";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("❌ TURSO_DATABASE_URL or TURSO_AUTH_TOKEN not set in .env");
  process.exit(1);
}

const client = createClient({ url, authToken });

async function main() {
  console.log("🔗 Connected to Turso:", url);

  // 1. Check current columns in Post table
  const tableInfo = await client.execute("PRAGMA table_info('Post')");
  const columns = tableInfo.rows.map(r => r[1]); // column names
  console.log("\n📋 Current Post table columns:", columns);

  const hasLocale = columns.includes("locale");
  const hasMembersOnly = columns.includes("membersOnly");
  const hasVideoId = columns.includes("videoId");

  // 2. Add missing columns
  if (!hasLocale) {
    console.log('\n➕ Adding locale column...');
    await client.execute(`ALTER TABLE "Post" ADD COLUMN locale TEXT NOT NULL DEFAULT 'ar'`);
    console.log('✅ locale column added');
  } else {
    console.log('\n✅ locale column already exists');
  }

  if (!hasMembersOnly) {
    console.log('➕ Adding membersOnly column...');
    await client.execute(`ALTER TABLE "Post" ADD COLUMN membersOnly INTEGER NOT NULL DEFAULT 0`);
    console.log('✅ membersOnly column added');
  } else {
    console.log('✅ membersOnly column already exists');
  }

  if (!hasVideoId) {
    console.log('➕ Adding videoId column...');
    await client.execute(`ALTER TABLE "Post" ADD COLUMN videoId TEXT`);
    console.log('✅ videoId column added');
  } else {
    console.log('✅ videoId column already exists');
  }

  // 3. Fix locale for existing posts (set null/empty to 'ar')
  const fixLocale = await client.execute(
    `UPDATE "Post" SET locale = 'ar' WHERE locale IS NULL OR locale = ''`
  );
  console.log(`\n🔧 Fixed ${fixLocale.rowsAffected} posts with null/empty locale → set to 'ar'`);

  // 4. Fix local image URLs (they don't work in production)
  const fixImages = await client.execute(
    `UPDATE "Post" SET image = NULL WHERE image LIKE '/uploads/%' OR image LIKE '%localhost%'`
  );
  console.log(`🖼️  Fixed ${fixImages.rowsAffected} posts with local image URLs → set to NULL`);

  // 5. Create indexes if not exist
  try {
    await client.execute(`CREATE INDEX IF NOT EXISTS "Post_locale_published_createdAt_idx" ON "Post"(locale, published, createdAt)`);
    console.log('\n📊 Index for locale+published+createdAt created/verified');
  } catch (e) {
    console.log('⚠️  Index creation skipped:', e.message);
  }

  // 6. Final count check
  const counts = await client.execute(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN locale = 'ar' THEN 1 ELSE 0 END) as ar,
      SUM(CASE WHEN locale = 'nl' THEN 1 ELSE 0 END) as nl,
      SUM(CASE WHEN locale = 'en' THEN 1 ELSE 0 END) as en,
      SUM(CASE WHEN image IS NOT NULL THEN 1 ELSE 0 END) as withImage
    FROM "Post"
  `);
  
  const row = counts.rows[0];
  console.log('\n📊 Final database state:');
  console.log(`  Total posts: ${row[0]}`);
  console.log(`  Arabic (ar): ${row[1]}`);
  console.log(`  Dutch  (nl): ${row[2]}`);
  console.log(`  English(en): ${row[3]}`);
  console.log(`  With images: ${row[4]}`);

  console.log('\n✅ Schema fix complete! Turso is now up to date.');
  process.exit(0);
}

main().catch(e => {
  console.error("❌ Error:", e.message);
  process.exit(1);
});
