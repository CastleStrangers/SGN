import { prisma } from "./src/lib/db"

async function main() {
  try {
    const posts = await prisma.post.findMany({ take: 5 })
    console.log("Database connected! Found posts:", posts.length)
  } catch (err) {
    console.error("Database connection failed:", err)
  }
}
main()
