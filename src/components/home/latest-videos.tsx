"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Play, Tv, ArrowLeft, Youtube } from "lucide-react";
import { useTranslations } from "next-intl";

interface Post {
  title: string;
  cat: string;
  img: string | null;
  excerpt: string;
  time: string;
  slug: string;
  videoId?: string;
  content?: string;
}

/** استخرج YouTube video ID من embed URL أو videoId مباشرة */
function extractVideoId(post: Post): string | null {
  if (post.videoId) return post.videoId;
  if (!post.content) return null;
  // من iframe embed src
  const embedMatch = post.content.match(
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/
  );
  if (embedMatch) return embedMatch[1];
  // من رابط يوتيوب عادي
  const watchMatch = post.content.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return watchMatch ? watchMatch[1] : null;
}

/** بطاقة فيديو واحدة — thumbnail ثابتة، iframe فقط عند الضغط */
function VideoCard({ item }: { item: Post }) {
  const t = useTranslations('latestVideos');
  const [playing, setPlaying] = useState(false);
  const videoId = extractVideoId(item);

  if (!videoId) return null;

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

  return (
    <div className="bg-gray-50 rounded-2xl overflow-hidden border hover:shadow-md transition-shadow group flex flex-col h-full">
      {/* منطقة الفيديو */}
      <div className="relative w-full aspect-video bg-black">
        {playing ? (
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            title={item.title}
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="absolute inset-0 w-full h-full group/btn"
            aria-label={t('play', { title: item.title })}
          >
            {/* صورة مصغّرة */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
              alt={item.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-300 group-hover/btn:scale-105"
              onError={(e) => {
                e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              }}
            />
            {/* overlay + أيقونة Play */}
            <span className="absolute inset-0 bg-black/30 group-hover/btn:bg-black/20 transition-colors" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg transform group-hover/btn:scale-110 transition-transform">
                <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
              </span>
            </span>
          </button>
        )}
      </div>

      {/* محتوى البطاقة */}
      <div className="p-3.5 flex flex-col flex-grow justify-between">
        <div>
          <Link
            href={`/news/${item.slug}`}
            className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug hover:text-[#1a5632] hover:underline mb-2 block"
          >
            {item.title}
          </Link>
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
            {item.excerpt}
          </p>
        </div>
        <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t mt-auto">
          <span className="flex items-center gap-1">
            <Youtube className="w-3 h-3 text-red-500" />
            {t('youtubeBadge')}
          </span>
          <span>{item.time}</span>
        </div>
      </div>
    </div>
  );
}

export function LatestVideos({ posts }: { posts: Post[] }) {
  const t = useTranslations('latestVideos');
  const validPosts = posts.filter((p) => extractVideoId(p));

  if (!validPosts.length) return null;

  return (
    <div className="mt-10 bg-white rounded-3xl border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Tv className="w-6 h-6 text-[#1a5632]" />
          <span>{t('title')}</span>
        </h3>
        <Link
          href="/news?category=%D9%81%D9%8A%D8%AF%D9%8A%D9%88%D9%87%D8%A7%D8%AA"
          className="text-sm text-[#1a5632] hover:underline flex items-center gap-1 font-medium"
        >
          <span>{t('viewAll')}</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {validPosts.slice(0, 4).map((item) => (
          <VideoCard key={item.slug} item={item} />
        ))}
      </div>
    </div>
  );
}
