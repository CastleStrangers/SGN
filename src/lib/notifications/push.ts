import { prisma } from "@/lib/db";

interface PushMessage {
  title: string;
  body: string;
  data?: Record<string, any>;
}

export async function sendPushNotifications(msg: PushMessage) {
  const pushTokens = await prisma.pushToken.findMany({
    select: { token: true },
  });

  if (pushTokens.length === 0) return;

  const messages = pushTokens.map((pt: { token: string }) => ({
    to: pt.token,
    title: msg.title,
    body: msg.body,
    data: msg.data,
  }));

  try {
    const res = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
      },
      body: JSON.stringify(messages),
    });
    return await res.json();
  } catch (error) {
    console.error("Failed to send push notifications:", error);
  }
}

export async function sendPushToUser(userId: string, msg: PushMessage) {
  const pushTokens = await prisma.pushToken.findMany({
    where: { userId },
    select: { token: true },
  });

  if (pushTokens.length === 0) return;

  const messages = pushTokens.map((pt) => ({
    to: pt.token,
    title: msg.title,
    body: msg.body,
    data: msg.data,
    sound: "default",
  }));

  try {
    const res = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(messages),
    });
    return await res.json();
  } catch (error) {
    console.error(`Failed to send push to user ${userId}:`, error);
  }
}
