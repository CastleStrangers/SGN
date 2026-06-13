import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/mobile-auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { token } = await req.json();
    if (!token) return NextResponse.json({ error: "token is required" }, { status: 400 });

    await prisma.pushToken.upsert({
      where: { token },
      update: { userId: user.id },
      create: { token, userId: user.id },
    });

    return NextResponse.json({ message: "Token registered" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { token } = await req.json();
    if (!token) return NextResponse.json({ error: "token is required" }, { status: 400 });

    await prisma.pushToken.deleteMany({ where: { token } });
    return NextResponse.json({ message: "Token removed" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

