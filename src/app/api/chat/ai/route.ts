import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getOrCreateSession, sendAIMessage } from "@/lib/ai/chat";

const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60_000;
const rateMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(userId);
  if (!entry || now > entry.resetAt) {
    rateMap.set(userId, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");

  const where: any = { userId: session.user.id };
  if (sessionId) where.id = sessionId;

  const sessions = await prisma.chatAISession.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: { messages: { orderBy: { createdAt: "asc" }, take: 50 } },
    take: sessionId ? 1 : 10,
  });

  return NextResponse.json(sessionId ? sessions[0] || null : sessions);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!checkRateLimit(session.user.id)) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again later." }, { status: 429 });
  }

  try {
    const { message, sessionId, locale, persona } = await req.json();
    if (!message?.trim()) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    const userLocale = locale || "ar";
    const sid = sessionId || await getOrCreateSession(session.user.id, persona);
    const userName = session.user.name || session.user.email || "User";

    const { reply, sources } = await sendAIMessage(sid, session.user.id, message.trim(), userLocale, userName, persona);

    return NextResponse.json({ reply, sessionId: sid, sources });
  } catch (e: any) {
    console.error("AI chat error:", e);
    return NextResponse.json({ error: e.message || "Internal server error" }, { status: 500 });
  }
}
