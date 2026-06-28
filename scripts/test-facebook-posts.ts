import { prisma } from "../src/lib/db";

async function main() {
  const posts = await prisma.post.findMany({
    where: { source: "facebook-sgn" },
    select: {
      id: true,
      title: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  console.log(JSON.stringify(posts, null, 2));
}

main();
