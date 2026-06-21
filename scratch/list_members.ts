import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const members = await prisma.boardMember.findMany({
    select: {
      id: true,
      nameAr: true,
      nameEn: true,
      image: true
    }
  });

  console.log("=== BOARD MEMBERS IN DATABASE ===");
  console.log(JSON.stringify(members, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
