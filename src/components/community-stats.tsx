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

// Component for animating numbers counting up smoothly
function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) {
      setDisplayValue(end);
      return;
    }

    const duration = 1500; // Animation duration in milliseconds
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutQuad)
      const easeProgress = progress * (2 - progress);
      const current = Math.floor(easeProgress * (end - start) + start);
      
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(end);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  const formatNumber = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(1) + "K";
    return n.toString();
  };

  return <>{formatNumber(displayValue)}</>;
}

export function CommunityStats() {
  const t = useTranslations('communityStats');
  const [stats, setStats] = useState<StatsData>(defaultStats);

  const cards = [
    { key: "posts" as const, icon: Newspaper, label: t('articles'), gradient: "from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700", lineColor: "bg-blue-500" },
    { key: "users" as const, icon: Users, label: t('members'), gradient: "from-teal-500 to-emerald-600 dark:from-teal-600 dark:to-emerald-700", lineColor: "bg-teal-500" },
    { key: "events" as const, icon: Calendar, label: t('events'), gradient: "from-orange-500 to-amber-600 dark:from-orange-600 dark:to-amber-700", lineColor: "bg-orange-500" },
    { key: "totalViews" as const, icon: Eye, label: t('views'), gradient: "from-pink-500 to-purple-600 dark:from-pink-600 dark:to-purple-700", lineColor: "bg-pink-500" },
  ];

  useEffect(() => {
    fetch("/api/stats")
      .then(r => r.json())
      .then(data => {
        if (data && typeof data === "object") setStats(data);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative overflow-hidden max-w-7xl mx-auto px-4 py-12 md:py-16 my-8 rounded-3xl border border-gray-100 dark:border-gray-800/80 bg-white/60 dark:bg-gray-950/40 backdrop-blur-md shadow-sm">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-80 h-80 bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col items-center text-center mb-12">
        {/* Badge: styled with pulsing dot to show live status */}
        <div className="inline-flex items-center gap-2 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 border border-purple-100/80 dark:border-purple-900/30 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          <TrendingUp className="w-3.5 h-3.5" />
          {t('badge')}
        </div>

        {/* Clean bold heading without underline */}
        <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
          {t('title')}
        </h2>
      </div>

      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map(card => {
          const Icon = card.icon;
          const value = stats[card.key] ?? 0;
          return (
            <div 
              key={card.key} 
              className="group relative bg-white dark:bg-gray-900/40 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100/80 dark:border-gray-800/60 overflow-hidden"
            >
              {/* Subtle gradient glow on card hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none`} />
              
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {/* Visual dot matching card category color */}
                <div className={`h-2 w-2 rounded-full ${card.lineColor} opacity-30 group-hover:opacity-100 transition-opacity`} />
              </div>
              
              <p className="text-3.5xl md:text-4.5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-1">
                <AnimatedNumber value={value} />
              </p>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{card.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
