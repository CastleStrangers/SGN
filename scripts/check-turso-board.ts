import { createClient } from "@libsql/client"
import "dotenv/config"

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

async function main() {
  const board = await turso.execute("SELECT * FROM board_members")
  console.log("عدد أعضاء المجلس في Turso:", board.rows.length)
  if (board.rows.length > 0) {
    board.rows.forEach((r: any, i: number) => {
      console.log(`  [${i}] ${r.nameAr} | ${r.titleAr}`)
    })
  }
}

main().catch(console.error)
