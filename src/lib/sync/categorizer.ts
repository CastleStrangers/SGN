import { CATEGORY_MAP, CATEGORY_KEYWORDS } from "./types"
import type { ExtractedArticle } from "./types"
import { generateText } from "@/lib/ai/provider"

export function categorizeByMapping(article: ExtractedArticle): string {
  const text = `${article.title} ${article.excerpt} ${article.tags.join(" ")}`

  const exactMatch = CATEGORY_MAP[article.category]
  if (exactMatch) return exactMatch

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        return category
      }
    }
  }

  for (const [original, mapped] of Object.entries(CATEGORY_MAP)) {
    if (text.includes(original)) {
      return mapped
    }
  }

  const tagMatch = article.tags.find((tag) => {
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      if (keywords.some((kw) => tag.toLowerCase().includes(kw.toLowerCase()))) {
        return true
      }
    }
    return false
  })
  if (tagMatch) {
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      if (keywords.some((kw) => tagMatch.toLowerCase().includes(kw.toLowerCase()))) {
        return category
      }
    }
  }

  return "أخبار الجالية"
}

export async function categorizeWithAI(article: ExtractedArticle): Promise<string> {
  const categories = Object.values(CATEGORY_MAP).filter(
    (v, i, a) => a.indexOf(v) === i
  )

  try {
    const suggested = await generateText(
      `العنوان: ${article.title}\nالمحتوى: ${article.excerpt}\nالوسوم: ${article.tags.join(", ")}`,
      `أنت مصنف أخبار. اختر التصنيف الأنسب من القائمة التالية:\n${categories.join("\n")}\nأجب فقط باسم التصنيف.`,
      { responseFormat: "text" }
    )
    const cleaned = suggested.replace(/[\.\n\r]/g, "").trim()
    if (categories.includes(cleaned)) return cleaned
  } catch {
    // fallback to keyword matching
  }
  return categorizeByMapping(article)
}
