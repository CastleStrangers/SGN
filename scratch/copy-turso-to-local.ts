import { createClient } from "@libsql/client"
import "dotenv/config"
import fs from "fs"
import path from "path"

const LOCAL_DB = "file:./prisma/dev.db"

function getProductionEnv(): Record<string, string> {
  const env: Record<string, string> = {}
  
  // Try loading from .env.production.local first, then .env.production, then process.env
  const paths = [".env.production.local", ".env.production"]
  for (const p of paths) {
    const fullPath = path.join(process.cwd(), p)
    if (fs.existsSync(fullPath)) {
      console.log(`Loading environment from ${p}...`)
      const content = fs.readFileSync(fullPath, "utf8")
      const lines = content.split(/\r?\n/)
      for (const line of lines) {
        const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)$/)
        if (match) {
          let key = match[1].trim()
          let val = match[2].trim()
          // remove quotes if any
          if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
          if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1)
          env[key] = val
        }
      }
    }
  }

  // merge process.env
  return {
    TURSO_DATABASE_URL: env.TURSO_DATABASE_URL || process.env.TURSO_DATABASE_URL || "",
    TURSO_AUTH_TOKEN: env.TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN || "",
  }
}

async function main() {
  console.log("==========================================")
  console.log("📋 Copying Facebook Articles from Turso → Local SQLite")
  console.log("==========================================\n")

  const env = getProductionEnv()
  const tursoUrl = env.TURSO_DATABASE_URL?.trim()
  const tursoToken = env.TURSO_AUTH_TOKEN?.trim()

  if (!tursoUrl || tursoUrl === "undefined" || !tursoToken || tursoToken === "undefined") {
    console.error("❌ Error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are not set.")
    console.log("\nPlease pull production environment variables from Vercel by running:")
    console.log("  npx vercel env pull --environment=production .env.production")
    process.exit(1)
  }

  console.log(`Turso DB: ${tursoUrl}`)
  
  const local = createClient({ url: LOCAL_DB })
  const turso = createClient({ url: tursoUrl, authToken: tursoToken })

  try {
    // 1. Fetch Facebook posts from Turso
    console.log("\nFetching Facebook posts from Turso...")
    const result = await turso.execute({
      sql: 'SELECT * FROM "Post" WHERE "source" LIKE ? OR "tags" LIKE ?',
      args: ["%facebook%", "%__source:facebook%"]
    })

    const fbPosts = result.rows
    console.log(`Found ${fbPosts.length} Facebook posts on Turso.`)

    if (fbPosts.length === 0) {
      console.log("No Facebook posts found on Turso.")
      return
    }

    // 2. Fetch current local posts to avoid duplicates
    const localResult = await local.execute('SELECT "title" FROM "Post"')
    const localTitles = new Set(localResult.rows.map(r => String(r.title)))

    // 3. Insert into local SQLite
    let inserted = 0
    let skipped = 0

    for (const row of fbPosts) {
      const post = row as Record<string, any>
      const title = String(post.title)

      if (localTitles.has(title)) {
        skipped++
        continue
      }

      const cols = Object.keys(post)
      const placeholders = cols.map(() => "?").join(", ")
      const colList = cols.map((c) => `"${c}"`).join(", ")
      const values = cols.map((c) => post[c])

      await local.execute({
        sql: `INSERT INTO "Post" (${colList}) VALUES (${placeholders})`,
        args: values,
      })
      inserted++
    }

    console.log(`\n✅ Successfully completed!`)
    console.log(`   - Restored/Inserted: ${inserted} posts`)
    console.log(`   - Skipped (existing): ${skipped} posts`)

  } catch (err: any) {
    console.error("\n❌ Error during copy:", err.message)
  } finally {
    local.close()
    turso.close()
  }
}

main().catch(console.error)
