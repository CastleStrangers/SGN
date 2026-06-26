import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const tursoUrl = (process.env.TURSO_DATABASE_URL || "").trim();
const tursoToken = (process.env.TURSO_AUTH_TOKEN || "").trim();
const dbUrl = (tursoUrl && tursoUrl !== "undefined" && tursoToken && tursoToken !== "undefined")
  ? tursoUrl
  : "file:./prisma/dev.db";

const adapter = new PrismaLibSql({ url: dbUrl });
const p = new PrismaClient({ adapter });

async function main() {
  const board = await (p as any).boardMember.findMany({ orderBy: { createdAt: "asc" } });
  console.log("عدد أعضاء المجلس عبر Prisma:", board.length);
  if (board.length > 0) {
    const first = board[0];
    console.log("أول عضو:", first.id, first.nameAr, first.titleAr);
  } else {
    console.log("Prisma يرجع صفيف فاضي — تحقق من الموديل...");
    const names = Object.getOwnPropertyNames(p).filter((n) => !n.startsWith("_") && !n.startsWith("$"));
    console.log("كل خصائص Prisma:", names.join(", "));
    const matching = names.filter((n) => n.toLowerCase().includes("board") || n.toLowerCase().includes("member"));
    console.log("خصائص board/member:", matching.join(", "));
  }
  await p.$disconnect();
}

main().catch(console.error);
