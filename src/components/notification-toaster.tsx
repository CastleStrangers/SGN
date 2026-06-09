"use client";

import * as Toast from "@radix-ui/react-toast";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export function NotificationToaster() {
  const t = useTranslations('notifications');
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch("/api/notifications")
      .then(r => r.json())
      .then(data => {
        const unread = Array.isArray(data) ? data.filter((n: any) => !n.read).length : 0;
        if (unread > 0) { setCount(unread); setOpen(true); }
      })
      .catch(() => {});
  }, []);

  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root open={open} onOpenChange={setOpen} className="fixed bottom-6 left-6 z-[100] bg-white border rounded-2xl shadow-xl p-4 flex items-center gap-3 min-w-[280px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out">
        <div className="w-10 h-10 rounded-full bg-[#1a5632]/10 flex items-center justify-center">
          <Bell className="w-5 h-5 text-[#1a5632]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900">{t('unread', { count })}</p>
          <Link href="/dashboard" className="text-xs text-[#1a5632] hover:underline" onClick={() => setOpen(false)}>{t('view')}</Link>
        </div>
        <Toast.Close className="text-gray-400 hover:text-gray-600 text-lg leading-none">&times;</Toast.Close>
      </Toast.Root>
      <Toast.Viewport />
    </Toast.Provider>
  );
}
