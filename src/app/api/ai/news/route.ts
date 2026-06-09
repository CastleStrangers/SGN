import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateSummary, translateContent } from "@/lib/ai/text";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { action, postId, from, to, content } = await req.json();

    if (action === "summarize") {
      const post = await prisma.post.findUnique({ where: { id: postId } });
      if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
      const summary = await generateSummary(post.title, post.content, from || "ar");
      if (post.excerpt !== summary) {
        await prisma.post.update({ where: { id: post.id }, data: { excerpt: summary } });
      }
      return NextResponse.json({ result: summary });
    }

    if (action === "translate") {
      const translated = await translateContent(content, from || "ar", to || "nl");
      return NextResponse.json({ result: translated });
    }

    if (action === "batch-summarize") {
      const posts = await prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      });
      const results: { id: string; title: string; summary: string }[] = [];
      for (const post of posts) {
        const summary = await generateSummary(post.title, post.content, "ar");
        results.push({ id: post.id, title: post.title, summary });
        await prisma.post.update({ where: { id: post.id }, data: { excerpt: summary } });
      }
      return NextResponse.json({ results });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "AI error" }, { status: 500 });
  }
}
