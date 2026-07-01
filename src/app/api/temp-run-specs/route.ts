import { NextResponse } from "next/server";
import { generateText } from "@/lib/ai/provider";

export const dynamic = "force-dynamic";

export async function GET() {
  const article = {
    title: "Hello World",
    excerpt: "This is a test article",
    content: "<p>This is a test article content.</p>",
  };

  try {
    const prompt = `Translate the following news article elements into professional, clear, and engaging Arabic.
You MUST output your response as a valid JSON object matching this schema:
{
  "title": "translated title as a brief, professional news headline",
  "excerpt": "translated summary/excerpt",
  "content": "translated article body, preserving ALL HTML tags exactly"
}

Article to translate:
Title: ${article.title}
Excerpt: ${article.excerpt}
Content: ${article.content}`;

    const response = await generateText(
      prompt,
      "You are a professional media translator. You always respond with a raw JSON object only.",
      { responseFormat: "json" }
    );

    const result = { success: true, response };
    fs.writeFileSync(path.join(process.cwd(), "temp_test_out.json"), JSON.stringify(result, null, 2));
    return NextResponse.json(result);
  } catch (error: any) {
    const result = { success: false, error: error.message, stack: error.stack };
    fs.writeFileSync(path.join(process.cwd(), "temp_test_out.json"), JSON.stringify(result, null, 2));
    return NextResponse.json(result);
  }
}

import fs from "fs";
import path from "path";
