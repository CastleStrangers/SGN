"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { Clock, Search, ArrowLeft, Newspaper, TrendingUp, Filter, ChevronLeft, ChevronRight, Sparkles, Heart, Eye, Facebook, Instagram, Youtube, Twitter, Play } from "lucide-react";
import { TikTok } from "@/components/tiktok-icon";
import { formatDate } from "@/lib/date";

interface Post {
  id: string; title: string; excerpt: string; image: string;
  videoId?: string; category: string; createdAt: string; slug: string; views: number;
  author: { name: string };
}

const CATEGORIES = [
  "الكل", "فيديوهات", "أخبار الجالية", "أخبار هولندا", "أخبار أوروبا",
  "اقتصاد وأعمال", "ثقافة وفن", "رياضة", "تكنولوجيا", "عمل إنساني", "خدمات",
];

// Placeholder SVG محلي يظهر عند فشل تحميل الصورة
const PLACEHOLDER = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='240' viewBox='0 0 400 240'><rect width='400' height='240' fill='%23f0faf4'/><rect x='150' y='80' width='100' height='80' rx='8' fill='%231a5632' opacity='0.15'/><circle cx='200' cy='100' r='20' fill='%231a5632' opacity='0.25'/><line x1='160' y1='140' x2='240' y2='140' stroke='%231a5632' stroke-width='3' stroke-linecap='round' opacity='0.2'/><line x1='170' y1='155' x2='230' y2='155' stroke='%231a5632' stroke-width='2' stroke-linecap='round' opacity='0.15'/></svg>`;

/** تُرجع رابط الصورة أو YouTube thumbnail أو placeholder */
function getThumb(post: Post): string {
  if (post.videoId) return `https://img.youtube.com/vi/${post.videoId}/hqdefault.jpg`;
  if (post.image && (post.image.startsWith("http") || post.image.startsWith("/"))) return post.image;
  return PLACEHOLDER;
}

