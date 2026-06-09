"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const cats = [
  "netherlandsNews", "europeNews", "economy", "culture", "sports", "tech",
];

const colors: Record<string, { c: string; b: string }> = {
  netherlandsNews: { c: "text-blue-600", b: "bg-blue-50" },
  europeNews: { c: "text-purple-600", b: "bg-purple-50" },
  economy: { c: "text-green-600", b: "bg-green-50" },
  culture: { c: "text-amber-600", b: "bg-amber-50" },
  sports: { c: "text-red-600", b: "bg-red-50" },
  tech: { c: "text-indigo-600", b: "bg-indigo-50" },
};

export function CategoryGrid() {
  const t = useTranslations();
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {cats.map(key => {
        const style = colors[key];
        return (
          <Link key={key} href="/news" className={`${style.b} ${style.c} rounded-xl p-3 text-center font-medium text-xs hover:shadow transition-shadow`}>
            {t(`categories.${key}`)}
          </Link>
        );
      })}
    </div>
  );
}
