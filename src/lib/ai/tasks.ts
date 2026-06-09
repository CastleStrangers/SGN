import { ai, AI_MODEL_FAST } from "./client";

export async function generateTaskSuggestion(prompt: string): Promise<string> {
  const res = await ai.chat.completions.create({
    model: AI_MODEL_FAST,
    messages: [
      { role: "system", content: "أنت مساعد مهام ذكي للجالية السورية في هولندا. اقترح مهاماً بناءً على طلب المستخدم بالعربية." },
      { role: "user", content: prompt },
    ],
    max_tokens: 200,
  });
  return res.choices[0]?.message?.content || "لم أتمكن من إنشاء اقتراح";
}

export async function analyzeTask(tasksJson: string): Promise<string> {
  const res = await ai.chat.completions.create({
    model: AI_MODEL_FAST,
    messages: [
      { role: "system", content: "حلل المهام التالية بالعربية وقدم توصيات ذكية للأولويات والإنجاز." },
      { role: "user", content: tasksJson },
    ],
    max_tokens: 300,
  });
  return res.choices[0]?.message?.content || "لا يوجد تحليل متاح";
}
