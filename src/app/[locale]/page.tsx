import { prisma } from "@/lib/db";
import { HomePageClient } from "./home-page-client";
import { isPureLocaleText, localizeCategory } from "@/lib/language-guard";

export const revalidate = 60;

const LIST_SELECT = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  image: true,
  videoId: true,
  category: true,
  source: true,
  featured: true,
  views: true,
  createdAt: true,
  author: { select: { name: true } },
} as const;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  let posts: any[] = [];
  let videoPosts: any[] = [];

  try {
    const [rawPosts, rawVideoPosts] = await Promise.all([
      prisma.post.findMany({
        where: { published: true, locale },
        orderBy: { createdAt: "desc" },
        take: 100,
        select: LIST_SELECT,
      }),
      prisma.post.findMany({
        where: { published: true, source: "youtube", locale },
        orderBy: { createdAt: "desc" },
        take: 20,
        select: LIST_SELECT,
      }),
    ]);

    // Enforce strict language isolation: Arabic must have Arabic chars, En/Nl must NOT
    posts = rawPosts
      .filter((p) => isPureLocaleText(p.title, locale))
      .map((p) => ({ ...p, category: localizeCategory(p.category, locale) }))
      .slice(0, 20);

    videoPosts = rawVideoPosts
      .filter((p) => isPureLocaleText(p.title, locale))
      .map((p) => ({ ...p, category: localizeCategory(p.category, locale) }))
      .slice(0, 6);
  } catch (e) {
    console.error("[Home] Failed to fetch posts:", e);
  }

  return <HomePageClient posts={posts} videoPosts={videoPosts} />;
}
