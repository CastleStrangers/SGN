import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const BASE = "https://sgn-indol.vercel.app";
const LOCALES = ["ar", "nl", "en"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  const events = await prisma.event.findMany({
    where: { published: true },
    select: { id: true, updatedAt: true },
  });

  const members = await prisma.member.findMany({
    where: { status: "accepted" },
    select: { id: true, createdAt: true },
  });

  const staticPages: MetadataRoute.Sitemap = [];
  for (const locale of LOCALES) {
    staticPages.push(
      { url: `${BASE}/${locale}`, lastModified: new Date(), changeFrequency: "hourly" as const, priority: 1 },
      { url: `${BASE}/${locale}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
      { url: `${BASE}/${locale}/news`, lastModified: new Date(), changeFrequency: "hourly" as const, priority: 0.9 },
      { url: `${BASE}/${locale}/events`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 },
      { url: `${BASE}/${locale}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
      { url: `${BASE}/${locale}/volunteer`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
      { url: `${BASE}/${locale}/gallery`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 },
      { url: `${BASE}/${locale}/join`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
      { url: `${BASE}/${locale}/members`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    );
  }

  const postPages: MetadataRoute.Sitemap = posts.map((p: { slug: string | null; updatedAt: Date }) => ({
    url: `${BASE}/news/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const eventPages: MetadataRoute.Sitemap = events.map((e: { id: string; updatedAt: Date }) => ({
    url: `${BASE}/events`,
    lastModified: e.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const memberPages: MetadataRoute.Sitemap = members.map((m: { id: string; createdAt: Date }) => ({
    url: `${BASE}/member/${m.id}`,
    lastModified: m.createdAt,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...postPages, ...eventPages, ...memberPages];
}
