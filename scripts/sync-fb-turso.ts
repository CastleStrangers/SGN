import { createClient } from "@libsql/client";
import "dotenv/config";

async function main() {
  const local = createClient({ url: "file:./prisma/dev.db" });
  const turso = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  const fbPosts = await local.execute("SELECT * FROM Post WHERE source = 'facebook-sgn'");
  console.log(`Found ${fbPosts.rows.length} Facebook posts in local SQLite`);

  let inserted = 0;
  for (const post of fbPosts.rows) {
    const cols = Object.keys(post);
    const colList = cols.map(c => `"${c}"`).join(", ");
    const placeholders = cols.map(() => "?").join(", ");
    const values = cols.map(c => (post as Record<string, unknown>)[c]);

    try {
      await turso.execute({
        sql: `INSERT OR IGNORE INTO Post (${colList}) VALUES (${placeholders})`,
        args: values,
      });
      inserted++;
    } catch (e: any) {
      console.error(`Error syncing post: ${e?.message?.slice(0, 80)}`);
    }
  }

  const tursoCount = await turso.execute("SELECT count(*) as count FROM Post WHERE source = 'facebook-sgn'");
  console.log(`✅ Synced ${inserted} posts. Total Facebook posts in Turso: ${tursoCount.rows[0]?.count}`);

  local.close();
  turso.close();
}

main().catch(console.error);
