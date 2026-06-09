import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const withId = searchParams.get("with");
  if (!withId) {
    return NextResponse.json({ error: "Query param 'with' is required" }, { status: 400 });
  }
  const userId = session.user.id;
  const messages = await prisma.chatMessage.findMany({
    where: {
      OR: [
        { senderId: userId, receiverId: withId },
        { senderId: withId, receiverId: userId },
      ],
    },
    orderBy: { createdAt: "asc" },
  });
  await prisma.chatMessage.updateMany({
    where: { senderId: withId, receiverId: userId, read: false },
    data: { read: true },
  });
  return NextResponse.json(messages);
}
