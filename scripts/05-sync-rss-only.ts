import "dotenv/config"
import { prisma } from "./db"
import { runSync, DEFAULT_SOURCES } from "../src/lib/sync"

async function main() {
  console.log("🧹 Deleting old Dutch/English RSS news from database...");
  const deleteResult = await prisma.post.deleteMany({
    where: {
      source: {
        in: ["nos-netherlands", "euronews-europe", "euronews-business", "euronews-culture"]
      }
    }
  });
  console.log(`✅ Deleted ${deleteResult.count} posts.`);

  const rssSources = DEFAULT_SOURCES.filter(s => s.type === "rss");
  console.log(`🔄 Triggering runSync() for ${rssSources.length} RSS sources...`);
  
  const results = await runSync(rssSources);
  
  for (const r of results) {
    const status = r.success ? "✅" : "❌";
    console.log(`\n${status} Source: ${r.source}\n   Fetched: ${r.fetched} | New: ${r.new} | Skipped: ${r.skipped} | Errors: ${r.errors.length}`);
    if (r.errors.length > 0) {
      r.errors.forEach(e => console.log(`     ❌ ${e}`));
    }
  }
  
  console.log("\n🎉 Done!");
}

main()
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
