import { NextResponse } from "next/server";
import { translateArticle } from "@/lib/sync/translator";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  const originalProvider = process.env.AI_PROVIDER;
  process.env.AI_PROVIDER = "openai";

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
    const result = { success: true, provider: process.env.AI_PROVIDER, translated };
    fs.writeFileSync(path.join(process.cwd(), "temp_test_out.json"), JSON.stringify(result, null, 2));
    process.env.AI_PROVIDER = originalProvider;
    return NextResponse.json(result);
  } catch (error: any) {
    const result = { success: false, error: error.message, stack: error.stack };
    fs.writeFileSync(path.join(process.cwd(), "temp_test_out.json"), JSON.stringify(result, null, 2));
    process.env.AI_PROVIDER = originalProvider;
    return NextResponse.json(result);
  }
}
