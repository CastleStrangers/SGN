import { NextResponse } from "next/server";
import { runSync } from "@/lib/sync";
import fs from "fs";
import path from "path";

let isRunning = false;

export async function GET() {
  if (isRunning) {
    return NextResponse.json({ message: "Sync is already running in background." });
  }

  const logPath = path.join(process.cwd(), "temp_sync_run_log.txt");
  fs.writeFileSync(logPath, "Starting background sync...\n");

  isRunning = true;

  // Trigger async sync run
  (async () => {
    try {
      fs.appendFileSync(logPath, "Triggering runSync()...\n");
      const results = await runSync();
      fs.appendFileSync(logPath, `Sync finished successfully! Results:\n${JSON.stringify(results, null, 2)}\n`);
    } catch (err: any) {
      fs.appendFileSync(logPath, `Error during sync: ${err.message}\nStack: ${err.stack}\n`);
    } finally {
      isRunning = false;
    }
  })();

  return NextResponse.json({ 
    message: "Sync started in background. Monitor progress in temp_sync_run_log.txt." 
  });
}
