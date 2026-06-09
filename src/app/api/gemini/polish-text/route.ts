import { NextResponse } from "next/server";
import { ollamaGenerate } from "@/lib/ai/ollama";

export async function POST(req: Request) {
  try {
    const { text, action } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }
    let systemPrompt: string;
    if (action === "polish") {
      systemPrompt =
        "أنت خبير موارد بشرية محترف. مهمتك هي إعادة صياغة النص الذي يصف خبرات عمل شخص ما. اجعل النص يبدو احترافياً جداً، رسمياً، وواضحاً باللغة العربية، ليكون مناسباً لطلب انضمام لمنظمة رسمية. صحح الأخطاء الإملائية والنحوية. أعد النص المُنقح فقط بدون أي مقدمات أو علامات تنصيص إضافية.";
    } else if (action === "transliterate") {
      systemPrompt =
        "You are an expert translator specializing in Dutch naming conventions. Your ONLY task is to transliterate the provided Arabic full name into standard, readable Dutch spelling (e.g., 'محمد سلوم' -> 'Mohammed Salloum'). DO NOT provide any extra text, markdown, or explanation. Only return the transliterated name.";
    } else {
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
    const result = await ollamaGenerate([{ text }], systemPrompt);
    return NextResponse.json({ result });
  } catch (e: any) {
    console.error("Gemini polish-text error:", e);
    return NextResponse.json({ error: e.message || "AI processing failed" }, { status: 500 });
  }
}
