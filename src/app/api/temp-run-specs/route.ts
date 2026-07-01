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
  fs.writeFileSync(logPath, "Starting cleanup and fresh sync...\n");

  isRunning = true;

  (async () => {
    try {
      fs.appendFileSync(logPath, "Deleting old English/Dutch synced posts from DB...\n");
      
      const deleteResult = await prisma.post.deleteMany({
        where: {
          source: {
            in: ["nos-netherlands", "euronews-europe", "euronews-business", "euronews-culture"]
          }
        }
      });
      
      fs.appendFileSync(logPath, `Deleted ${deleteResult.count} posts successfully.\n`);
      fs.appendFileSync(logPath, "Triggering fresh runSync() with rate-limiting and RSS images enabled...\n");
      
      const results = await runSync();
      
      fs.appendFileSync(logPath, `Fresh sync finished successfully! Results:\n${JSON.stringify(results, null, 2)}\n`);
    } catch (err: any) {
      fs.appendFileSync(logPath, `Error during cleanup/sync: ${err.message}\nStack: ${err.stack}\n`);
    } finally {
      isRunning = false;
    }
  })();

  return NextResponse.json({ 
    message: "Cleanup and fresh sync started in background. Monitor progress in temp_sync_run_log.txt." 
  });
}
