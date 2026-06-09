import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, name: true, email: true, image: true, role: true, bio: true, phone: true, location: true, website: true, _count: { select: { posts: true } } },
  });

  return NextResponse.json(user);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const allowed = ["name", "bio", "phone", "location", "website", "image"];

  const updateData: Record<string, any> = {};
  for (const key of allowed) {
    if (data[key] !== undefined) updateData[key] = data[key];
  }

  const user = await prisma.user.update({
    where: { email: session.user.email },
    data: updateData,
    select: { id: true, name: true, email: true, image: true, role: true, bio: true, phone: true, location: true, website: true },
  });

  return NextResponse.json(user);
}
