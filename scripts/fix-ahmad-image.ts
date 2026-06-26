import { createClient } from "@libsql/client"
import "dotenv/config"

async function main() {
  // Fix Turso
  const turso = createClient({ url: process.env.TURSO_DATABASE_URL!, authToken: process.env.TURSO_AUTH_TOKEN! })
  await turso.execute({
    sql: 'UPDATE board_members SET image = ? WHERE id = ?',
    args: ["/images/board/Ahmad_Al_Herafi.jpg", "e5f4bb42-b0b5-442f-bd4e-4565854aacbc"],
  })
  const r = await turso.execute({
    sql: 'SELECT nameAr, image FROM board_members WHERE id = ?',
    args: ["e5f4bb42-b0b5-442f-bd4e-4565854aacbc"],
  })
  console.log("✅ Turso:", r.rows[0]?.nameAr, "→", r.rows[0]?.image)
  turso.close()

  // Fix local SQLite too
  const local = createClient({ url: "file:./prisma/dev.db" })
  await local.execute({
    sql: 'UPDATE board_members SET image = ? WHERE id = ?',
    args: ["/images/board/Ahmad_Al_Herafi.jpg", "e5f4bb42-b0b5-442f-bd4e-4565854aacbc"],
  })
  const r2 = await local.execute({
    sql: 'SELECT nameAr, image FROM board_members WHERE id = ?',
    args: ["e5f4bb42-b0b5-442f-bd4e-4565854aacbc"],
  })
  console.log("✅ Local:", r2.rows[0]?.nameAr, "→", r2.rows[0]?.image)
  local.close()
}

main().catch(console.error)
