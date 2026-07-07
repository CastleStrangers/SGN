import { prisma } from "@/lib/db";
import { buildRAGContext } from "./rag";
import { generateChat } from "./provider";

const MAX_HISTORY = 20;

function buildSystemPrompt(locale: string, userName: string, persona: string, ragContext?: string): string {
  const lang = locale === "ar" ? "بالعربية" : locale === "nl" ? "in het Nederlands" : "in English";

  let basePrompt = `أنت مساعد ذكي للجالية السورية في هولندا (Syrian Community in the Netherlands). اسم المستخدم الذي تتحدث معه هو "${userName}".

تعليمات عامة:
1. تحدث ${lang} دائماً بلهجة سورية محببة وممزوجة بالعربية الفصحى البسيطة عند الحاجة.
2. كن ودوداً ومحترماً ومفيداً جداً. أنت تمثل الجالية.
3. إذا سألك عن شيء لا تعرفه، قل بصراحة أنك لا تعرف ولا تخترع معلومات، لكن حاول توجيهه لأقرب قسم في الموقع (مثل الأخبار أو دليل الخدمات).
4. استخدم لغة واضحة ومبسطة تتناسب مع اللاجئين والمغتربين الجدد.
5. نوّه دائماً بلطف في الإجابات الطبية أو القانونية الحساسة بأنك مساعد ذكي تقدم استشارات إرشادية وتدعم الرجوع للمصادر الرسمية أو المختصين.
6. إذا كانت المعلومة موجودة في "معلومات حديثة من قاعدة البيانات"، اعتمد عليها كأولوية قصوى.`;

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
  } else if (persona === "employment") {
    personaPrompt = `
أنت الآن تلعب دور "مستشار التوظيف والسكن الاجتماعي". تخصصك هو:
- كيفية البحث عن عمل في هولندا (Uitzendbureau, LinkedIn) وكتابة CV بالمعايير الهولندية.
- شرح الـ Bijstand والمستحقات والالتزامات المتعلقة بها.
- إجراءات التقديم على سكن اجتماعي (Sociale huurwoning) والمواقع مثل WoningNet أو الفستات.
- التقديم على إعانات السكن (Huurtoeslag) والتأمين الصحي (Zorgtoeslag).`;
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
): Promise<{ reply: string; sources: { title: string; type: string }[] }> {
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

  const ragResult = await buildRAGContext(content, locale);
  const systemPrompt = buildSystemPrompt(locale, userName, persona, ragResult.context || undefined);

  const conversationParts = history.map((m: { role: string; content: string }) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  const reply = await generateChat(conversationParts, systemPrompt);

  if (!reply) throw new Error("AI response empty");

  await prisma.chatAIMessage.create({
    data: { sessionId, role: "assistant", content: reply },
  });

  return { reply, sources: ragResult.sources };
}

const LETTER_ANALYSIS_PROMPT = `أنت خبير محترف ومترجم قانوني هولندي-عربي. مهمتك هي تحليل صور الخطابات والوثائق الرسمية المرسلة من الدوائر الحكومية الهولندية (مثل IND, Belastingdienst, Gemeente, UWV, CAK) وتفسيرها للاجئين السوريين باللغة العربية.

يرجى استخراج وتوضيح المعلومات التالية بدقة واختصار:
1. **الجهة المرسلة (Sender):** من هي المؤسسة التي أرسلت الخطاب؟
2. **الموضوع العام (Subject):** ما هو موضوع الخطاب باختصار؟
3. **الملخص (Summary):** تلخيص مبسط للنقاط الأساسية في الخطاب.
4. **الإجراء المطلوب (Action Required):** ما الذي يجب على المستخدم فعله بدقة؟ (مثال: دفع مبلغ، إرسال وثيقة، حضور مقابلة).
5. **الموعد النهائي (Deadline):** ما هو آخر موعد للإجراء؟ (حدده بشكل بارز باليوم والتاريخ والشارح إذا وجد).
6. **الخطوات التالية المقترحة (Next Steps):** كيف يجب أن يتصرف؟

تنبيه مهم: تحدّث بالعربية الفصحى البسيطة والمهنية، وحافظ على تنسيق جميل ونقاط واضحة.`;

async function imageUrlToBase64(url: string): Promise<{ mimeType: string; data: string }> {
  if (url.startsWith("data:")) {
    const match = url.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      return { mimeType: match[1], data: match[2] };
    }
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch image");
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const mimeType = res.headers.get("content-type") || "image/jpeg";
  const data = buffer.toString("base64");
  return { mimeType, data };
}

export async function analyzeDocument(imageUrl: string, locale: string): Promise<string> {
  const systemPrompt = LETTER_ANALYSIS_PROMPT;
  const userPrompt = locale === "nl"
    ? "Analyseer deze brief en leg het uit."
    : locale === "en"
      ? "Analyze this letter and explain it."
      : "من فضلك قم بتحليل وقراءة هذه الرسالة وشرح الإجراءات المطلوبة مني.";

  const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";
  const provider = process.env.AI_PROVIDER || (isProd ? (process.env.ANTHROPIC_API_KEY ? "anthropic" : "openai") : "ollama");

  if (provider === "anthropic") {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const baseUrl = process.env.ANTHROPIC_BASE_URL || "https://api.anthropic.com/v1/messages";
    const customHeadersRaw = process.env.ANTHROPIC_CUSTOM_HEADERS || "";
    const { mimeType, data } = await imageUrlToBase64(imageUrl);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01",
    };
    if (apiKey) headers["x-api-key"] = apiKey;
    if (customHeadersRaw) {
      const parts = customHeadersRaw.split(":");
      if (parts.length >= 2) headers[parts[0].trim()] = parts.slice(1).join(":").trim();
    }

    const res = await fetch(baseUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: process.env.ANTHROPIC_VISION_MODEL || "claude-3-5-sonnet-20240620",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: userPrompt },
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: mimeType,
                  data: data,
                },
              },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text().catch(() => "");
      throw new Error(`Anthropic vision error ${res.status}: ${err}`);
    }

    const dataRes = await res.json();
    return dataRes.content[0]?.text || "";
  }

  if (provider === "groq") {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("GROQ_API_KEY is required for Groq provider");

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_VISION_MODEL || "llama-3.2-11b-vision-preview",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: userPrompt },
              { type: "image_url", image_url: { url: imageUrl } }
            ]
          }
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text().catch(() => "");
      throw new Error(`Groq vision error ${res.status}: ${err}`);
    }

    const data = await res.json();
    return data.choices[0]?.message?.content || "";
  }

  if (provider === "openai") {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY is required for OpenAI provider");

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: userPrompt },
              { type: "image_url", image_url: { url: imageUrl } }
            ]
          }
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text().catch(() => "");
      throw new Error(`OpenAI vision error ${res.status}: ${err}`);
    }

    const data = await res.json();
    return data.choices[0]?.message?.content || "";
  } else {
    const { ollamaGenerate } = await import("./ollama");
    const { mimeType, data } = await imageUrlToBase64(imageUrl);
    return ollamaGenerate(
      [
        { text: userPrompt },
        { inlineData: { mimeType, data } }
      ],
      systemPrompt
    );
  }
}