function NewsPageInner() {
  const t = useTranslations('newsPage');
  const locale = useLocale();
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");

  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(() =>
    urlCategory ? decodeURIComponent(urlCategory) : "الكل"
  );
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const limit = 12;

  const CATEGORY_LABELS: Record<string, string> = {
    "الكل": t('all'),
    "فيديوهات": t('videos'),
    "أخبار الجالية": t('communityNews'),
    "أخبار هولندا": t('netherlandsNews'),
    "أخبار أوروبا": t('europeNews'),
    "اقتصاد وأعمال": t('economy'),
    "ثقافة وفن": t('culture'),
    "رياضة": t('sports'),
    "تكنولوجيا": t('tech'),
    "عمل إنساني": t('humanitarian'),
    "خدمات": t('services'),
  };

  // تحديث الفئة النشطة عند تغيير URL params (مثلاً الضغط على قسم الفيديوهات)
  useEffect(() => {
    const cat = urlCategory ? decodeURIComponent(urlCategory) : "الكل";
    setActiveCategory(cat);
    setPage(0);
  }, [urlCategory]);

  const fetchPosts = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeCategory === "فيديوهات") {
      params.set("video", "true");
    } else if (activeCategory !== "الكل") {
      params.set("category", activeCategory);
    }
    params.set("limit", String(limit));
    params.set("offset", String(page * limit));
    if (searchQuery) params.set("search", searchQuery);

    fetch(`/api/news?${params}`)
      .then(r => r.json())
      .then(data => {
        setPosts(data.posts || []);
        setTotal(data.total || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchPosts(); }, [activeCategory, page]);


  const totalPages = Math.ceil(total / limit);

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      {/* Inner page header */}
      <div className="bg-gradient-to-l from-[#1a5632] to-[#0f3d23] text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span>{t('backToHome')}</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            {activeCategory === "فيديوهات" ? (
              <Youtube className="w-8 h-8 text-[#c8a84e]" />
            ) : (
              <Newspaper className="w-8 h-8 text-[#c8a84e]" />
            )}
            {activeCategory === "الكل" ? t('pulseTitle') : CATEGORY_LABELS[activeCategory] || activeCategory}
          </h1>
          <p className="text-white/70 mt-2 max-w-2xl">
            {activeCategory === "فيديوهات"
              ? t('videoDescription')
              : t('defaultDescription')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1 order-2 lg:order-1 space-y-4">
            {/* Categories */}
            <div className="bg-white rounded-2xl border overflow-hidden">
              <div className="bg-[#1a5632] text-white px-4 py-3 font-bold text-sm flex items-center gap-2">
                <Filter className="w-4 h-4" /> {t('categories')}
              </div>
              <div className="p-2 space-y-0.5">
                {CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => { setActiveCategory(cat); setPage(0); }}
                    className={`block w-full text-right px-3 py-2 rounded-xl text-sm transition-colors ${
                      activeCategory === cat
                        ? "bg-[#1a5632] text-white font-bold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {CATEGORY_LABELS[cat] || cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-2xl border p-4">
              <h4 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#1a5632]" /> {t('statsTitle')}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: t('statMembers'), value: "+2,500" },
                  { label: t('statEvents'), value: "48" },
                  { label: t('statVolunteers'), value: "320" },
                  { label: t('statYears'), value: "5" },
                ].map((s) => (
                  <div key={s.label} className="bg-gray-50 rounded-xl p-2.5 text-center">
                    <p className="text-lg font-bold text-[#1a5632]">{s.value}</p>
                    <p className="text-xs text-gray-500">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Follow */}
            <div className="bg-white rounded-2xl border p-4">
              <h4 className="font-bold text-gray-900 text-sm mb-3">{t('followTitle')}</h4>
              <div className="flex flex-wrap gap-2">
                  {[
                    { icon: Facebook, label: t('facebook'), color: "bg-blue-600", href: "https://www.facebook.com/profile.php?id=61584301535331" },
                    { icon: Instagram, label: t('instagram'), color: "bg-pink-600", href: "https://www.instagram.com/sgn_syria/" },
                    { icon: Youtube, label: t('youtube'), color: "bg-red-600", href: "https://www.youtube.com/@SY-NL" },
                    { icon: Twitter, label: t('twitter'), color: "bg-gray-800", href: "https://x.com/SGN2098551" },
                    { icon: TikTok, label: t('tiktok'), color: "bg-gray-900", href: "https://www.tiktok.com/@sgn_syria" },
                  ].map((s) => (
                  <a key={s.label} href={s.href} target="_blank"
                    className={`${s.color} text-white rounded-xl px-3 py-2 flex items-center gap-1.5 text-xs hover:opacity-90 transition-opacity`}
                  >
                    <s.icon className="w-3.5 h-3.5" /> {s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-[#1a5632] to-[#0f3d23] text-white rounded-2xl p-5 text-center">
              <Sparkles className="w-7 h-7 text-[#c8a84e] mx-auto mb-2" />
              <h3 className="font-bold text-sm mb-1">{t('joinTitle')}</h3>
              <p className="text-xs text-gray-300 mb-3">{t('joinDesc')}</p>
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSckV1utDGcCXjB4Lg8p9hiYtJjgHwUJyTZb2waISC9dBZdKJw/viewform" target="_blank"
                className="inline-block bg-[#c8a84e] hover:bg-[#b8973f] text-[#1a1a2e] font-bold px-4 py-2 rounded-xl text-xs transition-colors"
              >
                {t('joinButton')}
              </a>
            </div>
          </aside>

          {/* Main content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {/* Search */}
            <form onSubmit={e => { e.preventDefault(); fetchPosts(); }} className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full pr-10 pl-4 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5632]"
                />
              </div>
            </form>

            {/* Posts grid */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-[#1a5632] border-t-transparent rounded-full" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16">
                <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">{t('emptyCategory')}</p>
              </div>
            ) : (
              <>
                <div className="text-sm text-gray-500 mb-4">
                  {t('countIn', { total, category: CATEGORY_LABELS[activeCategory] || activeCategory })}
                </div>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {posts.map((p) => {
                    const isVideo = !!(p.videoId);

                    return (
                      <div key={p.id} className="bg-white rounded-xl overflow-hidden border hover:shadow-md transition-shadow group flex flex-col">
                        {/* صورة أو Thumbnail يوتيوب */}
                        <Link href={`/news/${p.slug || p.id}`} className="block overflow-hidden relative">
                          <img
                            src={getThumb(p)}
                            alt={p.title}
                            loading="lazy"
                            decoding="async"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER; }}
                            className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {isVideo && (
                            <span className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                              <span className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shadow">
                                <Play className="w-4 h-4 text-white ml-0.5" fill="currentColor" />
                              </span>
                            </span>
                          )}
                        </Link>
                        <Link href={`/news/${p.slug || p.id}`} className="p-4 flex flex-col flex-grow">
                          <span className="bg-[#1a5632]/10 text-[#1a5632] text-xs font-bold px-2 py-0.5 rounded w-fit">{p.category}</span>
                          <h3 className="font-bold text-gray-900 mt-2 mb-1 line-clamp-2 leading-snug">{p.title}</h3>
                          {p.excerpt && <p className="text-sm text-gray-500 line-clamp-2">{p.excerpt}</p>}
                          <div className="flex items-center justify-between mt-3 text-xs text-gray-400 mt-auto">
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              <span>{formatDate(p.createdAt, locale)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" /> {p.views || 0}
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                      className="p-2 rounded-xl border hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button key={i} onClick={() => setPage(i)}
                        className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                          page === i ? "bg-[#1a5632] text-white" : "border hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                      className="p-2 rounded-xl border hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewsPage() {
  const t = useTranslations('newsPage');
  return (
    <Suspense fallback={<div dir="rtl" className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-500">{t('loading')}</p></div>}>
      <NewsPageInner />
    </Suspense>
  );
}
