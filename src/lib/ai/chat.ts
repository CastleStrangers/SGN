import { prisma } from "@/lib/db";
import { buildRAGContext } from "./rag";
import { generateChat } from "./provider";

const MAX_HISTORY = 20;

function buildSystemPrompt(locale: string, userName: string, ragContext?: string): string {
  const lang = locale === "ar" ? "بالعربية" : locale === "nl" ? "in het Nederlands" : "in English";

  let prompt = `أنت مساعد ذكي للجالية السورية في هولندا (Syrian Community in the Netherlands). اسم المستخدم الذي تتحدث معه هو "${userName}".

تعليمات مهمة:
1. تحدث ${lang} دائماً.
2. كن ودوداً ومحترماً ومفيداً.
3. إذا سألك عن شيء لا تعرفه، قل بصراحة أنك لا تعرف ولا تخترع معلومات.
4. يمكنك مساعدته في:
   - أخبار الجالية السورية في هولندا
   - معلومات عن الفعاليات والمناسبات
   - الخدمات المتاحة (ترجمة، استشارات، دعم)
   - التطوع والمساهمة
   - الإجراءات الإدارية في هولندا
   - الثقافة والتراث السوري
   - أي استفسارات عامة عن الحياة في هولندا
5. قدم إجابات مفصلة عند الحاجة وموجزة عند الإمكان.
6. استخدم المصادر الرسمية عند ذكر معلومات قانونية أو إدارية.`;

  if (ragContext) {
    prompt += `\n\nإليك معلومات حديثة من قاعدة البيانات قد تساعدك في الرد:\n${ragContext}\n\nاستخدم هذه المعلومات عند الإجابة عن الأسئلة المتعلقة بها. إذا كان السؤال لا يتعلق بها، تجاهلها.`;
  }

  return prompt;
}

export async function getOrCreateSession(userId: string): Promise<string> {
  const existing = await prisma.chatAISession.findFirst({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
  if (existing) return existing.id;

  const session = await prisma.chatAISession.create({ data: { userId } });
  return session.id;
}

export async function sendAIMessage(
  sessionId: string,
  userId: string,
  content: string,
  locale: string,
  userName: string
): Promise<string> {
  await prisma.chatAIMessage.create({
    data: { sessionId, role: "user", content },
  });

  const history = await prisma.chatAIMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: "asc" },
    take: MAX_HISTORY,
  });

  const ragContext = await buildRAGContext(content, locale);
  const systemPrompt = buildSystemPrompt(locale, userName, ragContext || undefined);

  const conversationParts = history.map((m: { role: string; content: string }) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  const reply = await generateChat(conversationParts, systemPrompt);

  if (!reply) throw new Error("AI response empty");

  await prisma.chatAIMessage.create({
    data: { sessionId, role: "assistant", content: reply },
  });

  return reply;
}
