import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { runSync } from "@/lib/sync";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

let isRunning = false;

export async function GET() {
  if (isRunning) {
    return NextResponse.json({ message: "Sync/Cleanup is already running in background." });
  }

  const logPath = path.join(process.cwd(), "temp_sync_run_log.txt");
  fs.writeFileSync(logPath, "Starting focused cleanup and sync...\n");

  isRunning = true;

  // Run in background
  (async () => {
    try {
      fs.appendFileSync(logPath, "Deleting old Dutch/English RSS news from database...\n");
      const deleteResult = await prisma.post.deleteMany({
        where: {
          source: {
            in: ["nos-netherlands", "euronews-europe", "euronews-business", "euronews-culture"]
          }
        }
      });
      fs.appendFileSync(logPath, `Deleted ${deleteResult.count} posts.\n`);

      const rssSources = [
        {
          name: "nos-netherlands",
          type: "rss" as const,
          url: "https://feeds.nos.nl/nosnieuwsalgemeen",
          enabled: true,
          category: "أخبار هولندا",
          translate: true,
        },
        {
          name: "euronews-europe",
          type: "rss" as const,
          url: "https://www.euronews.com/rss?level=theme&name=news",
          enabled: true,
          category: "أخبار أوروبا",
          translate: true,
        },
        {
          name: "euronews-business",
          type: "rss" as const,
          url: "https://www.euronews.com/rss?level=vertical&name=business",
          enabled: true,
          category: "اقتصاد",
          translate: true,
        },
        {
          name: "euronews-culture",
          type: "rss" as const,
          url: "https://www.euronews.com/rss?level=vertical&name=culture",
          enabled: true,
          category: "ثقافيات",
          translate: true,
        },
      ];

      fs.appendFileSync(logPath, `Triggering runSync() with ${rssSources.length} explicit RSS sources...\n`);
      const results = await runSync(rssSources);
      
      fs.appendFileSync(logPath, `Sync finished! Results:\n${JSON.stringify(results, null, 2)}\n`);
    } catch (err: any) {
      fs.appendFileSync(logPath, `Error: ${err.message}\nStack: ${err.stack}\n`);
    } finally {
      isRunning = false;
    }
  })();

  return NextResponse.json({ 
    message: "Focused sync started in background. Monitor progress in temp_sync_run_log.txt." 
  });
}
