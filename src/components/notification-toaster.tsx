"use client";

import * as Toast from "@radix-ui/react-toast";
import { Bell, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";

export function NotificationToaster() {
  const t = useTranslations('notifications');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch("/api/notifications")
      .then(r => r.json())
      .then(data => {
        const unread = Array.isArray(data) ? data.filter((n: any) => !n.read).length : 0;
        if (unread > 0) { 
          setCount(unread); 
          setOpen(true); 
        }
      })
      .catch(() => {});
  }, []);

  return (
    <Toast.Provider swipeDirection={isRtl ? "left" : "right"}>
      <Toast.Root 
        open={open} 
        onOpenChange={setOpen} 
        className={`bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-850 p-4 rounded-3xl shadow-2xl flex items-center gap-3.5 w-full max-w-[calc(100vw-2rem)] md:max-w-[380px] transition-all duration-300 transform hover:scale-[1.02] ${
          isRtl 
            ? "border-r-4 border-r-[#1a5632] text-right" 
            : "border-l-4 border-l-[#1a5632] text-left"
        }`}
      >
        <div className="w-10 h-10 rounded-full bg-[#1a5632]/10 flex items-center justify-center shrink-0">
          <Bell className="w-5 h-5 text-[#1a5632]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-gray-900 dark:text-gray-100 leading-snug">
            {t('unread', { count })}
          </p>
          <Link 
            href="/dashboard" 
            className="text-[11px] text-[#1a5632] dark:text-emerald-400 font-bold hover:underline mt-1 inline-block" 
            onClick={() => setOpen(false)}
          >
            {t('view')}
          </Link>
        </div>
        <Toast.Close 
          title={t('close') || "إغلاق"} 
          aria-label={t('close') || "إغلاق"}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 hover:bg-gray-100 dark:hover:bg-zinc-850 rounded-xl transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </Toast.Close>
      </Toast.Root>
      
      {/* Dynamic Responsive Viewport */}
      <Toast.Viewport 
        className={`fixed bottom-4 z-[100] flex flex-col p-4 gap-2 w-full max-w-[calc(100vw-2rem)] md:max-w-[420px] m-0 list-none outline-none left-1/2 -translate-x-1/2 md:translate-x-0 ${
          isRtl 
            ? "md:right-4 md:left-auto" 
            : "md:left-4 md:right-auto"
        }`} 
      />
    </Toast.Provider>
  );
}
