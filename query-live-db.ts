import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import fs from 'fs'

async function main() {
  const envProd = fs.readFileSync(".env.production", "utf8")
  const urlMatch = envProd.match(/TURSO_DATABASE_URL=([^\r\n]+)/)
  const tokenMatch = envProd.match(/TURSO_AUTH_TOKEN=([^\r\n]+)/)

  if (!urlMatch || !tokenMatch) {
    console.error("Missing Turso credentials")
    return
  }

  const adapter = new PrismaLibSql({
    url: urlMatch[1],
    authToken: tokenMatch[1]
  })
  
  const prisma = new PrismaClient({ adapter })

  console.log("Connected to LIVE Turso DB.")

  const counts = await prisma.post.groupBy({
    by: ['category'],
    _count: { category: true }
  })

  console.log("Category counts on LIVE DB:")
  console.dir(counts, { depth: null })

  // also let's check the source distribution
  const sources = await prisma.post.groupBy({
    by: ['source'],
    _count: { source: true }
  })
  console.log("Source counts on LIVE DB:")
  console.dir(sources, { depth: null })

  await prisma.$disconnect()
}

main().catch(console.error)
