import { prisma } from "@/lib/db";
import { TopBar } from "@/components/home/top-bar";
import { SiteHeader } from "@/components/home/site-header";
import { BreakingNews } from "@/components/home/breaking-news";
import { HeroSection } from "@/components/home/hero-section";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedList } from "@/components/home/featured-list";
import { Sidebar } from "@/components/home/sidebar";
import { MoreNews } from "@/components/home/more-news";
import { LatestVideos } from "@/components/home/latest-videos";
import { Newsletter } from "@/components/home/newsletter";
import { Ads } from "@/components/ads";
import { CommunityStats } from "@/components/community-stats";

function timeAgo(date: Date) {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins || 1} دقيقة`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ساعة`;
  const days = Math.floor(hrs / 24);
  return `${days} يوم`;
}

export default async function Home() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
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
    },
  });

  const videoPosts = posts.filter(p => p.videoId || p.source === "youtube").slice(0, 4);

  const featured = posts.slice(0, 4).map(p => ({
    title: p.title,
    cat: p.category || "عام",
    img: p.image,
    excerpt: p.excerpt || "",
    author: p.author?.name || "الجالية السورية",
    time: timeAgo(p.createdAt),
    slug: p.slug || "",
    videoId: p.videoId || undefined,
  }));

  const latest = posts.slice(0, 4).map(p => ({
    title: p.title,
    img: p.image,
    time: timeAgo(p.createdAt),
    slug: p.slug || "",
    videoId: p.videoId || undefined,
  }));

  const videos = videoPosts.map(p => ({
    title: p.title,
    cat: p.category || "عام",
    img: p.image,
    excerpt: p.excerpt || "",
    author: p.author?.name || "الجالية السورية",
    time: timeAgo(p.createdAt),
    slug: p.slug || "",
    videoId: p.videoId || undefined,
    content: p.excerpt || "",
  }));

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <SiteHeader />
      <BreakingNews />
      <main className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <HeroSection posts={featured} />
          <CategoryGrid />
          <FeaturedList posts={featured} />
          <MoreNews posts={latest} />
          <LatestVideos posts={videos} />
        </div>
        <aside className="lg:col-span-4 space-y-6">
          <Sidebar latest={latest} />
          <Ads position="home" />
          <CommunityStats />
          <Newsletter />
        </aside>
      </main>
    </div>
  );
}