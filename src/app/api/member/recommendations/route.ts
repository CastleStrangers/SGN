import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/mobile-auth";
import { generateChat } from "@/lib/ai/provider";

export async function GET(req: Request) {
  const user = await getSessionUser(req);
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const member = await prisma.member.findUnique({
    where: { userId: user.id },
    select: {
      skills: true,
      profession: true,
      expNl: true,
      expOutside: true,
      educationLevel: true,
    }
  });

  if (!member) {
    return NextResponse.json({ tasks: [] });
  }

  // Fetch pending/open tasks
  const tasks = await prisma.task.findMany({
    where: { status: "pending" },
    take: 10,
    select: {
      id: true,
      title: true,
      description: true,
      priority: true,
      city: true,
    }
  });

  if (tasks.length === 0) {
    return NextResponse.json({ tasks: [] });
  }

  // Use AI to rank/match tasks
  const systemPrompt = `أنت خبير في الموارد البشرية والعمل التطوعي.
مهمتك هي مطابقة مهارات العضو مع المهام التطوعية المتاحة.
أجب فقط بتنسيق JSON يحتوي على قائمة IDs للمهام المرشحة مرتبة حسب الأهمية والمناسبة للعضو.
مثال: {"recommendedIds": ["id1", "id2"], "reasoning": "سبب الترشيح باختصار"}`;

  const userPrompt = `
مهارات العضو: ${member.skills || "غير محدد"}
المهنة: ${member.profession || "غير محدد"}
الخبرة: ${member.expNl || ""} ${member.expOutside || ""}
التعليم: ${member.educationLevel || ""}

المهام المتاحة:
${tasks.map(t => `ID: ${t.id} | العنوان: ${t.title} | الوصف: ${t.description}`).join("\n")}
  `;

  try {
    const aiResponse = await generateChat(
      [{ role: "user", content: userPrompt }],
      systemPrompt,
      { responseFormat: "json" }
    );

    const parsed = typeof aiResponse === 'string' ? JSON.parse(aiResponse) : aiResponse;
    const recommendedIds = parsed.recommendedIds || [];

    const recommendedTasks = tasks
      .filter(t => recommendedIds.includes(t.id))
      .map(t => ({
        ...t,
        matchReason: parsed.reasoning || ""
      }));

    return NextResponse.json({ tasks: recommendedTasks });
  } catch (e) {
    console.error("Task recommendation AI error:", e);
    // Fallback: return first 3 tasks
    return NextResponse.json({ tasks: tasks.slice(0, 3) });
  }
}
