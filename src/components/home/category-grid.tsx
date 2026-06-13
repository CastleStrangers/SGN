"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const cats = [
  "netherlandsNews", "europeNews", "economy", "culture", "sports", "tech",
];

const colors: Record<string, { c: string; b: string }> = {
  netherlandsNews: { c: "text-blue-600 dark:text-blue-400", b: "bg-blue-50 dark:bg-blue-950/40" },
  europeNews: { c: "text-purple-600 dark:text-purple-400", b: "bg-purple-50 dark:bg-purple-950/40" },
  economy: { c: "text-green-600 dark:text-green-400", b: "bg-green-50 dark:bg-green-950/40" },
  culture: { c: "text-amber-600 dark:text-amber-400", b: "bg-amber-50 dark:bg-amber-950/40" },
  sports: { c: "text-red-600 dark:text-red-400", b: "bg-red-50 dark:bg-red-950/40" },
  tech: { c: "text-indigo-600 dark:text-indigo-400", b: "bg-indigo-50 dark:bg-indigo-950/40" },
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
