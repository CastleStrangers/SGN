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

async function generateTextWithRetry(
  prompt: string,
  systemPrompt: string,
  options: { responseFormat: string }
): Promise<string> {
  let retries = 3;
  let delayTime = 6000; // wait 6 seconds on first retry

  while (retries > 0) {
    try {
      // 4.5 seconds base delay between calls (guarantees max 13 RPM to stay under the 15 RPM limit)
      await new Promise((resolve) => setTimeout(resolve, 4500));
      return await generateText(prompt, systemPrompt, options);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      const isRateLimit = errMsg.includes("429") || errMsg.includes("rate limit") || errMsg.includes("Too many requests");
      
      if (isRateLimit && retries > 1) {
        console.warn(`\n[Sync AI API] Rate limit hit (429). Retrying in ${delayTime / 1000} seconds... (${retries - 1} retries left)`);
        await new Promise((resolve) => setTimeout(resolve, delayTime));
        retries--;
        delayTime *= 2; // exponential backoff
      } else {
        throw error;
      }
    }
  }
  throw new Error("Failed to generate text after multiple retries due to rate limits.");
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

    const response = await generateTextWithRetry(
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
    const response = await generateTextWithRetry(prompt, systemPrompt, { responseFormat: "json" });
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
