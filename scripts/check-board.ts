import { createClient } from "@libsql/client"
import "dotenv/config"

async function main() {
  // Check local SQLite
  const local = createClient({ url: "file:./prisma/dev.db" })
  const localBoard = await local.execute('SELECT id, name, position, "order" FROM "BoardMember" ORDER BY "order" ASC')
  console.log("=== Local SQLite ===")
  console.log("عدد أعضاء المجلس:", localBoard.rows.length)
  localBoard.rows.forEach((r: any) => console.log(`  ${r.id} | ${r.name} | ${r.position} | ترتيب ${r.order}`))
  local.close()

  // Check Turso
  const tursoUrl = process.env.TURSO_DATABASE_URL?.trim()
  const tursoToken = process.env.TURSO_AUTH_TOKEN?.trim()
  if (tursoUrl && tursoToken) {
    const turso = createClient({ url: tursoUrl, authToken: tursoToken })
    const tursoBoard = await turso.execute('SELECT id, name, position, "order" FROM "BoardMember" ORDER BY "order" ASC')
    console.log("\n=== Turso ===")
    console.log("عدد أعضاء المجلس:", tursoBoard.rows.length)
    tursoBoard.rows.forEach((r: any) => console.log(`  ${r.id} | ${r.name} | ${r.position} | ترتيب ${r.order}`))
    turso.close()
  }
}

main().catch(console.error)
