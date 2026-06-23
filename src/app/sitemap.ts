import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://sgn-indol.vercel.app';
  const routes = [
    { url: ${base}/, lastModified: new Date() },
    { url: ${base}/news, lastModified: new Date() },
    { url: ${base}/about, lastModified: new Date() },
    { url: ${base}/contact, lastModified: new Date() },
  ];

  let posts = [];
  try {
    posts = await prisma.post.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } });
  } catch (e) {
    // تجاهل الخطأ أثناء عملية البناء (Build) على Vercel
  }

  const postRoutes = posts.map((p) => ({
    url: ${base}/news/,
    lastModified: p.updatedAt,
  }));

  return [...routes, ...postRoutes];
}
