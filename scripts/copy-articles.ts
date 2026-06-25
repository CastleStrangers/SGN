#!/usr/bin/env node
/**
 * scripts/copy-articles.ts
 *
 * Copies all articles (Post table) from local SQLite to Turso.
 * Creates the admin user in Turso if missing, then maps local authorId
 * to the Turso admin's ID so all foreign keys remain valid.
 *
 * Usage:
 *   npx tsx scripts/copy-articles.ts
 */

import { createClient } from "@libsql/client";
import "dotenv/config";

const LOCAL_DB = "file:./prisma/dev.db";

const tursoUrl = (process.env.TURSO_DATABASE_URL || "").trim();
const tursoToken = (process.env.TURSO_AUTH_TOKEN || "").trim();

if (!tursoUrl || tursoUrl === "undefined" || !tursoToken || tursoToken === "undefined") {
  console.error("❌ TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in .env");
  process.exit(1);
}

const local = createClient({ url: LOCAL_DB });
const turso = createClient({ url: tursoUrl, authToken: tursoToken });

async function getOrCreateTursoAdmin(): Promise<string> {
  const existing = await turso.execute('SELECT id FROM "User" WHERE role = \'admin\' ORDER BY id ASC LIMIT 1');
  if (existing.rows.length > 0) {
    console.log(`  ℹ️  Found existing admin in Turso: ${existing.rows[0].id}`);
    return existing.rows[0].id as string;
  }

  const any = await turso.execute('SELECT id FROM "User" ORDER BY id ASC LIMIT 1');
  if (any.rows.length > 0) {
    console.log(`  ℹ️  Using first existing Turso user as author: ${any.rows[0].id}`);
    return any.rows[0].id as string;
  }

  const id = `admin-${Date.now()}`;
  await turso.execute({
    sql: `INSERT INTO "User" (id, name, email, role, password) VALUES (?, ?, ?, ?, ?)`,
    args: [id, "الإدارة", "admin@sy-nl.org", "admin", "auto-generated"],
  });
  console.log(`  ✅ Created admin user in Turso: ${id}`);
  return id;
}

async function main() {
  console.log("📋 Copying articles from local SQLite → Turso\n");

  const startTime = Date.now();

  const tursoAdminId = await getOrCreateTursoAdmin();

  const localPosts = await local.execute(
    'SELECT * FROM "Post" ORDER BY "createdAt" ASC'
  );
  console.log(`  📄 ${localPosts.rows.length} articles found locally\n`);

  let inserted = 0;
  let skipped = 0;
  let errors = 0;

  for (const row of localPosts.rows) {
    const post = row as Record<string, unknown>;

    try {
      const existingBySlug = post.slug
        ? await turso.execute({
            sql: 'SELECT id FROM "Post" WHERE "slug" = ?',
            args: [post.slug],
          })
        : { rows: [] };

      if (existingBySlug.rows.length > 0) {
        skipped++;
        if (skipped <= 3) console.log(`  ⏭️  Skipped (slug exists): ${(post.title as string)?.slice(0, 50)}`);
        continue;
      }

      const existingById = await turso.execute({
        sql: 'SELECT id FROM "Post" WHERE "id" = ?',
        args: [post.id],
      });

      const cols = Object.keys(post);
      const placeholders = cols.map(() => "?").join(", ");
      const colList = cols.map((c) => `"${c}"`).join(", ");

      const values = cols.map((c) => {
        if (c === "authorId") return tursoAdminId;
        return post[c];
      });

      if (existingById.rows.length > 0) {
        await turso.execute({
          sql: `DELETE FROM "Post" WHERE "id" = ?`,
          args: [post.id],
        });
      }

      await turso.execute({
        sql: `INSERT INTO "Post" (${colList}) VALUES (${placeholders})`,
        args: values,
      });
      inserted++;
    } catch (err: any) {
      errors++;
      console.error(`  ❌ Error inserting "${(post.title as string)?.slice(0, 50)}": ${err.message?.slice(0, 100)}`);
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`\n${"=".repeat(50)}`);
  console.log("📊 Results:");
  console.log(`  ✅ Inserted: ${inserted}`);
  console.log(`  ⏭️  Skipped:  ${skipped}`);
  console.log(`  ❌ Errors:   ${errors}`);
  console.log(`  ⏱️  Time:     ${duration}s\n`);

  local.close();
  turso.close();
}

main().catch((err) => {
  console.error("\n❌ Fatal error:", err.message);
  process.exit(1);
});
