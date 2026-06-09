"use client";
import { useEffect, useState } from "react";
import { Newspaper, Users, Calendar, Eye, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

interface StatsData {
  posts?: number;
  users?: number;
  events?: number;
  totalViews?: number;
}

const defaultStats: StatsData = {
  posts: 0,
  users: 0,
  events: 0,
  totalViews: 0,
};

export function CommunityStats() {
  const t = useTranslations('communityStats');
  const [stats, setStats] = useState<StatsData>(defaultStats);

  const cards = [
    { key: "posts" as const, icon: Newspaper, label: t('articles'), gradient: "from-blue-500 to-blue-600", lineColor: "bg-blue-500", bgLight: "bg-blue-50" },
    { key: "users" as const, icon: Users, label: t('members'), gradient: "from-teal-500 to-emerald-600", lineColor: "bg-teal-500", bgLight: "bg-teal-50" },
    { key: "events" as const, icon: Calendar, label: t('events'), gradient: "from-orange-500 to-amber-600", lineColor: "bg-orange-500", bgLight: "bg-orange-50" },
    { key: "totalViews" as const, icon: Eye, label: t('views'), gradient: "from-pink-500 to-purple-600", lineColor: "bg-pink-500", bgLight: "bg-pink-50" },
  ];

  useEffect(() => {
    fetch("/api/stats")
      .then(r => r.json())
      .then(data => {
        if (data && typeof data === "object") setStats(data);
      })
      .catch(() => {});
  }, []);

  const formatNumber = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(1) + "K";
    return n.toString();
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-10 md:py-14">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
          <TrendingUp className="w-3.5 h-3.5" />
          {t('badge')}
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 relative inline-block">
          {t('title')}
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-purple-500 rounded-full" />
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {cards.map(card => {
          const Icon = card.icon;
          const value = stats[card.key] ?? 0;
          return (
            <div key={card.key} className="bg-white rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1">{formatNumber(value)}</p>
              <p className="text-sm text-gray-500 mb-3">{card.label}</p>
              <div className={`h-1 w-12 rounded-full ${card.lineColor}`} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
