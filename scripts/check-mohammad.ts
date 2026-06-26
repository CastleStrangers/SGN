import { createClient } from "@libsql/client"
import "dotenv/config"

async function main() {
  const local = createClient({ url: "file:./prisma/dev.db" })
  const turso = createClient({ url: process.env.TURSO_DATABASE_URL!, authToken: process.env.TURSO_AUTH_TOKEN! })

  for (const name of ["local", "turso"]) {
    const db = name === "local" ? local : turso
    const all = await db.execute("SELECT id, nameAr, nameEn, image FROM board_members")
    const matches = all.rows.filter((r: any) =>
      (r.nameAr as string).includes("سليم") || (r.nameAr as string).includes("عزيز") ||
      (r.nameEn as string).toLowerCase().includes("salim") || (r.nameEn as string).toLowerCase().includes("aziza") ||
      (r.nameEn as string).toLowerCase().includes("mohammad") || (r.nameAr as string).includes("محمد")
    )
    console.log(`=== ${name} ===`)
    if (matches.length === 0) {
      console.log("  لا يوجد")
    } else {
      matches.forEach((r: any) => console.log(`  ${r.id} | ${r.nameAr} | ${r.nameEn} | ${r.image}`))
    }
    console.log()
  }

  local.close()
  turso.close()
}

main().catch(console.error)
