import { createClient } from "@libsql/client"

async function checkDb(name: string, filePath: string) {
  console.log(`\n=== Checking Database: ${name} (${filePath}) ===`)
  const client = createClient({ url: `file:${filePath}` })
  try {
    const stats = await client.execute({ sql: "SELECT count(*) as total FROM Post", args: [] })
    console.log(`Total posts: ${stats.rows[0]?.total}`)

    const sources = await client.execute({ sql: "SELECT distinct source FROM Post", args: [] })
    console.log("Sources:")
    sources.rows.forEach(r => console.log(`  - "${r.source}"`))

    const sample = await client.execute({ sql: "SELECT title, source, category FROM Post LIMIT 3", args: [] })
    console.log("Sample Posts:")
    sample.rows.forEach((r, idx) => console.log(`  [${idx + 1}] Title: "${r.title}" | Source: "${r.source}" | Category: "${r.category}"`))
  } catch (err) {
    console.error(`Error reading ${name}:`, err)
  } finally {
    client.close()
  }
}

async function main() {
  await checkDb("dev.db (Active)", "./prisma/dev.db")
  await checkDb("dev.db.bak (Backup)", "./prisma/dev.db.bak")
  await checkDb("dev-check.db (Check)", "./prisma/dev-check.db")
}

main()
