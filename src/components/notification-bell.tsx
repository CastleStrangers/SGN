"use client";

import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { formatDate } from "@/lib/date";

interface Notification {
  id: string;
  title: string;
  message: string | null;
  link: string | null;
  read: boolean;
  createdAt: string;
}

export function NotificationBell() {
  const t = useTranslations('notifications');
  const locale = useLocale();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifications.filter(n => !n.read).length;

  useEffect(() => {
    fetch("/api/notifications").then(r => r.json()).then(setNotifications).catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = async () => {
    await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: "all" }) });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <Bell className="w-5 h-5 text-gray-600" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-80 bg-white border rounded-2xl shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between p-3 border-b sticky top-0 bg-white">
            <span className="text-sm font-bold text-gray-900">{t('title')}</span>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-xs text-[#1a5632] hover:underline">{t('markAllRead')}</button>
            )}
          </div>
          {notifications.length === 0 && (
            <p className="text-center text-gray-400 py-8 text-sm">{t('empty')}</p>
          )}
          {notifications.map(n => (
            <div key={n.id} className={`p-3 border-b last:border-0 hover:bg-gray-50 transition-colors ${!n.read ? "bg-blue-50" : ""}`}>
              <p className="text-sm font-medium text-gray-900">{n.title}</p>
              {n.message && <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>}
              <p className="text-[10px] text-gray-400 mt-1">{formatDate(n.createdAt, locale)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
