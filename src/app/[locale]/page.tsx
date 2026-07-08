import { prisma } from "@/lib/db";
import { HomePageClient } from "./home-page-client";

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
    [posts, videoPosts] = await Promise.all([
      prisma.post.findMany({
        where: { published: true, locale },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: LIST_SELECT,
      }),
      prisma.post.findMany({
        where: { published: true, source: "youtube", locale },
        orderBy: { createdAt: "desc" },
        take: 4,
        select: LIST_SELECT,
      }),
    ]);
  } catch (e) {
    console.error("[Home] Failed to fetch posts:", e);
  }

  return <HomePageClient posts={posts} videoPosts={videoPosts} />;
}
