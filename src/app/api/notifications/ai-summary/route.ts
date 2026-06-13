import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/mobile-auth";
import { generateText } from "@/lib/ai/provider";

export async function GET(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id;
  const userName = user.name || "عضو الجالية";

  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale") || req.cookies.get("NEXT_LOCALE")?.value || "ar";

  try {
    // 1. Fetch unread notifications
    const unread = await prisma.notification.findMany({
      where: { userId, read: false },
      orderBy: { createdAt: "desc" },
      take: 15,
    });

    if (unread.length === 0) {
      const emptyMessages: Record<string, string> = {
        ar: `مرحباً ${userName}، ليست لديك أي إشعارات غير مقروءة حالياً لتلخيصها. أنت مطلع على كل جديد! ✨`,
        nl: `Hallo ${userName}, u heeft momenteel geen ongelezen meldingen om samen te vatten. U bent helemaal bij! ✨`,
        en: `Hello ${userName}, you don't have any unread notifications to summarize right now. You are all caught up! ✨`,
      };
      return NextResponse.json({ summary: emptyMessages[locale] || emptyMessages.ar });
    }

    // 2. Prepare notifications for the AI prompt
    const notificationsText = unread
      .map((n: any, i: number) => `${i + 1}. [${n.title}] ${n.message || ""}`)
      .join("\n");


    const languageNames: Record<string, string> = {
      ar: "باللغة العربية الفصحى",
      nl: "in het Nederlands",
      en: "in English",
    };

    const systemPrompt = `أنت المساعد الذكي للجالية السورية في هولندا. مهمتك هي قراءة إشعارات المستخدم غير المقروءة وتلخيصها بأسلوب ودود ومبسط ومباشر.`;
    const userPrompt = `مرحباً، اسمي هو "${userName}". لقد فاتني حضور أو قراءة الإشعارات التالية:
${notificationsText}

يرجى كتابة ملخص ترحيبي دافئ وموجز جداً (فقرة واحدة فقط، لا تتجاوز 40-60 كلمة) ${languageNames[locale] || "باللغة العربية"}.
لخّص للمستخدم بذكاء واختصار شديد ما هي الفعاليات أو الأخبار الهامة التي عليه الانتباه إليها بناءً على القائمة أعلاه.
اكتب الفقرة الترحيبية والملخص مباشرةً دون مقدمات برمجية مثل "إليك الملخص:".`;

    // 3. Generate summary
    const summary = await generateText(userPrompt, systemPrompt);

    return NextResponse.json({ summary: summary || "حدث خطأ في صياغة الملخص." });
  } catch (error) {
    console.error("[API/notifications/ai-summary]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

