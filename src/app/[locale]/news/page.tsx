"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { Clock, Search, ArrowLeft, Newspaper, TrendingUp, Filter, ChevronLeft, ChevronRight, Sparkles, Eye, Facebook, Instagram, Youtube, Twitter, Play, X } from "lucide-react";
import { TikTok } from "@/components/tiktok-icon";
import { formatDate } from "@/lib/date";

interface Post {
  id: string; title: string; excerpt: string; image: string;
  videoId?: string; category: string; createdAt: string; slug: string; views: number;
  author: { name: string };
}

const CATEGORIES = [
  "\u0627\u0644\u0643\u0644",
  "\u0623\u062e\u0628\u0627\u0631 \u0627\u0644\u062c\u0627\u0644\u064a\u0629",
  "\u0623\u062e\u0628\u0627\u0631 \u0647\u0648\u0644\u0646\u062f\u0627",
  "\u0623\u062e\u0628\u0627\u0631 \u0623\u0648\u0631\u0648\u0628\u0627",
  "\u0627\u0642\u062a\u0635\u0627\u062f",
  "\u062b\u0642\u0627\u0641\u064a\u0627\u062a",
  "\u0641\u064a\u062f\u064a\u0648\u0647\u0627\u062a",
  "\u0641\u0639\u0627\u0644\u064a\u0627\u062a",
  "\u0645\u0639\u0631\u0636 \u0627\u0644\u0635\u0648\u0631",
  "\u062e\u062f\u0645\u0627\u062a"
];

const PLACEHOLDER = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='240' viewBox='0 0 400 240'><rect width='400' height='240' fill='%23f0faf4'/><rect x='150' y='80' width='100' height='80' rx='8' fill='%231a5632' opacity='0.15'/><circle cx='200' cy='100' r='20' fill='%231a5632' opacity='0.25'/><line x1='160' y1='140' x2='240' y2='140' stroke='%231a5632' stroke-width='3' stroke-linecap='round' opacity='0.2'/><line x1='170' y1='155' x2='230' y2='155' stroke='%231a5632' stroke-width='2' stroke-linecap='round' opacity='0.15'/></svg>`;

function getThumb(post: Post): string {
  if (post.videoId) return `https://img.youtube.com/vi/${post.videoId}/hqdefault.jpg`;
  if (post.image && (post.image.startsWith("http") || post.image.startsWith("/"))) return post.image;
  return PLACEHOLDER;
}

