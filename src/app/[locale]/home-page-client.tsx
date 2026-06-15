"use client";

import { useState, useEffect } from "react";
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

import { Ads } from "@/components/ads";
import { CommunityStats } from "@/components/community-stats";

export function HomePageClient() {
  const t = useTranslations();
  const [featured, setFeatured] = useState<any[]>([]);
  const [latest, setLatest] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return t("common.ago_minute", { count: mins || 1 });
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return t("common.ago_hour", { count: hrs });
    const days = Math.floor(hrs / 24);
    return t("common.ago_day", { count: days });
  }

  useEffect(() => {
    Promise.all([
      fetch("/api/news?limit=10").then(r => r.json()),
      fetch("/api/news?video=true&limit=4").then(r => r.json())
    ])
      .then(([newsData, videoData]) => {
        const posts = newsData.posts || [];
        const videoPosts = videoData.posts || [];

        setFeatured(posts.slice(0, 4).map((p: any) => ({
          title: p.title, cat: p.category, img: p.image,
          excerpt: p.excerpt, author: p.author?.name || t("site.shortTitle"),
          time: timeAgo(p.createdAt), slug: p.slug, videoId: p.videoId,
        })));
        setLatest(posts.slice(0, 4).map((p: any) => ({
          title: p.title, img: p.image, time: timeAgo(p.createdAt), slug: p.slug, videoId: p.videoId,
        })));
        setVideos(videoPosts.map((p: any) => ({
          title: p.title, cat: p.category, img: p.image,
          excerpt: p.excerpt, author: p.author?.name || t("site.shortTitle"),
          time: timeAgo(p.createdAt), slug: p.slug, videoId: p.videoId, content: p.content,
        })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [t]);

  return (
    <div dir="auto" className="min-h-screen bg-background text-foreground">
      <TopBar />
      <SiteHeader />
      <BreakingNews />
      <CommunityStats />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {loading && (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin w-10 h-10 border-4 border-[#1a5632] border-t-transparent rounded-full" />
          </div>
        )}
        {!loading && (<>
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
        </>)}
        <Newsletter />
      </main>
    </div>
  );
}
