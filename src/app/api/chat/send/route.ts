import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getApiMessage } from "@/lib/api-messages";
import { sendPushToUser } from "@/lib/notifications/push";

function t(req: Request, key: string, vars?: Record<string, string>) {
  const locale = (req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
  return getApiMessage(locale, key, vars);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { receiverId, message } = await req.json();
    if (!receiverId || !message?.trim()) {
      return NextResponse.json({ error: "receiverId and message are required" }, { status: 400 });
    }
    const senderId = session.user.id;
    const chatMessage = await prisma.chatMessage.create({
      data: { senderId, receiverId, message: message.trim() },
    });
    await prisma.notification.create({
      data: {
        userId: receiverId,
        title: t(req, 'chat.newMessage'),
        message: t(req, 'api.newMessageFrom', { name: session.user.name || t(req, 'api.newMessageFromSomeone') }),
        link: "/messages",
      },
    });

    // Send Real-time Push Notification
    await sendPushToUser(receiverId, {
      title: t(req, 'chat.newMessage'),
      body: t(req, 'api.newMessageFrom', { name: session.user.name || t(req, 'api.newMessageFromSomeone') }) + ": " + message.trim().slice(0, 50),
      data: {
        type: "chat",
        senderId,
        senderName: session.user.name,
        link: "/messages"
      },
    });

    return NextResponse.json(chatMessage, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
