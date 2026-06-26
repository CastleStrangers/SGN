import { createClient } from "@libsql/client"
import "dotenv/config"

const LOCAL_DB = "file:./prisma/dev.db"
const turso = createClient({ url: (process.env.TURSO_DATABASE_URL || "").trim(), authToken: (process.env.TURSO_AUTH_TOKEN || "").trim() })
const local = createClient({ url: LOCAL_DB })

const fakeSource = "الجالية السورية في هولندا"

async function main() {
  const localIds = (await local.execute({ sql: 'SELECT id FROM Post WHERE source = ?', args: [fakeSource] })).rows.map(r => r.id as string)
  console.log(`عدد المقالات الوهمية: ${localIds.length}`)

  // Delete from local
  await local.execute({ sql: 'DELETE FROM Post WHERE source = ?', args: [fakeSource] })
  console.log("✅ SQLite: تم الحذف")

  // Delete from Turso
  await turso.execute({ sql: 'DELETE FROM Post WHERE source = ?', args: [fakeSource] })
  console.log("✅ Turso: تم الحذف")

  // Verify
  const localRemaining = (await local.execute('SELECT count(*) as cnt FROM Post')).rows[0].cnt
  const tursoRemaining = (await turso.execute('SELECT count(*) as cnt FROM Post')).rows[0].cnt
  console.log(`المتبقي: SQLite=${localRemaining}, Turso=${tursoRemaining}`)

  local.close()
  turso.close()
}

main().catch(console.error)
