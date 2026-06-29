import { prisma } from "../src/lib/db.js";
async function main() {
  try {
    const total = await prisma.post.count();
    const fbCount = await prisma.post.count({ where: { source: "facebook-sgn" } });
    console.log("TOTAL_POSTS=" + total + " FB_POSTS=" + fbCount);
  } catch (e: any) {
    console.error(e);
  }
}
main();
