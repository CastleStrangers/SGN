delete (process.env as any).TURSO_DATABASE_URL;
delete (process.env as any).TURSO_AUTH_TOKEN;

import { prisma } from '../src/lib/db';

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      name: true,
    }
  });
  console.log("SQLITE LOCAL USERS:", JSON.stringify(users, null, 2));
}

main().finally(() => prisma.$disconnect());
