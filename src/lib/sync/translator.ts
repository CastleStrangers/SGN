import { generateText } from "@/lib/ai/provider";
import type { ExtractedArticle } from "./types";

function cleanJsonResponse(response: string): string {
  let cleaned = response.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
  }
  return cleaned;
}

function detectLanguage(article: ExtractedArticle): "ar" | "nl" | "en" {
  if (/[\u0600-\u06FF]/.test(article.title)) {
    return "ar";
  }
  const url = (article.sourceUrl || "").toLowerCase();
  const sourceName = (article.source || "").toLowerCase();
  if (url.includes("nos.nl") || url.includes("netherlands") || sourceName.includes("nos")) {
    return "nl";
  }
  return "en";
}

export async function translateArticle(article: ExtractedArticle): Promise<ExtractedArticle> {
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

    // 3-second delay to respect GitHub Models API rate limit (15 RPM)
    await new Promise((resolve) => setTimeout(resolve, 3000));

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

  return article;
}

export async function translateArticleToLocale(
  article: ExtractedArticle,
  targetLocale: string
): Promise<ExtractedArticle> {
  const sourceLang = detectLanguage(article);
  if (sourceLang === targetLocale) {
    return article;
  }

  if (targetLocale === "ar") {
    return translateArticle(article);
  }

  let prompt = "";
  let systemPrompt = "";

  if (targetLocale === "nl") {
    prompt = `Translate the following news article elements into professional and clear Dutch.
You MUST output your response as a valid JSON object matching this schema:
{
  "title": "translated title in Dutch",
  "excerpt": "translated summary/excerpt in Dutch",
  "content": "translated article body in Dutch, preserving ALL HTML tags, inline styles, links, image tags, and iframes exactly as they are"
}

Article to translate:
Title: ${article.title}
Excerpt: ${article.excerpt || ""}
Content: ${article.content}`;

    systemPrompt = "You are a professional translator specializing in translating news into high-quality, professional Dutch. You always respond with a raw JSON object only.";
  } else if (targetLocale === "en") {
    prompt = `Translate the following news article elements into professional and clear English.
You MUST output your response as a valid JSON object matching this schema:
{
  "title": "translated title in English",
  "excerpt": "translated summary/excerpt in English",
  "content": "translated article body in English, preserving ALL HTML tags, inline styles, links, image tags, and iframes exactly as they are"
}

Article to translate:
Title: ${article.title}
Excerpt: ${article.excerpt || ""}
Content: ${article.content}`;

    systemPrompt = "You are a professional translator specializing in translating news into high-quality, professional English. You always respond with a raw JSON object only.";
  }

  try {
    // 3-second delay to respect GitHub Models API rate limit (15 RPM)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const response = await generateText(prompt, systemPrompt, { responseFormat: "json" });
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
    console.error(`AI translation failed to ${targetLocale} for article:`, article.title, error);
  }

  return article;
}
