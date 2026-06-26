import { PrismaClient } from ".prisma/client";

const p = new PrismaClient();

async function main() {
  const board = await (p as any).boardMember.findMany({ orderBy: { createdAt: "asc" } });
  console.log("عدد أعضاء المجلس عبر Prisma:", board.length);
  if (board.length > 0) {
    console.log("أول عضو:", JSON.stringify(board[0], null, 2).slice(0, 300));
  } else {
    console.log("Prisma يرجع صفيف فاضي");
    // check available properties
    const names = Object.getOwnPropertyNames(p).filter((n) => !n.startsWith("_") && !n.startsWith("$"));
    console.log("خصائص Prisma:", names.filter((n) => n.toLowerCase().includes("board")).join(", "));
  }
  await p.$disconnect();
}

main().catch(console.error);
