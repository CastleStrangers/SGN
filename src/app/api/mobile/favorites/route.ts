import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/mobile-auth";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const user = await getSessionUser(req);
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          image: true,
          category: true,
          createdAt: true,
        },
      },
    },
  });

  return NextResponse.json(favorites);
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { postId } = await req.json();
    if (!postId) return NextResponse.json({ error: "postId is required" }, { status: 400 });

    const existing = await prisma.favorite.findUnique({
      where: { userId_postId: { userId: user.id, postId } },
    });
    if (existing) return NextResponse.json({ message: "Already favorited" });

    const favorite = await prisma.favorite.create({
      data: { userId: user.id, postId },
    });

    return NextResponse.json(favorite, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { postId } = await req.json();
    if (!postId) return NextResponse.json({ error: "postId is required" }, { status: 400 });

    await prisma.favorite.deleteMany({
      where: { userId: user.id, postId },
    });

    return NextResponse.json({ message: "Removed from favorites" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

