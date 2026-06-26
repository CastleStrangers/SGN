import { createClient } from "@libsql/client"
import "dotenv/config"

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

async function main() {
  const tables = await turso.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
  console.log("=== جداول Turso ===")
  tables.rows.forEach((r: any) => console.log(" ", r.name))

  const boardTables = tables.rows.filter((r: any) => r.name.toLowerCase().includes("board"))
  console.log("\n=== جداول board في Turso ===")
  if (boardTables.length === 0) {
    console.log("  (لا يوجد)")
  } else {
    boardTables.forEach((r: any) => {
      console.log(" ", r.name)
    })
  }
}

main().catch(console.error)
