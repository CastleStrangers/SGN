"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Sparkles, Clock, TrendingUp, Heart, Play } from "lucide-react";
import { Facebook, Instagram, Youtube, Twitter } from "lucide-react";
import { TikTok } from "@/components/tiktok-icon";
import { PLACEHOLDER_IMG, handleImgError, resolveImage } from "@/lib/image-fallback";
import { SurveyWidget } from "@/components/survey";
import { PrayerTimesWidget } from "@/components/home/prayer-times";

interface Post { title: string; img: string | null; time: string; slug: string; videoId?: string; cat?: string; }

const followItems = [
  { icon: Facebook, label: "sidebar.follow.facebook", color: "bg-blue-600", href: "https://www.facebook.com/profile.php?id=61584301535331" },
  { icon: Instagram, label: "sidebar.follow.instagram", color: "bg-pink-600", href: "https://www.instagram.com/sgn_syria/" },
  { icon: Youtube, label: "sidebar.follow.youtube", color: "bg-red-600", href: "https://www.youtube.com/@SY-NL" },
  { icon: Twitter, label: "sidebar.follow.twitter", color: "bg-sky-500", href: "https://x.com/SGN2098551" },
  { icon: TikTok, label: "sidebar.follow.tiktok", color: "bg-black", href: "https://www.tiktok.com/@sgn_syria" },
];

const statsItems = [
  { key: "sidebar.stats.members", value: "+2,500" },
  { key: "sidebar.stats.events", value: "48" },
  { key: "sidebar.stats.volunteers", value: "320" },
  { key: "sidebar.stats.years", value: "5" },
];

export function Sidebar({ latest }: { latest: Post[] }) {
  const t = useTranslations();
  return (
    <aside className="space-y-6">
      <div className="bg-gradient-to-br from-[#1a5632] to-[#0f3d23] text-white rounded-2xl p-6 text-center">
        <Sparkles className="w-8 h-8 text-[#c8a84e] mx-auto mb-3" />
        <h3 className="font-bold text-lg mb-2">{t("sidebar.join.title")}</h3>
        <p className="text-sm text-gray-300 mb-4">{t("sidebar.join.desc")}</p>
        <a href="https://docs.google.com/forms/d/e/1FAIpQLSckV1utDGcCXjB4Lg8p9hiYtJjgHwUJyTZb2waISC9dBZdKJw/viewform" target="_blank" rel="noopener noreferrer" className="inline-block bg-[#c8a84e] hover:bg-[#b8973f] text-[#1a1a2e] font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">{t("sidebar.join.button")}</a>
      </div>

      <SurveyWidget />

      <PrayerTimesWidget />

      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="bg-[#1a5632] text-white px-4 py-3 font-bold text-sm">{t("sidebar.latestTitle")}</div>
        <div className="divide-y">
          {latest.slice(0, 4).map((item, index) => (
            <Link key={`${item.slug || item.title}-${index}`} href={item.slug ? `/news/${item.slug}` : "/news"} className="flex gap-3 p-3 hover:bg-gray-50 transition-colors">
              <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={resolveImage(item.img || (item.videoId ? `https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg` : null), item.title, item.cat)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = resolveImage(null, item.title, item.cat);
                  }}
                  className="w-full h-full object-cover"
                />
                {item.videoId && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="bg-[#1a5632] text-white p-1 rounded-full shadow-lg">
                      <Play className="w-2 h-2 fill-current" />
                    </div>
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-900 font-medium line-clamp-2 leading-snug">{item.title}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-400"><Clock className="w-3 h-3" /><span>{item.time}</span></div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-4">
        <h4 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-[#1a5632]" />{t("sidebar.stats.title")}</h4>
        <div className="grid grid-cols-2 gap-3">
          {statsItems.map(s => (
            <div key={s.key} className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-[#1a5632]">{s.value}</p>
              <p className="text-xs text-gray-500">{t(s.key)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-4">
        <h4 className="font-bold text-gray-900 text-sm mb-3">{t("sidebar.follow.title")}</h4>
        <div className="grid grid-cols-2 gap-2">
          {followItems.map(s => (
            <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className={`${s.color} text-white rounded-xl p-3 flex items-center gap-2 text-xs font-medium hover:opacity-90 transition-opacity`}><s.icon className="w-4 h-4" />{t(s.label)}</a>
          ))}
        </div>
      </div>

      <a href="https://docs.google.com/forms/d/e/1FAIpQLSckV1utDGcCXjB4Lg8p9hiYtJjgHwUJyTZb2waISC9dBZdKJw/viewform" target="_blank" rel="noopener noreferrer" className="block bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center hover:shadow transition-shadow">
        <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
        <p className="text-sm font-bold text-gray-900">{t("sidebar.volunteer.title")}</p>
        <p className="text-xs text-gray-600">{t("sidebar.volunteer.desc")}</p>
      </a>
    </aside>
  );
}
