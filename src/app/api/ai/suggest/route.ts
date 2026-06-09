import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateTaskSuggestion, analyzeTask } from "@/lib/ai/tasks";
import { prisma } from "@/lib/db";
import { getApiMessage } from "@/lib/api-messages";

function t(req: Request, key: string, vars?: Record<string, string>) {
  const locale = (req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
  return getApiMessage(locale, key, vars);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { action, prompt } = await req.json();
    if (action === "suggest") {
      const suggestion = await generateTaskSuggestion(prompt || t(req, 'ai.defaultSuggestPrompt'));
      return NextResponse.json({ result: suggestion });
    }
    if (action === "analyze") {
      const tasks = await prisma.task.findMany({ orderBy: { createdAt: "desc" }, take: 20 });
      const analysis = await analyzeTask(JSON.stringify(tasks));
      return NextResponse.json({ result: analysis });
    }
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "AI service error", result: t(req, 'ai.suggestError') }, { status: 500 });
  }
}
