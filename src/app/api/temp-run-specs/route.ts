import { NextResponse } from "next/server";
import { translateArticle } from "@/lib/sync/translator";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const article = {
      title: "Hello World",
      excerpt: "This is a test article",
      content: "<p>This is a test article content.</p>",
      category: "test",
      tags: [],
      source: "test",
      sourceUrl: "https://test.com",
      author: "test",
      publishedAt: new Date(),
      mediaUrls: [],
      iframes: [],
    };
    const translated = await translateArticle(article);
    return NextResponse.json({ translated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, stack: error.stack });
  }
}
