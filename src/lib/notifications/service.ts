import { prisma } from "@/lib/db";
import { generateText } from "@/lib/ai/provider";
import { sendPushNotifications } from "./push";

interface SystemNotificationParams {
  type: "event" | "post" | "survey";
  title: string;
  descriptionOrContent?: string;
  link: string;
}

interface AICreatedContent {
  title: string;
  message: string;
}

export async function createSystemNotification({
  type,
  title,
  descriptionOrContent = "",
  link,
}: SystemNotificationParams) {
  let finalTitle = title;
  let finalMessage = "";

  // 1. Fallback defaults depending on type
  if (type === "event") {
    finalTitle = "فعالية جديدة قادمة!";
    finalMessage = title;
  } else if (type === "post") {
    finalTitle = "خبر جديد من الجالية";
    finalMessage = title;
  } else if (type === "survey") {
    finalTitle = "استبيان رأي جديد مشارك";
    finalMessage = title;
  }

  // 2. Try to generate engaging title and body using local AI
  try {
    const typeNames = {
      event: "فعالية جديدة",
      post: "خبر هام",
      survey: "استبيان رأي",
    };

    const prompt = `أنت مسؤول التواصل لجالية "السوريين في هولندا". اكتب عنواناً قصيراً ومثيراً للاهتمام (من 3 إلى 6 كلمات) ووصفاً جذاباً (من 10 إلى 15 كلمة) باللغة العربية للإشعار الخاص بـ [${typeNames[type]}] التالي:
العنوان الأصلي: "${title}"
التفاصيل: "${descriptionOrContent.slice(0, 300)}"

يجب عليك إرجاع الإجابة بصيغة JSON صالحة حصراً كالتالي:
{
  "title": "العنوان المثير للاهتمام هنا",
  "message": "نص الإشعار الجذاب هنا"
}`;

    const aiResponse = await generateText(prompt, "أنت نظام آلي يُرجع فقط كود JSON صالح.", {
      responseFormat: "json",
    });

    if (aiResponse) {
      const parsed: AICreatedContent = JSON.parse(aiResponse.trim());
      if (parsed.title && parsed.message) {
        finalTitle = parsed.title;
        finalMessage = parsed.message;
      }
    }
  } catch (err) {
    console.warn("AI notification generation failed, using fallback:", err);
  }

  try {
    // 3. Find all users in the system to deliver database notification
    const users = await prisma.user.findMany({
      select: { id: true },
    });

    if (users.length > 0) {
      await prisma.notification.createMany({
        data: users.map((u: { id: string }) => ({
          userId: u.id,
          title: finalTitle,
          message: finalMessage,
          link,
          read: false,
        })),
      });
    }

    // 4. Trigger Expo push notifications for all user devices
    await sendPushNotifications({
      title: finalTitle,
      body: finalMessage,
      data: { link },
    });

    console.log(`Successfully dispatched AI-powered system notification: "${finalTitle}" to ${users.length} users.`);
  } catch (dbErr) {
    console.error("Failed to save or broadcast system notification:", dbErr);
  }
}
