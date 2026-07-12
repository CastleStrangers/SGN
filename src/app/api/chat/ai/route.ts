import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOrCreateSession, sendAIMessage } from "@/lib/ai/chat";
import { getSessionUser } from "@/lib/mobile-auth";
import { createRateLimiter } from "@/lib/rate-limit";
import { applyGuardrails } from "@/lib/guardrails";

const chatLimiter = createRateLimiter({ maxRequests: 30, windowMs: 60_000, name: "ai-chat" });

export async function GET(req: Request) {
  const user = await getSessionUser(req);
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");

  const where: any = { userId: user.id };
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
  const user = await getSessionUser(req);
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (chatLimiter.isLimited(user.id)) {
    const retryAfter = Math.ceil((chatLimiter.getResetTime(user.id) - Date.now()) / 1000);
    return NextResponse.json(
      { error: `Rate limit exceeded. Try again in ${retryAfter}s.` },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  try {
    const { message, sessionId, locale, persona } = await req.json();
    if (!message?.trim()) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    const guarded = applyGuardrails({
      messages: [{ role: "user", content: message.trim() }],
    });

    if (guarded.blocked) {
      return NextResponse.json(
        { error: guarded.reason || "Message blocked by guardrails" },
        { status: 400 }
      );
    }

    const cleanMessage = guarded.messages[0].content;

    const userLocale = locale || "ar";
    const sid = sessionId || await getOrCreateSession(user.id, persona);
    const userName = user.name || user.email || "User";

    const { reply, sources } = await sendAIMessage(sid, user.id, cleanMessage, userLocale, userName, persona);

    return NextResponse.json({ reply, sessionId: sid, sources });
  } catch (e: any) {
    console.error("AI chat error:", e);
    return NextResponse.json({ error: e.message || "Internal server error" }, { status: 500 });
  }
}
