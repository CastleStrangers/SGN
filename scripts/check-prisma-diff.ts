import { PrismaClient as PrismaClient1 } from "@prisma/client"
import { PrismaClient as PrismaClient2 } from ".prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"

const adapter1 = new PrismaLibSql({ url: "file:./prisma/dev.db" })
const adapter2 = new PrismaLibSql({ url: "file:./prisma/dev.db" })

const p1 = new PrismaClient1({ adapter: adapter1 })
const p2 = new PrismaClient2({ adapter: adapter2 })

async function main() {
  // Check @prisma/client
  const names1 = Object.getOwnPropertyNames(p1).filter((n) => !n.startsWith("_") && !n.startsWith("$"))
  console.log("=== @prisma/client properties ===")
  console.log(names1.filter((n) => n.toLowerCase().includes("board")).join(", "))
  console.log("عدد:", names1.length)

  // Check .prisma/client
  const names2 = Object.getOwnPropertyNames(p2).filter((n) => !n.startsWith("_") && !n.startsWith("$"))
  console.log("\n=== .prisma/client properties ===")
  console.log(names2.filter((n) => n.toLowerCase().includes("board")).join(", "))
  console.log("عدد:", names2.length)

  // Try querying
  try {
    const r1 = await (p1 as any).boardMember.findMany()
    console.log("\n@prisma/client boardMember.findMany():", r1.length)
  } catch (e: any) {
    console.log("\n@prisma/client error:", e.message)
  }

  try {
    const r2 = await (p2 as any).boardMember.findMany()
    console.log(".prisma/client boardMember.findMany():", r2.length)
  } catch (e: any) {
    console.log(".prisma/client error:", e.message)
  }

  await p1.$disconnect()
  await p2.$disconnect()
}

main().catch(console.error)
