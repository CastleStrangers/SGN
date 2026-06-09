import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  const messages = await prisma.chatMessage.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    orderBy: { createdAt: "desc" },
  });
  const partnerIds = new Set<string>();
  for (const m of messages) {
    const partnerId = m.senderId === userId ? m.receiverId : m.senderId;
    partnerIds.add(partnerId);
  }
  const conversations = await Promise.all(
    Array.from(partnerIds).map(async (partnerId) => {
      const partnerMessages = messages.filter(
        (m: { senderId: string; receiverId: string; read: boolean; createdAt: Date; message: string; id: string }) => (m.senderId === partnerId && m.receiverId === userId) || (m.senderId === userId && m.receiverId === partnerId)
      );
      const lastMessage = partnerMessages[0];
      const unreadCount = partnerMessages.filter(
        (m: { receiverId: string; read: boolean }) => m.receiverId === userId && !m.read
      ).length;
      const member = await prisma.member.findFirst({
        where: { userId: partnerId },
        select: { id: true, nameAr: true, nameNl: true, avatar: true },
      });
      const user = await prisma.user.findUnique({
        where: { id: partnerId },
        select: { name: true, image: true },
      });
      return {
        member: {
          id: partnerId,
          nameAr: member?.nameAr || user?.name || partnerId,
          nameNl: member?.nameNl || user?.name || partnerId,
          avatar: member?.avatar || user?.image || null,
        },
        lastMessage: lastMessage?.message || null,
        unreadCount,
        lastMessageAt: lastMessage?.createdAt || null,
      };
    })
  );
  conversations.sort((a, b) => {
    if (!a.lastMessageAt) return 1;
    if (!b.lastMessageAt) return -1;
    return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
  });
  return NextResponse.json(conversations);
}
