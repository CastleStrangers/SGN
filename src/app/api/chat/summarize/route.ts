import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { summarizeConversation } from "@/lib/ai/text";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { sessionId, locale } = await req.json();
    if (!sessionId) {
      return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
    }

    const msgs = await prisma.chatAIMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
    });

    if (msgs.length === 0) {
      return NextResponse.json({ summary: "لا توجد رسائل في هذه المحادثة." });
    }

    const summary = await summarizeConversation(msgs, locale || "ar");
    return NextResponse.json({ summary });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
