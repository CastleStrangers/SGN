/**
 * سكريبت إصلاح Turso - يعمل مباشرة بـ node
 * الاستخدام: node scripts/fix-turso-schema.cjs
 */
const { createClient } = require("@libsql/client");
const path = require("path");
const fs = require("fs");

// تحميل .env يدوياً
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const m = line.match(/^([^#=]+)=["']?(.+?)["']?\s*$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
}

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("❌ TURSO_DATABASE_URL or TURSO_AUTH_TOKEN not set in .env");
  process.exit(1);
}

async function main() {
  const client = createClient({ url, authToken });
  console.log("🔗 Connected to Turso:", url);

  // 1. فحص الأعمدة الحالية
  const tableInfo = await client.execute("PRAGMA table_info('Post')");
  const columns = tableInfo.rows.map(r => r[1]);
  console.log("\n📋 Current columns:", columns.join(", "));

  // 2. إضافة الأعمدة المفقودة
  if (!columns.includes("locale")) {
    await client.execute(`ALTER TABLE "Post" ADD COLUMN locale TEXT NOT NULL DEFAULT 'ar'`);
    console.log("✅ Added: locale");
  } else {
    console.log("✅ OK: locale");
  }

  if (!columns.includes("membersOnly")) {
    await client.execute(`ALTER TABLE "Post" ADD COLUMN membersOnly INTEGER NOT NULL DEFAULT 0`);
    console.log("✅ Added: membersOnly");
  } else {
    console.log("✅ OK: membersOnly");
  }

  if (!columns.includes("videoId")) {
    await client.execute(`ALTER TABLE "Post" ADD COLUMN videoId TEXT`);
    console.log("✅ Added: videoId");
  } else {
    console.log("✅ OK: videoId");
  }

  if (!columns.includes("province")) {
    await client.execute(`ALTER TABLE "Post" ADD COLUMN province TEXT`);
    console.log("✅ Added: province");
  }

  if (!columns.includes("city")) {
    await client.execute(`ALTER TABLE "Post" ADD COLUMN city TEXT`);
    console.log("✅ Added: city");
  }

  // 3. إصلاح locale الفارغ → 'ar'
  const fixLocale = await client.execute(
    `UPDATE "Post" SET locale = 'ar' WHERE locale IS NULL OR locale = ''`
  );
  console.log(`\n🔧 Fixed locale: ${fixLocale.rowsAffected} posts → 'ar'`);

  // 4. إصلاح روابط الصور المحلية
  const fixImages = await client.execute(
    `UPDATE "Post" SET image = NULL WHERE image LIKE '/uploads/%' OR image LIKE '%localhost%'`
  );
  console.log(`🖼️  Fixed images: ${fixImages.rowsAffected} posts → NULL`);

  // 5. إنشاء فهارس الأداء
  try {
    await client.execute(`CREATE INDEX IF NOT EXISTS "Post_locale_published_idx" ON "Post"(locale, published, createdAt)`);
    console.log("📊 Index created: locale+published+createdAt");
  } catch (e) {
    console.log("⚠️  Index skipped:", e.message);
  }

  // 6. عرض الإحصائيات النهائية
  const stats = await client.execute(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN locale = 'ar' THEN 1 ELSE 0 END) as ar,
      SUM(CASE WHEN locale = 'nl' THEN 1 ELSE 0 END) as nl,
      SUM(CASE WHEN locale = 'en' THEN 1 ELSE 0 END) as en,
      SUM(CASE WHEN image IS NOT NULL THEN 1 ELSE 0 END) as withImage,
      SUM(CASE WHEN published = 1 THEN 1 ELSE 0 END) as published
    FROM "Post"
  `);
  
  const r = stats.rows[0];
  console.log("\n📊 Final DB state:");
  console.log(`  Total:     ${r[0]}`);
  console.log(`  Arabic:    ${r[1]}`);
  console.log(`  Dutch:     ${r[2]}`);
  console.log(`  English:   ${r[3]}`);
  console.log(`  With img:  ${r[4]}`);
  console.log(`  Published: ${r[5]}`);
  console.log("\n✅ Done! Turso is now up to date.");
}

main().catch(e => {
  console.error("❌ Error:", e.message);
  process.exit(1);
});
