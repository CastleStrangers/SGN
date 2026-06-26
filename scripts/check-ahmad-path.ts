import { createClient } from "@libsql/client"
import "dotenv/config"

async function main() {
  // Local SQLite
  const local = createClient({ url: "file:./prisma/dev.db" })
  const r1 = await local.execute("SELECT id, nameAr, nameEn, image FROM board_members WHERE nameAr LIKE '%أحمد%' OR nameEn LIKE '%ahmad%' OR nameEn LIKE '%harfi%'")
  console.log("=== Local SQLite ===")
  r1.rows.forEach((x: any) => console.log(JSON.stringify(x, null, 2)))
  local.close()

  // Turso
  const turso = createClient({ url: process.env.TURSO_DATABASE_URL!, authToken: process.env.TURSO_AUTH_TOKEN! })
  const r2 = await turso.execute("SELECT id, nameAr, nameEn, image FROM board_members WHERE nameAr LIKE '%أحمد%' OR nameEn LIKE '%ahmad%' OR nameEn LIKE '%harfi%'")
  console.log("\n=== Turso ===")
  r2.rows.forEach((x: any) => console.log(JSON.stringify(x, null, 2)))
  turso.close()
}

main().catch(console.error)
