"use client";

import { Link } from "@/i18n/routing";
import { Clock, Play } from "lucide-react";
import { PLACEHOLDER_IMG, handleImgError, resolveImage } from "@/lib/image-fallback";

interface Post {
  title: string; cat: string; img: string | null; excerpt: string; author: string; time: string; slug: string;
  videoId?: string;
}

export function HeroSection({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;
  const first = posts[0];
  const rest = posts.slice(1, 3);

  const getThumb = (p: Post) =>
    p.videoId
      ? `https://img.youtube.com/vi/${p.videoId}/hqdefault.jpg`
      : resolveImage(p.img, p.title, p.cat);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* البطاقة الرئيسية */}
      <Link href={first.slug ? `/news/${first.slug}` : "/news"} className="md:col-span-2 group relative rounded-2xl overflow-hidden h-72 md:h-96">
        <img
          src={getThumb(first)}
          alt=""
          loading="lazy"
          decoding="async"
          onError={handleImgError}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {first.videoId && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-14 h-14 rounded-full bg-red-600/90 flex items-center justify-center shadow-xl">
              <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
            </span>
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 p-6 text-white">
          <span className="inline-block bg-[#c8a84e] text-[#1a1a2e] text-xs font-bold px-2 py-1 rounded mb-2">{first.cat}</span>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{first.title}</h2>
          <p className="text-sm text-gray-300 line-clamp-2">{first.excerpt}</p>
          <div className="flex items-center gap-3 mt-3 text-xs text-gray-400"><span>{first.author}</span><span>•</span><Clock className="w-3 h-3" /><span>{first.time}</span></div>
        </div>
      </Link>

      {/* البطاقات الجانبية */}
      {rest.map(f => (
        <Link key={f.slug || f.title} href={f.slug ? `/news/${f.slug}` : "/news"} className="group relative rounded-2xl overflow-hidden h-56">
          <img
            src={getThumb(f)}
            alt=""
            loading="lazy"
            decoding="async"
            onError={handleImgError}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {f.videoId && (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-10 h-10 rounded-full bg-red-600/90 flex items-center justify-center shadow-xl">
                <Play className="w-4 h-4 text-white ml-0.5" fill="currentColor" />
              </span>
            </span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 p-4 text-white">
            <span className="inline-block bg-[#c8a84e] text-[#1a1a2e] text-xs font-bold px-2 py-0.5 rounded mb-1">{f.cat}</span>
            <h3 className="text-base font-bold leading-snug">{f.title}</h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-400"><Clock className="w-3 h-3" /><span>{f.time}</span></div>
          </div>
        </Link>
      ))}
    </div>
  );
}
