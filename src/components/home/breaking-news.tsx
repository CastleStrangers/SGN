"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export function BreakingNews() {
  const t = useTranslations();
  const [items, setItems] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    fetch("/api/news?limit=20")
      .then(r => r.json())
      .then(data => {
        const titles = (data.posts || []).map((p: any) => p.title);
        setItems(titles.length ? titles : [t("breaking.fallback")]);
      })
      .catch(() => setItems([t("breaking.fallback")]));
  }, []);

  useEffect(() => {
    if (!items.length) return;
    const timer = setInterval(() => setIdx(i => (i + 1) % items.length), 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  if (!items.length) return null;

  return (
    <div className="bg-red-600 text-white">
      <div className="max-w-7xl mx-auto px-4 h-10 flex items-center gap-3">
        <span className="bg-white text-red-600 px-2 py-0.5 rounded text-xs font-bold flex-shrink-0">{t("breaking.label")}</span>
        <div className="flex-1 overflow-hidden relative h-10 flex items-center">
          <p className="animate-marquee whitespace-nowrap text-sm font-medium">{items[idx]}</p>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button onClick={() => setIdx(i => (i - 1 + items.length) % items.length)} className="p-1 hover:bg-red-700 rounded"><ChevronRight className="w-4 h-4" /></button>
          <button onClick={() => setIdx(i => (i + 1) % items.length)} className="p-1 hover:bg-red-700 rounded"><ChevronLeft className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
}
