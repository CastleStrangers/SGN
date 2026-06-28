"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Loader2, Radio } from "lucide-react";

interface TickerPost {
  id: string;
  title: string;
  slug: string;
  category: string;
}

export function BreakingNews() {
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [posts, setPosts] = useState<TickerPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news?limit=15")
      .then(r => r.json())
      .then(data => {
        setPosts(data.posts || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-red-600 text-white h-10 flex items-center justify-center">
        <Loader2 className="w-4 h-4 animate-spin text-white/80" />
      </div>
    );
  }

  if (!posts.length) return null;

  return (
    <div className="bg-red-600 text-white overflow-hidden border-b border-red-700 select-none" dir={isRtl ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto flex items-center h-10 relative">
        {/* التسمية الثابتة */}
        <div className="bg-red-700 text-white px-4 h-full flex items-center gap-2 font-bold text-sm z-20 shadow-md flex-shrink-0">
          <Radio className="w-4 h-4 animate-pulse text-white" />
          <span>{t("breaking.label")}</span>
        </div>

        {/* الشريط المتحرك التفاعلي */}
        <div className="flex-1 overflow-hidden relative h-full flex items-center">
          <div 
            className="flex gap-12 whitespace-nowrap hover:[animation-play-state:paused] cursor-pointer animate-marquee-continuous"
          >
            {/* نكرر القائمة مرتين للحصول على تأثير شريط مستمر لا نهائي */}
            {[...posts, ...posts].map((post, index) => (
              <Link 
                key={`${post.id}-${index}`}
                href={`/news/${post.slug}`}
                className="flex items-center gap-3 text-sm font-semibold hover:text-red-200 transition-colors text-white"
              >
                <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                  {post.category}
                </span>
                <span>{post.title}</span>
                <span className="text-red-300 mx-2">✦</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
