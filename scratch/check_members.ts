import { prisma } from "../src/lib/db";

async function main() {
  try {
    const total = await prisma.member.count();
    console.log("Total members in DB:", total);
    
    if (total > 0) {
      const sample = await prisma.member.findMany({ take: 5 });
      console.log("Sample members:", JSON.stringify(sample, null, 2));

      const genders = await prisma.member.groupBy({
        by: ['gender'],
        _count: { id: true }
      });
      console.log("Gender counts:", genders);

      const provinces = await prisma.member.groupBy({
        by: ['nlProvincie'],
        _count: { id: true }
      });
      console.log("Province counts:", provinces);

      const origins = await prisma.member.groupBy({
        by: ['originCity'],
        _count: { id: true }
      });
      console.log("Origin city counts:", origins);

      const birthYears = await prisma.member.groupBy({
        by: ['birthYear'],
        _count: { id: true }
      });
      console.log("Birth years counts:", birthYears);
    } else {
      console.log("No members found. We may need to seed or insert some mock members to test our stats page!");
    }
  } catch (error) {
    console.error("Error checking members:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
