import { prisma } from "@/lib/db";

const STOP_WORDS = new Set([
  "ما", "هل", "كيف", "أين", "متى", "لماذا", "من", "إلى", "عن", "على", "في", "مع", "هل", "هذا",
  "هذه", "ذلك", "تلك", "كان", "كانت", "يكون", "يكون", "ليس", "إن", "أن", "قد", "لقد", "سوف",
  "سيتم", "يمكن", "يجب", "هو", "هي", "هم", "هن", "أنا", "نحن", "أنت", "أنتم", "أو", "و",
  "ثم", "أي", "كل", "بعض", "منذ", "حتى", "لا", "لم", "لن", "ما", "من", "اذا", "إذا",
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "shall", "can", "need", "dare", "ought",
  "used", "to", "of", "in", "for", "on", "with", "at", "by", "from",
  "as", "into", "through", "during", "before", "after", "above", "below",
  "between", "out", "off", "over", "under", "again", "further", "then",
  "once", "here", "there", "when", "where", "why", "how", "all", "each",
  "every", "both", "few", "more", "most", "other", "some", "such", "no",
  "nor", "not", "only", "own", "same", "so", "than", "too", "very",
  "de", "het", "een", "van", "en", "is", "zijn", "met", "op", "voor",
  "door", "aan", "in", "uit", "over", "na", "bij", "als", "maar", "om",
  "dat", "die", "dit", "ze", "zich", "we", "hij", "zij", "niet", "geen",
]);

function extractKeywords(text: string): string[] {
  const words = text.toLowerCase().split(/[\s,؟?.\-!]+/);
  return [...new Set(words.filter((w) => w.length > 2 && !STOP_WORDS.has(w)))];
}

function formatDate(d: Date, locale: string): string {
  try {
    return d.toLocaleDateString(locale === "ar" ? "ar-SA" : locale === "nl" ? "nl-NL" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return d.toISOString().split("T")[0];
  }
}

function buildKeywordOR(keywords: string[], fields: string[]) {
  return keywords.map((kw) => ({
    OR: fields.map((f) => ({ [f]: { contains: kw } })),
  }));
}

export async function buildRAGContext(question: string, locale: string): Promise<string> {
  const keywords = extractKeywords(question);
  if (keywords.length === 0) return "";

  const parts: string[] = [];

  // Search guides (Guide)
  const guides = await prisma.guide.findMany({
    where: {
      OR: buildKeywordOR(keywords, ["titleAr", "titleNl", "titleEn", "contentAr", "contentNl", "contentEn", "tags"]),
    },
    take: 5,
    select: { titleAr: true, titleNl: true, titleEn: true, contentAr: true, contentNl: true, contentEn: true, category: true },
  });

  if (guides.length > 0) {
    parts.push("=== أدلة الاندماج والتعليمات ===");
    for (const g of guides) {
      const title = locale === "ar" ? g.titleAr : locale === "nl" ? g.titleNl : g.titleEn;
      const content = locale === "ar" ? g.contentAr : locale === "nl" ? g.contentNl : g.contentEn;
      parts.push(`- ${title} (التصنيف: ${g.category}): ${content.slice(0, 300)}...`);
    }
  }

  // Search news (Post)
  const news = await prisma.post.findMany({
    where: {
      published: true,
      OR: buildKeywordOR(keywords, ["title", "excerpt", "content", "tags"]),
    },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { title: true, excerpt: true, category: true, createdAt: true },
  });

  if (news.length > 0) {
    parts.push("=== أخبار الجالية ===");
    for (const n of news) {
      parts.push(`- ${n.title}${n.excerpt ? `: ${n.excerpt}` : ""} (${n.category} - ${formatDate(n.createdAt, locale)})`);
    }
  }

  const events = await prisma.event.findMany({
    where: {
      published: true,
      date: { gte: new Date() },
      OR: buildKeywordOR(keywords, ["title", "description"]),
    },
    orderBy: { date: "asc" },
    take: 5,
    select: { title: true, description: true, date: true, location: true },
  });

  if (events.length > 0) {
    parts.push("=== الفعاليات القادمة ===");
    for (const e of events) {
      parts.push(`- ${e.title}${e.description ? `: ${e.description}` : ""} (${formatDate(e.date, locale)}${e.location ? `, ${e.location}` : ""})`);
    }
  }

  const volunteers = await prisma.volunteer.findMany({
    where: { OR: buildKeywordOR(keywords, ["name", "skills", "message"]) },
    take: 5,
    select: { name: true, skills: true },
  });

  if (volunteers.length > 0) {
    parts.push("=== المتطوعون ===");
    for (const v of volunteers) {
      parts.push(`- ${v.name}${v.skills ? ` (مهارات: ${v.skills})` : ""}`);
    }
  }

  const members = await prisma.member.findMany({
    where: {
      showInPublicProfile: true,
      OR: buildKeywordOR(keywords, ["nameAr", "nameNl", "profession", "skills", "nlCity", "originCity"]),
    },
    take: 5,
    select: { nameAr: true, nameNl: true, profession: true, skills: true, nlCity: true, isServiceProvider: true, serviceDescription: true },
  });

  if (members.length > 0) {
    parts.push("=== الأعضاء ومزودو الخدمات ===");
    for (const m of members) {
      const name = `${m.nameAr} / ${m.nameNl}`;
      const info = [m.profession, m.skills, m.nlCity].filter(Boolean).join("، ");
      const service = (m as any).isServiceProvider ? ` [يقدم خدمة: ${(m as any).serviceDescription}]` : "";
      parts.push(`- ${name}${info ? ` (${info})` : ""}${service}`);
    }
  }

  const tasks = await prisma.task.findMany({
    where: { OR: buildKeywordOR(keywords, ["title", "description"]) },
    take: 5,
    select: { title: true, description: true, status: true, priority: true },
  });

  if (tasks.length > 0) {
    parts.push("=== المهام ===");
    for (const t of tasks) {
      parts.push(`- ${t.title}${t.description ? `: ${t.description}` : ""} [${t.status}، أولوية: ${t.priority}]`);
    }
  }

  // Search board members (BoardMember)
  const board = await prisma.boardMember.findMany({
    where: {
      OR: buildKeywordOR(keywords, ["nameAr", "nameEn", "titleAr", "titleEn", "committees", "bioPoints"]),
    },
    take: 5,
  });

  if (board.length > 0) {
    parts.push("=== أعضاء مجلس الإدارة وفريق العمل ===");
    for (const b of board) {
      const name = locale === "ar" ? b.nameAr : b.nameEn;
      const title = locale === "ar" ? b.titleAr : b.titleEn;
      parts.push(`- ${name} (${title})${b.isFounder ? " [عضو مؤسس]" : ""}: اللجان: ${b.committees}`);
    }
  }

  return parts.join("\n");
}
