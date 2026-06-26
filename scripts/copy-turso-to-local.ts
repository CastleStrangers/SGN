import { createClient } from "@libsql/client"
import "dotenv/config"

const LOCAL_DB = "file:./prisma/dev.db"
const tursoUrl = (process.env.TURSO_DATABASE_URL || "").trim()
const tursoToken = (process.env.TURSO_AUTH_TOKEN || "").trim()

const local = createClient({ url: LOCAL_DB })
const turso = createClient({ url: tursoUrl, authToken: tursoToken })

async function main() {
  console.log("📋 Copying articles from Turso → local SQLite\n")

  const remotePosts = await turso.execute('SELECT * FROM "Post" ORDER BY "createdAt" ASC')
  console.log(`  📄 ${remotePosts.rows.length} articles found in Turso\n`)

  let inserted = 0
  let skipped = 0
  let errors = 0

  const schema = await local.execute("PRAGMA table_info(\"Post\")")
  const localCols = schema.rows.map((r) => r.name as string)

  for (const row of remotePosts.rows) {
    const post = row as Record<string, unknown>
    try {
      const existing = await local.execute({
        sql: 'SELECT id FROM "Post" WHERE "id" = ?',
        args: [post.id],
      })
      if (existing.rows.length > 0) {
        skipped++
        continue
      }

      const cols = localCols
      const placeholders = cols.map(() => "?").join(", ")
      const colList = cols.map((c) => `"${c}"`).join(", ")
      const values = cols.map((c) => post[c] ?? null)

      await local.execute({
        sql: `INSERT INTO "Post" (${colList}) VALUES (${placeholders})`,
        args: values,
      })
      inserted++
    } catch (err: any) {
      errors++
      console.error(`  ❌ Error: ${err.message?.slice(0, 100)}`)
    }
  }

  console.log(`  ✅ ${inserted} جديد | ⏭️  ${skipped} موجود | ❌ ${errors} خطأ`)
  local.close()
  turso.close()
}

main().catch((err) => {
  console.error("\n❌", err.message)
  process.exit(1)
})
