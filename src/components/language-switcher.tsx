"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/routing";
import { Globe } from "lucide-react";
import { useState } from "react";

export default function LanguageSwitcher() {
  const t = useTranslations('languageSwitcher');
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const LOCALES = {
    ar: { label: t('arabic'), dir: "rtl" as const },
    en: { label: t('english'), dir: "ltr" as const },
    nl: { label: t('dutch'), dir: "ltr" as const },
  };

  function switchLang(lang: string) {
    setOpen(false);
    const expires = new Date(Date.now() + 365 * 864e5).toUTCString();
    document.cookie = `NEXT_LOCALE=${lang}; expires=${expires}; path=/; SameSite=Lax`;
    const prefix = lang === "ar" ? "" : `/${lang}`;
    window.location.href = `${prefix}${pathname}`;
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1 px-2.5 py-1.5 text-xs border rounded-lg hover:bg-gray-50">
        <Globe className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{LOCALES[locale as keyof typeof LOCALES]?.label || t('arabic')}</span>
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 bg-white border rounded-lg shadow-lg py-1 min-w-[120px] z-50">
          {Object.entries(LOCALES).map(([k, v]) => (
            <button
              key={k}
              onClick={() => switchLang(k)}
              className={`block w-full text-right px-4 py-2 text-sm hover:bg-gray-50 ${locale === k ? "text-[#1a5632] font-bold" : "text-gray-700"}`}
            >
              {v.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
