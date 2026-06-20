"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Clock } from "lucide-react";
import { PLACEHOLDER_IMG, handleImgError, resolveImage } from "@/lib/image-fallback";
import { Play } from "lucide-react";

interface Post { title: string; img: string | null; time: string; slug: string; videoId?: string; cat?: string; }

export function MoreNews({ posts }: { posts: Post[] }) {
  const t = useTranslations();
  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">{t("home.moreNews")}</h3>
        <Link href="/news" className="text-sm text-[#1a5632] hover:underline">{t("home.viewAll")}</Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {posts.slice(0, 4).map(item => {
          const isVideo = !!(item.videoId);
          const thumb = resolveImage(item.img || (item.videoId ? `https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg` : null), item.title, item.cat);

          return (
            <Link key={item.slug || item.title} href={item.slug ? `/news/${item.slug}` : "/news"} className="bg-white rounded-xl overflow-hidden border hover:shadow-md transition-shadow group">
              <div className="relative overflow-hidden">
                <img
                  src={thumb}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = resolveImage(null, item.title, item.cat);
                  }}
                  className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {isVideo && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <span className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center shadow">
                      <Play className="w-4 h-4 text-white ml-0.5" fill="currentColor" />
                    </span>
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">{item.title}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-400"><Clock className="w-3 h-3" /><span>{item.time}</span></div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

