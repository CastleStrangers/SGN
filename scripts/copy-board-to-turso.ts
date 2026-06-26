import { createClient } from "@libsql/client"
import "dotenv/config"

const LOCAL_DB = "file:./prisma/dev.db"
const tursoUrl = (process.env.TURSO_DATABASE_URL || "").trim()
const tursoToken = (process.env.TURSO_AUTH_TOKEN || "").trim()

const local = createClient({ url: LOCAL_DB })
const turso = createClient({ url: tursoUrl, authToken: tursoToken })

async function main() {
  console.log("📋 نسخ أعضاء مجلس الإدارة من SQLite → Turso\n")

  const localRows = await local.execute("SELECT * FROM board_members ORDER BY \"createdAt\" ASC")
  console.log(`  📄 ${localRows.rows.length} عضو في SQLite المحلي\n`)

  let inserted = 0
  let skipped = 0
  let errors = 0

  const schema = await turso.execute("PRAGMA table_info(board_members)")
  const cols = schema.rows.map((r) => r.name as string)
  console.log(`  أعمدة Turso: ${cols.join(", ")}`)

  for (const row of localRows.rows) {
    const member = row as Record<string, unknown>
    try {
      const existing = await turso.execute({
        sql: 'SELECT id FROM board_members WHERE "id" = ?',
        args: [member.id],
      })
      if (existing.rows.length > 0) {
        skipped++
        continue
      }

      const placeholders = cols.map(() => "?").join(", ")
      const colList = cols.map((c) => `"${c}"`).join(", ")
      const values = cols.map((c) => member[c] ?? null)

      await turso.execute({
        sql: `INSERT INTO board_members (${colList}) VALUES (${placeholders})`,
        args: values,
      })
      inserted++
    } catch (err: any) {
      errors++
      console.error(`  ❌ ${err.message?.slice(0, 100)}`)
    }
  }

  console.log(`\n  ✅ ${inserted} جديد | ⏭️  ${skipped} موجود | ❌ ${errors} خطأ`)
  local.close()
  turso.close()
}

main().catch(console.error)
