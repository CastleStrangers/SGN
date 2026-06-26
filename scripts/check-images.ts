import { createClient } from "@libsql/client"
import { existsSync } from "fs"

async function main() {
  const local = createClient({ url: "file:./prisma/dev.db" })
  const rows = await local.execute("SELECT id, nameAr, nameEn, image FROM board_members ORDER BY nameAr ASC")
  console.log("=== كل الأعضاء وصورهم ===")
  for (const r of rows.rows) {
    const img = (r as any).image || "(بدون صورة)"
    const localPath = `public${img.replace(/^\//, "/")}`
    const exists = existsSync(localPath) ? "✅" : "❌"
    console.log(`  ${(r as any).nameAr.padEnd(25)} | ${img.padEnd(50)} ${img !== "(بدون صورة)" ? exists : ""}`)
  }
  local.close()
}

main().catch(console.error)