function NewsPageInner() {
  const t = useTranslations('newsPage');
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");

  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(() =>
    urlCategory ? decodeURIComponent(urlCategory) : "\u0627\u0644\u0643\u0644"
  );
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const limit = 12;

  const CATEGORY_LABELS: Record<string, string> = {
    "\u0627\u0644\u0643\u0644": t('all'),
    "\u0623\u062e\u0628\u0627\u0631 \u0627\u0644\u062c\u0627\u0644\u064a\u0629": t('communityNews'),
    "\u0623\u062e\u0628\u0627\u0631 \u0647\u0648\u0644\u0646\u062f\u0627": t('netherlandsNews'),
    "\u0623\u062e\u0628\u0627\u0631 \u0623\u0648\u0631\u0648\u0628\u0627": t('europeNews'),
    "\u0627\u0642\u062a\u0635\u0627\u062f": t('economy'),
    "\u062b\u0642\u0627\u0641\u064a\u0627\u062a": t('culture'),
    "\u0641\u064a\u062f\u064a\u0648\u0647\u0627\u062a": t('videos'),
    "\u0641\u0639\u0627\u0644\u064a\u0627\u062a": t('events'),
    "\u0645\u0639\u0631\u0636 \u0627\u0644\u0635\u0648\u0631": t('gallery'),
    "\u062e\u062f\u0645\u0627\u062a": t('services'),
  };

  useEffect(() => {
    const cat = urlCategory ? decodeURIComponent(urlCategory) : "\u0627\u0644\u0643\u0644";
    setActiveCategory(cat);
    setPage(0);
  }, [urlCategory]);

  const fetchPosts = () => {
    if (activeCategory === "\u062e\u062f\u0645\u0627\u062a") {
      setPosts([]);
      setTotal(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    const params = new URLSearchParams();
    if (activeCategory === "\u0641\u064a\u062f\u064a\u0648\u0647\u0627\u062a") {
      params.set("video", "true");
    } else if (activeCategory !== "\u0627\u0644\u0643\u0644") {
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

  const handleCategoryClick = (cat: string) => {
    if (cat === "\u0645\u0639\u0631\u0636 \u0627\u0644\u0635\u0648\u0631") {
      router.push("/gallery");
      return;
    }
    setActiveCategory(cat);
    setPage(0);
  };

  const handlePostClick = (e: React.MouseEvent, p: Post) => {
    if (p.videoId) {
      e.preventDefault();
      setActiveVideoId(p.videoId);
    }
  };

  const totalPages = Math.ceil(total / limit);
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div dir={dir} className="min-h-screen bg-[#fafdfb] text-gray-800">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
        .animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <div className="relative overflow-hidden bg-gradient-to-br from-[#1a5632] via-[#113d22] to-[#0d2e1a] text-white py-12 md:py-16 shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-40 pointer-events-none" />
        <div className="absolute -left-12 -top-12 w-64 h-64 bg-[#c8a84e]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-10 -bottom-10 w-80 h-80 bg-[#1a5632]/50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[#c8a84e]/90 hover:text-white mb-6 text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>{t('backToHome')}</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#c8a84e]/20 text-[#c8a84e] border border-[#c8a84e]/30 mb-3 animate-fade-in">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('statsTitle')}</span>
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold flex items-center gap-3 tracking-tight">
                {activeCategory === "\u0641\u064a\u062f\u064a\u0648\u0647\u0627\u062a" ? (
                  <Youtube className="w-9 h-9 md:w-12 md:h-12 text-[#c8a84e] filter drop-shadow" />
                ) : (
                  <Newspaper className="w-9 h-9 md:w-12 md:h-12 text-[#c8a84e] filter drop-shadow" />
                )}
                <span>{activeCategory === "\u0627\u0644\u0643\u0644" ? t('pulseTitle') : CATEGORY_LABELS[activeCategory] || activeCategory}</span>
              </h1>
              <p className="text-white/80 mt-3 max-w-2xl text-sm md:text-base leading-relaxed font-light">
                {activeCategory === "\u0641\u064a\u062f\u064a\u0648\u0647\u0627\u062a" ? t('videoDescription') : t('defaultDescription')}
              </p>
            </div>

            <div className="hidden lg:flex items-center gap-4 bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="text-center px-4 border-l border-white/10">
                <p className="text-xl font-bold text-[#c8a84e]">+2,500</p>
                <p className="text-xs text-white/60">{t('statMembers')}</p>
              </div>
              <div className="text-center px-4">
                <p className="text-xl font-bold text-[#c8a84e]">48</p>
                <p className="text-xs text-white/60">{t('statEvents')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 overflow-x-auto scrollbar-none pb-2 border-b border-gray-100">
          <div className="flex gap-2.5 min-w-max pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 transform active:scale-95 ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-[#1a5632] to-[#113d22] text-white shadow-md shadow-[#1a5632]/25 scale-105"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-[#1a5632]/40 hover:text-[#1a5632] shadow-sm"
                }`}
              >
                {CATEGORY_LABELS[cat] || cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="mb-8">
              <form onSubmit={e => { e.preventDefault(); fetchPosts(); }} className="flex gap-2">
                <div className="relative flex-grow max-w-lg">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="w-full pr-11 pl-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5632]/20 focus:border-[#1a5632] shadow-sm transition-all duration-200"
                  />
                </div>
                <button type="submit" className="px-6 py-3 bg-[#1a5632] hover:bg-[#113d22] text-white rounded-2xl text-sm font-semibold shadow-sm transition-colors">
                  {t('searchButton')}
                </button>
              </form>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center h-80 gap-3">
                <div className="animate-spin w-10 h-10 border-4 border-[#1a5632] border-t-transparent rounded-full" />
                <p className="text-sm text-gray-400">{t('loading')}</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium text-lg">{t('emptyCategory')}</p>
                <p className="text-sm text-gray-400 mt-1">{t('emptyCategoryDesc')}</p>
              </div>
            ) : (
              <>
                <div className="text-xs font-semibold text-[#1a5632] mb-5 bg-[#1a5632]/5 w-fit px-3 py-1.5 rounded-lg border border-[#1a5632]/10">
                  {t('countIn', { total, category: CATEGORY_LABELS[activeCategory] || activeCategory })}
                </div>

                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {posts.map((p) => {
                    const isVideo = !!(p.videoId);
                    return (
                      <div key={p.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-transparent hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out group flex flex-col relative">
                        <div className="block overflow-hidden relative aspect-video cursor-pointer" onClick={(e) => handlePostClick(e, p)}>
                          <img src={getThumb(p)} alt={p.title} loading="lazy" decoding="async" onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER; }} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                          <span className="absolute top-3 right-3 backdrop-blur-md bg-white/75 text-[#1a5632] font-semibold text-xs px-2.5 py-1 rounded-full shadow-sm border border-white/20">
                            {CATEGORY_LABELS[p.category] || p.category}
                          </span>
                          {isVideo && (
                            <span className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors duration-300">
                              <span className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                              </span>
                            </span>
                          )}
                        </div>
                        <div className="p-5 flex flex-col flex-grow">
                          <h3 className="font-bold text-gray-900 text-base line-clamp-2 leading-snug hover:text-[#1a5632] transition-colors duration-200">
                            {isVideo ? (
                              <button onClick={(e) => handlePostClick(e as any, p)} className="text-right font-bold w-full focus:outline-none">{p.title}</button>
                            ) : (
                              <Link href={`/news/${p.slug || p.id}`}>{p.title}</Link>
                            )}
                          </h3>
                          {p.excerpt && <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">{p.excerpt}</p>}
                          <div className="flex items-center justify-between mt-5 pt-3 border-t border-gray-50 text-xs text-gray-400 mt-auto">
                            <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /><span>{formatDate(p.createdAt, locale)}</span></div>
                            <div className="flex items-center gap-1.5 font-medium"><Eye className="w-3.5 h-3.5" /><span>{p.views || 0}</span></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} title={t('prevPage')} aria-label={t('prevPage')} className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button key={i} onClick={() => setPage(i)} className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${page === i ? "bg-[#1a5632] text-white shadow-md shadow-[#1a5632]/20" : "border border-gray-200 hover:bg-gray-50 text-gray-700"}`}>{i + 1}</button>
                    ))}
                    <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} title={t('nextPage')} aria-label={t('nextPage')} className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <aside className="lg:col-span-1 order-2 lg:order-1 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hidden lg:block">
              <div className="bg-[#1a5632] text-white px-5 py-4 font-bold text-sm flex items-center gap-2">
                <Filter className="w-4 h-4" /> <span>{t('categories')}</span>
              </div>
              <div className="p-3 space-y-1">
                {CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => handleCategoryClick(cat)} className={`block w-full text-right px-4 py-2.5 rounded-xl text-sm transition-all ${activeCategory === cat ? "bg-[#1a5632]/10 text-[#1a5632] font-bold" : "text-gray-700 hover:bg-gray-50"}`}>
                    {CATEGORY_LABELS[cat] || cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h4 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
                <TrendingUp className="w-4.5 h-4.5 text-[#1a5632]" />
                <span>{t('statsTitle')}</span>
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {[{ label: t('statMembers'), value: "+2,500" }, { label: t('statEvents'), value: "48" }, { label: t('statVolunteers'), value: "320" }, { label: t('statYears'), value: "5" }].map((s) => (
                  <div key={s.label} className="bg-[#1a5632]/5 rounded-xl p-3 text-center border border-[#1a5632]/5">
                    <p className="text-lg font-extrabold text-[#1a5632]">{s.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h4 className="font-bold text-gray-900 text-sm mb-4">{t('followTitle')}</h4>
              <div className="flex flex-wrap gap-2">
                {[{ icon: Facebook, label: t('facebook'), color: "bg-blue-600 hover:bg-blue-700", href: "https://www.facebook.com/profile.php?id=61584301535331" }, { icon: Instagram, label: t('instagram'), color: "bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 hover:opacity-90", href: "https://www.instagram.com/sgn_syria/" }, { icon: Youtube, label: t('youtube'), color: "bg-red-600 hover:bg-red-700", href: "https://www.youtube.com/@SY-NL" }, { icon: Twitter, label: t('twitter'), color: "bg-gray-950 hover:bg-black", href: "https://x.com/SGN2098551" }, { icon: TikTok, label: t('tiktok'), color: "bg-gray-900 hover:bg-black", href: "https://www.tiktok.com/@sgn_syria" }].map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className={`${s.color} text-white rounded-xl px-3.5 py-2 flex items-center gap-2 text-xs font-medium shadow-sm transition-all hover:scale-102`}>
                    <s.icon className="w-3.5 h-3.5" /><span>{s.label}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1a5632] to-[#0f3d23] text-white rounded-2xl p-6 text-center shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
              <Sparkles className="w-8 h-8 text-[#c8a84e] mx-auto mb-3 animate-pulse" />
              <h3 className="font-bold text-base mb-1.5">{t('joinTitle')}</h3>
              <p className="text-xs text-white/70 mb-4 leading-relaxed">{t('joinDesc')}</p>
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSckV1utDGcCXjB4Lg8p9hiYtJjgHwUJyTZb2waISC9dBZdKJw/viewform" target="_blank" rel="noopener noreferrer" className="inline-block bg-[#c8a84e] hover:bg-[#b8973f] text-[#1a1a2e] font-bold px-5 py-2.5 rounded-xl text-xs shadow-md shadow-[#c8a84e]/10 transition-colors w-full">
                {t('joinButton')}
              </a>
            </div>
          </aside>
        </div>
      </div>

      {activeVideoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-opacity duration-300 animate-fade-in" onClick={() => setActiveVideoId(null)}>
          <div className="relative w-full max-w-4xl bg-[#0b0c10] rounded-3xl overflow-hidden shadow-2xl border border-white/10 animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5 backdrop-blur-sm">
              <span className="text-sm font-semibold text-[#c8a84e] flex items-center gap-2">
                <Youtube className="w-5 h-5 text-red-500 fill-current" /><span>{t('videoPlayerTitle')}</span>
              </span>
              <button onClick={() => setActiveVideoId(null)} className="p-2 rounded-xl bg-white/5 text-white/80 hover:bg-white/10 hover:text-white hover:scale-105 transition-all" aria-label="إغلاق">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1`} title="YouTube Video Player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full border-0" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NewsPage() {
  const t = useTranslations('newsPage');
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";
  return (
    <Suspense fallback={<div dir={dir} className="min-h-screen bg-[#fafdfb] flex items-center justify-center"><p className="text-gray-500">{t('loading')}</p></div>}>
      <NewsPageInner />
    </Suspense>
  );
}
