"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { Clock, ArrowLeft, Newspaper, ChevronRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { formatDate } from "@/lib/date";
import { resolveImage } from "@/lib/image-fallback";

interface Post {
  id: string; title: string; excerpt: string; image: string;
  category: string; createdAt: string; slug: string;
  author: { name: string };
  content: string;
}

const CATEGORY_API: Record<string, string> = {
  "أخبار-الجالية": "أخبار الجالية",
  "أخبار-هولندا": "أخبار هولندا",
  "أخبار-أوروبا": "أخبار أوروبا",
  اقتصاد: "اقتصاد وأعمال",
  "ثقافة-وفن": "ثقافة وفن",
  رياضة: "رياضة",
  تكنولوجيا: "تكنولوجيا",
  "عمل-إنساني": "عمل إنساني",
  خدمات: "خدمات",
};

const CATEGORY_KEYS: Record<string, string> = {
  "أخبار-الجالية": "communityNews",
  "أخبار-هولندا": "netherlandsNews",
  "أخبار-أوروبا": "europeNews",
  اقتصاد: "economy",
  "ثقافة-وفن": "culture",
  رياضة: "sports",
  تكنولوجيا: "tech",
  "عمل-إنساني": "humanitarian",
  خدمات: "services",
};

export default function CategoryPage() {
  const t = useTranslations('newsCategory');
  const tc = useTranslations('categories');
  const locale = useLocale();
  const { slug } = useParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const catKey = typeof slug === "string" ? (CATEGORY_KEYS[slug] || slug) : slug;
  const catName = tc(catKey) || catKey;

  useEffect(() => {
    if (!slug || Array.isArray(slug)) return;
    const category = CATEGORY_API[slug] || slug;
    fetch(`/api/news?category=${encodeURIComponent(category)}&limit=50`)
      .then(r => r.json())
      .then(data => { setPosts(data.posts || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  const dir = locale === "ar" ? "rtl" : "ltr";

  if (loading) return (
    <div dir={dir} className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-[#1a5632] border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div dir={dir} className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/news" className="text-sm text-[#1a5632] hover:underline flex items-center gap-1 mb-2">
              <ArrowLeft className="w-3 h-3" /> {t('backToNews')}
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Newspaper className="w-6 h-6 text-[#1a5632]" /> {catName}
            </h1>
            <p className="text-sm text-gray-500 mt-1">{t('countPrefix', { count: posts.length })}</p>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16">
            <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">{t('empty')}</p>
            <Link href="/news" className="text-[#1a5632] hover:underline text-sm mt-2 inline-block">{t('browseAll')}</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((p) => (
              <Link key={p.id} href={`/news/${p.slug || p.id}`} className="bg-white rounded-xl overflow-hidden border hover:shadow-md transition-shadow group">
                {(() => {
                  const ytMatch = p.content?.match(/src=["'](https:\/\/www\.youtube\.com\/embed\/[^"']+)["']/);
                  const embedUrl = ytMatch ? ytMatch[1] : null;
                  if (embedUrl) {
                    return (
                      <div className="relative w-full h-48 bg-black">
                        <iframe
                          src={embedUrl}
                          className="absolute inset-0 w-full h-full border-0"
                          allowFullScreen
                          title={p.title}
                        />
                      </div>
                    );
                  }
                  return (
                    <div className="overflow-hidden">
                      <img src={resolveImage(p.image, p.title, p.category)} alt="" loading="lazy" decoding="async" onError={(e) => { (e.currentTarget as HTMLImageElement).src = resolveImage(null, p.title, p.category); }} className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  );
                })()}
                <div className="p-4">
                  <span className="bg-[#1a5632]/10 text-[#1a5632] text-xs font-bold px-2 py-0.5 rounded">{p.category}</span>
                  <h3 className="font-bold text-gray-900 mt-2 mb-1 line-clamp-2 leading-snug">{p.title}</h3>
                  {p.excerpt && <p className="text-sm text-gray-500 line-clamp-2">{p.excerpt}</p>}
                  <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(p.createdAt, locale)}</span>
                    {p.author?.name && <><span>•</span><span>{p.author.name}</span></>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
