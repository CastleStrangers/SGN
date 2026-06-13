"use client";

import { Bell, Sparkles, X, Loader2 } from "lucide-react";
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
  const t = useTranslations("notifications");
  const locale = useLocale();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then(setNotifications)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: "all" }),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setSummary(null); // Clear summary when marked read
  };

  const getAISummary = async () => {
    setAiLoading(true);
    setSummary(null);
    try {
      const res = await fetch(`/api/notifications/ai-summary?locale=${locale}`);
      const data = await res.json();
      if (data.summary) {
        setSummary(data.summary);
      }
    } catch (err) {
      console.error("Failed to fetch AI summary", err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleNotificationClick = async (id: string) => {
    // Mark as read
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 hover:bg-muted rounded-xl transition-colors cursor-pointer flex items-center justify-center"
        aria-label={t("title")}
        title={t("title")}
      >
        <Bell className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute left-0 lg:left-auto lg:right-0 mt-2 w-80 sm:w-96 bg-card border border-border text-card-foreground rounded-2xl shadow-xl z-50 overflow-hidden max-h-[480px] flex flex-col"
          dir="rtl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-card sticky top-0 z-10">
            <span className="text-sm font-bold text-foreground">{t("title")}</span>
            <div className="flex items-center gap-3">
              {unread > 0 && (
                <button
                  onClick={getAISummary}
                  disabled={aiLoading}
                  className="flex items-center gap-1 px-2.5 py-1.2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50 text-[#1a5632] dark:text-emerald-400 font-bold rounded-lg text-xs transition-colors border border-emerald-100 dark:border-emerald-900/20 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>{t("aiSummary")}</span>
                </button>
              )}
              {unread > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-[#1a5632] dark:text-primary hover:underline font-semibold cursor-pointer"
                >
                  {t("markAllRead")}
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[380px]">
            {/* AI Summary Loading */}
            {aiLoading && (
              <div className="flex items-center gap-2 p-3 bg-muted/30 border border-border border-dashed rounded-xl animate-pulse text-xs text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600 dark:text-primary" />
                <span>{t("aiSummaryLoading")}</span>
              </div>
            )}

            {/* AI Summary Card */}
            {summary && (
              <div className="relative p-3.5 bg-gradient-to-br from-emerald-50/60 to-teal-50/40 dark:from-emerald-950/20 dark:to-teal-950/10 border border-emerald-100/80 dark:border-emerald-900/30 rounded-xl shadow-sm">
                <button
                  onClick={() => setSummary(null)}
                  className="absolute top-2 left-2 p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  title={t("close")}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t("aiSummaryTitle")}</span>
                </div>
                <p className="text-xs text-foreground/90 leading-relaxed pl-4 text-right">
                  {summary}
                </p>
              </div>
            )}

            {/* Empty State */}
            {notifications.length === 0 && (
              <div className="text-center py-10">
                <Bell className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">{t("empty")}</p>
              </div>
            )}

            {/* Notifications List */}
            {notifications.map((n) => {
              const ContentWrapper = n.link ? "a" : "div";
              const wrapperProps = n.link
                ? { href: n.link, onClick: () => handleNotificationClick(n.id) }
                : {};

              return (
                <ContentWrapper
                  key={n.id}
                  {...wrapperProps}
                  className={`block p-3 border border-border rounded-xl transition-all ${
                    !n.read
                      ? "bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-100/50 dark:border-emerald-900/20 font-medium"
                      : "hover:bg-muted/30"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-xs text-foreground font-semibold text-right leading-tight">
                      {n.title}
                    </p>
                    {!n.read && (
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0 mt-1" />
                    )}
                  </div>
                  {n.message && (
                    <p className="text-[11px] text-muted-foreground mt-1 text-right leading-normal">
                      {n.message}
                    </p>
                  )}
                  <p className="text-[9px] text-muted-foreground/60 mt-1.5 text-right font-medium">
                    {formatDate(n.createdAt, locale)}
                  </p>
                </ContentWrapper>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
