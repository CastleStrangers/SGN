import { createClient } from "@libsql/client"
import "dotenv/config"

async function main() {
  // Local SQLite — the table is board_members (snake_case per @@map)
  const local = createClient({ url: "file:./prisma/dev.db" })
  const localBoard = await local.execute('SELECT id, name, position, "order" FROM board_members ORDER BY "order" ASC')
  console.log("=== Local SQLite (board_members) ===")
  console.log("عدد أعضاء المجلس:", localBoard.rows.length)
  localBoard.rows.forEach((r: any) => console.log(`  ${r.id} | ${r.name} | ${r.position} | ترتيب ${r.order}`))
  local.close()

  // Turso
  const tursoUrl = process.env.TURSO_DATABASE_URL?.trim()
  const tursoToken = process.env.TURSO_AUTH_TOKEN?.trim()
  if (tursoUrl && tursoToken) {
    const turso = createClient({ url: tursoUrl, authToken: tursoToken })
    const tables = await turso.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%oard%' OR name LIKE '%oard%' OR name LIKE '%ember%'")
    console.log("\n=== Turso — جداول مشابهة ===")
    tables.rows.forEach((r: any) => console.log(" ", r.name))

    const tursoBoard = await turso.execute('SELECT id, name, position, "order" FROM board_members ORDER BY "order" ASC')
    console.log("\n=== Turso (board_members) ===")
    console.log("عدد أعضاء المجلس:", tursoBoard.rows.length)
    tursoBoard.rows.forEach((r: any) => console.log(`  ${r.id} | ${r.name} | ${r.position} | ترتيب ${r.order}`))
    turso.close()
  }
}

main().catch(console.error)
