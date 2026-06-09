import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { token } = await req.json();
    if (!token) return NextResponse.json({ error: "token is required" }, { status: 400 });

    await prisma.pushToken.upsert({
      where: { token },
      update: { userId: session.user.id },
      create: { token, userId: session.user.id },
    });

    return NextResponse.json({ message: "Token registered" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { token } = await req.json();
    if (!token) return NextResponse.json({ error: "token is required" }, { status: 400 });

    await prisma.pushToken.deleteMany({ where: { token } });
    return NextResponse.json({ message: "Token removed" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
