import { runSync } from "../src/lib/sync"
import { execSync } from "child_process"
import * as dotenv from "dotenv"

dotenv.config()

async function main() {
  console.log(`[${new Date().toISOString()}] Starting sync...`)
  const start = Date.now()

  try {
    const results = await runSync()
    for (const r of results) {
      console.log(
        `[${r.source}] ${r.success ? "OK" : "FAIL"} ` +
        `fetched=${r.fetched} new=${r.new} skipped=${r.skipped} ` +
        `errors=${r.errors.length} duration=${r.duration}ms`
      )
      if (r.errors.length > 0) {
        for (const e of r.errors) {
          console.error(`  ERROR: ${e}`)
        }
      }
    }
    console.log(`[${new Date().toISOString()}] Sync completed in ${Date.now() - start}ms`)
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Sync failed:`, err)
    process.exit(1)
  }

  // Restart app so new static files in public/ are picked up
  try {
    execSync("npx pm2 restart sy-nl", { stdio: "inherit", timeout: 15000 })
  } catch {
    // non-fatal
  }
}

main()
