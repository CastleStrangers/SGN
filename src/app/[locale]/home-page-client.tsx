"use client";

import { useTranslations } from "next-intl";
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
import { HomeProvinceMap } from "@/components/home/home-province-map";

import { Ads } from "@/components/ads";
import { CommunityStats } from "@/components/community-stats";

interface PostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image: string | null;
  videoId: string | null;
  category: string;
  source: string;
  featured: boolean;
  views: number;
  createdAt: any;
  author: { name: string | null } | null;
}

interface HomePageClientProps {
  posts: PostData[];
  videoPosts: PostData[];
}

export function HomePageClient({ posts, videoPosts }: HomePageClientProps) {
  const t = useTranslations();

  function timeAgo(date: any) {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return t("common.ago_minute", { count: mins || 1 });
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return t("common.ago_hour", { count: hrs });
    const days = Math.floor(hrs / 24);
    return t("common.ago_day", { count: days });
  }

  const featured = posts.slice(0, 4).map((p) => ({
    title: p.title,
    cat: p.category,
    img: p.image,
    excerpt: p.excerpt || "",
    author: p.author?.name || t("site.shortTitle"),
    time: timeAgo(p.createdAt),
    slug: p.slug,
    videoId: p.videoId || undefined,
  }));

  const latest = posts.slice(0, 4).map((p) => ({
    title: p.title,
    cat: p.category,
    img: p.image,
    time: timeAgo(p.createdAt),
    slug: p.slug,
    videoId: p.videoId || undefined,
  }));

  const videos = videoPosts.map((p) => ({
    title: p.title,
    cat: p.category,
    img: p.image,
    excerpt: p.excerpt || "",
    author: p.author?.name || t("site.shortTitle"),
    time: timeAgo(p.createdAt),
    slug: p.slug,
    videoId: p.videoId || undefined,
    content: "",
  }));

  return (
    <div dir="auto" className="min-h-screen bg-background text-foreground">
      <TopBar />
      <SiteHeader />
      <BreakingNews />
      <CommunityStats />
      <HomeProvinceMap />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-8">
            <HeroSection posts={featured} />
            <CategoryGrid />
            <div className="grid md:grid-cols-2 gap-6">
              <FeaturedList posts={featured} />
            </div>
          </div>
          <div className="space-y-6">
            <Sidebar latest={latest} />
            <Ads position="sidebar" />
          </div>
        </div>
        <MoreNews posts={latest} />
        <LatestVideos posts={videos} />
        <Ads position="banner" className="my-6" />
        <Newsletter />
      </main>
    </div>
  );
}
