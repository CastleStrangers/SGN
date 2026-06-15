import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
   const user = await prisma.user.findUnique({
     where: { id },
     select: { id: true, name: true, image: true, bio: true, location: true, website: true, role: true, _count: { select: { posts: true } }, posts: { where: { published: true }, orderBy: { createdAt: "desc" }, take: 10, select: { id: true, title: true, slug: true, createdAt: true, category: true } }, members: { select: { status: true, createdAt: true } } },
   });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json(user);
}
