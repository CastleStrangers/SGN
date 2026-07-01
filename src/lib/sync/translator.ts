import { generateText } from "@/lib/ai/provider";
import type { ExtractedArticle } from "./types";

function cleanJsonResponse(response: string): string {
  let cleaned = response.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
  }
  return cleaned;
}

export async function translateArticle(article: ExtractedArticle): Promise<ExtractedArticle> {
  // Skip translation if the title already contains Arabic characters
  const isArabic = /[\u0600-\u06FF]/.test(article.title);
  if (isArabic) {
    return article;
  }

  try {
    const prompt = `Translate the following news article elements into professional, clear, and engaging Arabic suitable for a news platform catering to the Syrian community in the Netherlands.
You MUST output your response as a valid JSON object matching this schema:
{
  "title": "translated title as a brief, professional news headline",
  "excerpt": "translated summary/excerpt",
  "content": "translated article body, preserving ALL HTML tags, inline styles, links, image tags, and iframes exactly as they are"
}

Article to translate:
Title: ${article.title}
Excerpt: ${article.excerpt || ""}
Content: ${article.content}`;

    const response = await generateText(
      prompt,
      "You are a professional media translator specializing in translating Dutch and English news into high-quality, professional Arabic. You always respond with a raw JSON object only.",
      { responseFormat: "json" }
    );

    const cleaned = cleanJsonResponse(response);
    const parsed = JSON.parse(cleaned);

    if (parsed.title && parsed.content) {
      return {
        ...article,
        title: parsed.title.trim(),
        excerpt: parsed.excerpt?.trim() || article.excerpt,
        content: parsed.content.trim(),
      };
    }
  } catch (error) {
    console.error("AI translation failed for article:", article.title, error);
  }

  // Fallback to original article if translation fails
  return article;
}
