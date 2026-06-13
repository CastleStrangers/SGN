import { prisma } from "@/lib/db";
import { buildRAGContext } from "./rag";
import { generateChat } from "./provider";

const MAX_HISTORY = 20;

function buildSystemPrompt(locale: string, userName: string, persona: string, ragContext?: string): string {
  const lang = locale === "ar" ? "بالعربية" : locale === "nl" ? "in het Nederlands" : "in English";

  let basePrompt = `أنت مساعد ذكي للجالية السورية في هولندا (Syrian Community in the Netherlands). اسم المستخدم الذي تتحدث معه هو "${userName}".

تعليمات عامة:
1. تحدث ${lang} دائماً.
2. كن ودوداً ومحترماً ومفيداً.
3. إذا سألك عن شيء لا تعرفه، قل بصراحة أنك لا تعرف ولا تخترع معلومات.
4. استخدم لغة واضحة ومبسطة تتناسب مع اللاجئين والمغتربين الجدد.
5. نوّه دائماً بلطف في الإجابات الطبية أو القانونية الحساسة بأنك مساعد ذكي تقدم استشارات إرشادية وتدعم الرجوع للمصادر الرسمية أو المختصين.`;

  let personaPrompt = "";
  if (persona === "legal") {
    personaPrompt = `
أنت الآن تلعب دور "المستشار القانوني وإجراءات اللجوء". تخصصك هو:
- إجراءات اللجوء في هولندا، خطوات الـ IND، ومراكز الإيواء (COA).
- لم شمل العائلات (Gezinshereniging) والمستندات المطلوبة والمدد الزمنية المتوقعة.
- حقوق اللاجئين، الإقامات المؤقتة والدائمة، والجنسية الهولندية.
- يرجى توجيه المستخدم دائماً للهيئات الرسمية مثل VluchtelingenWerk أو المحامي الخاص به للتأكيدات القانونية الرسمية.`;
  } else if (persona === "integration") {
    personaPrompt = `
أنت الآن تلعب دور "مرشد الاندماج واللغة". تخصصك هو:
- امتحانات الاندماج (Inburgering) ومستويات اللغة المطلوبة (A2 / B1).
- البحث عن مدارس الأطفال والجامعات وتقييم الشهادات السورية (IDW).
- الحصول على السكن البلدي (Sociale huurwoning) وعقود الإيجار وحقوق المستأجرين.
- كتابة السيرة الذاتية (CV) على الطريقة الهولندية، البحث عن عمل، والمساعدات المالية (Bijstanduitkering).`;
  } else if (persona === "spokesperson") {
    personaPrompt = `
أنت الآن تلعب دور "الناطق الإعلامي للجالية". تخصصك هو:
- الإجابة عن آخر أخبار الجالية السورية والنشاطات الاجتماعية والثقافية في هولندا.
- توفير تفاصيل ومواعيد الفعاليات القادمة والمسجلة في الموقع.
- كيفية التطوع والمساهمة في المبادرات الإنسانية والمشاريع المتاحة للجالية.
- تشجيع التفاعل والمشاركة الإيجابية بين الأعضاء.`;
  } else {
    personaPrompt = `
أنت الآن تلعب دور "المساعد العام للجالية". تخصصك هو:
- الإجابة عن كافة الاستفسارات العامة المتعلقة بالحياة اليومية في هولندا والجالية السورية.
- توفير معلومات عامة عن الخدمات والفعاليات والأخبار والتطوع في الموقع.`;
  }

  let prompt = basePrompt + "\n" + personaPrompt;

  if (ragContext) {
    prompt += `\n\nإليك معلومات حديثة ومستندات من قاعدة بيانات الموقع قد تساعدك في الرد الدقيق:\n${ragContext}\n\nيرجى استخدام هذه المعلومات بشكل أساسي وموثوق عند الإجابة عن الأسئلة المرتبطة بها وتجنب الهلوسة.`;
  }

  return prompt;
}

export async function getOrCreateSession(userId: string, persona?: string): Promise<string> {
  const existing = await prisma.chatAISession.findFirst({
    where: { userId, persona: persona || "general" },
    orderBy: { updatedAt: "desc" },
  });
  if (existing) return existing.id;

  const session = await prisma.chatAISession.create({
    data: { userId, persona: persona || "general" },
  });
  return session.id;
}

export async function sendAIMessage(
  sessionId: string,
  userId: string,
  content: string,
  locale: string,
  userName: string,
  personaOverride?: string
): Promise<string> {
  await prisma.chatAIMessage.create({
    data: { sessionId, role: "user", content },
  });

  const sessionObj = await prisma.chatAISession.findUnique({
    where: { id: sessionId },
    select: { persona: true }
  });
  const persona = personaOverride || sessionObj?.persona || "general";

  if (personaOverride && sessionObj && sessionObj.persona !== personaOverride) {
    await prisma.chatAISession.update({
      where: { id: sessionId },
      data: { persona: personaOverride }
    });
  }

  const history = await prisma.chatAIMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: "asc" },
    take: MAX_HISTORY,
  });

  const ragContext = await buildRAGContext(content, locale);
  const systemPrompt = buildSystemPrompt(locale, userName, persona, ragContext || undefined);

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
