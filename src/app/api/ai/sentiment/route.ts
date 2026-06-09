import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { analyzeSentiment } from "@/lib/ai/text";
import { prisma } from "@/lib/db";
import { getApiMessage } from "@/lib/api-messages";

function t(req: Request, key: string) {
  const locale = (req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
  return getApiMessage(locale, key);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { action, postId } = await req.json();

    if (action === "analyze-all") {
      const comments = await prisma.comment.findMany({
        where: { parentId: null },
        orderBy: { createdAt: "desc" },
        take: 100,
      });
      const formatted = comments.map((c: { author: string; content: string }) => ({ author: c.author || t(req, 'common.anonymous'), content: c.content }));
      const analysis = await analyzeSentiment(formatted);
      return NextResponse.json({ result: analysis, total: comments.length });
    }

    if (action === "analyze-post" && postId) {
      const comments = await prisma.comment.findMany({
        where: { postId, parentId: null },
        orderBy: { createdAt: "desc" },
        take: 50,
      });
      const formatted = comments.map((c: { author: string; content: string }) => ({ author: c.author || t(req, 'common.anonymous'), content: c.content }));
      const analysis = await analyzeSentiment(formatted);
      return NextResponse.json({ result: analysis, total: comments.length });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "AI error" }, { status: 500 });
  }
}
