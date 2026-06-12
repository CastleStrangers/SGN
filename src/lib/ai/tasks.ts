import { generateText } from "./provider";

export async function generateTaskSuggestion(prompt: string): Promise<string> {
  return generateText(
    prompt,
    "أنت مساعد مهام ذكي للجالية السورية في هولندا. اقترح مهاماً بناءً على طلب المستخدم بالعربية.",
    { responseFormat: "text" }
  );
}

export async function analyzeTask(tasksJson: string): Promise<string> {
  return generateText(
    tasksJson,
    "حلل المهام التالية بالعربية وقدم توصيات ذكية للأولويات والإنجاز.",
    { responseFormat: "text" }
  );
}