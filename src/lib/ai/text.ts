import { generateText } from "./provider";

export async function generateSummary(title: string, content: string, locale: string): Promise<string> {
  const lang = locale === "ar" ? "العربية" : locale === "nl" ? "الهولندية" : "الإنجليزية";
  return generateText(
    `العنوان: ${title}\n\nالمحتوى: ${content}`,
    `لخص المقال التالي باللغة ${lang} في 2-3 جمل قصيرة.`,
  );
}

export async function translateContent(content: string, from: string, to: string): Promise<string> {
  const langMap: Record<string, string> = { ar: "العربية", nl: "الهولندية", en: "الإنجليزية" };
  const sourceLang = langMap[from] || from;
  const targetLang = langMap[to] || to;
  return generateText(
    content,
    `ترجم النص التالي من ${sourceLang} إلى ${targetLang}. حافظ على التنسيق والعلامات HTML إن وجدت.`,
  );
}

export async function summarizeConversation(messages: { role: string; content: string }[], locale: string): Promise<string> {
  const lang = locale === "ar" ? "العربية" : locale === "nl" ? "الهولندية" : "الإنجليزية";
  const text = messages.map((m) => `${m.role === "user" ? "المستخدم" : "المساعد"}: ${m.content}`).join("\n");
  return generateText(
    text || "لا توجد محادثة",
    `لخص المحادثة التالية باللغة ${lang} في 3-5 جمل. ركز على المواضيع الرئيسية والاستنتاجات المهمة.`,
  );
}

export async function analyzeSentiment(comments: { author: string; content: string }[]): Promise<string> {
  const text = comments.map(c => `${c.author}: ${c.content}`).join("\n");
  return generateText(
    text || "لا توجد تعليقات",
    "قم بتحليل المشاعر للتعليقات التالية بالعربية. صنفها إلى: إيجابي، سلبي، محايد. قدم إحصائيات لكل فئة وذكر أبرز المواضيع المطروحة.",
  );
}
