import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      image: true,
      bio: true,
      location: true,
      website: true,
      role: true,
      _count: { select: { posts: true } },
      posts: {
        where: { published: true },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, title: true, slug: true, createdAt: true, category: true }
      },
      members: {
        select: {
          id: true,
          status: true,
          createdAt: true,
          showInPublicProfile: true
        }
      }
    },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Normalize: pick first member record for convenience
  const member = user.members?.[0] ?? null;

  return NextResponse.json({ ...user, member });
}
