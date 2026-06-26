import { createClient } from "@libsql/client"
import "dotenv/config"

async function main() {
  const local = createClient({ url: "file:./prisma/dev.db" })
  const tables = await local.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
  console.log("=== جداول SQLite المحلي ===")
  tables.rows.forEach((r: any) => console.log(" ", r.name))

  // Check Prisma migration tracking
  const migrations = await local.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '_prisma%' OR name LIKE '%migration%'")
  console.log("\n=== جداول Prisma ===")
  migrations.rows.forEach((r: any) => console.log(" ", r.name))

  local.close()
}

main().catch(console.error)
