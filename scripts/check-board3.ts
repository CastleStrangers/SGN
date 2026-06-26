import { createClient } from "@libsql/client"

async function main() {
  const local = createClient({ url: "file:./prisma/dev.db" })

  // Get columns
  const info = await local.execute("PRAGMA table_info(board_members)")
  console.log("=== أعمدة board_members (محلي) ===")
  info.rows.forEach((r: any) => console.log(`  ${r.name} | type=${r.type} | nullable=${r.notnull === 0}`))

  // Get data
  const all = await local.execute("SELECT * FROM board_members")
  console.log(`\nعدد الصفوف: ${all.rows.length}`)
  if (all.rows.length > 0) {
    console.log("\nأول 3 صفوف:")
    all.rows.slice(0, 3).forEach((r: any, i: number) => console.log(`  [${i}]`, JSON.stringify(r)))
  }

  local.close()
}

main().catch(console.error)
