import { prisma } from '../src/lib/db';

async function main() {
  const email = "m.salim.aziza@gmail.com";
  const updated = await prisma.user.update({
    where: { email },
    data: { role: "admin" }
  });
  console.log("Updated user:", updated.email, "role to:", updated.role);
}

main().finally(() => prisma.$disconnect());
