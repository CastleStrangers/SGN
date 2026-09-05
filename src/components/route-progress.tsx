"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * RouteProgress
 * شريط تقدم فوري وناعم للتنقل بين الصفحات في Next.js App Router
 * يمنح المستخدم استجابة بصرية في أجزاء من الثانية بمجرد النقر على أي رابط
 */
export function RouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // إخفاء الشريط عند اكتمال الانتقال وتغير المسار
  useEffect(() => {
    if (loading) {
      setProgress(100);
      const timer = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // الاستماع للنقر على روابط الموقع الداخلية
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:") ||
        target.getAttribute("target") === "_blank" ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      try {
        const url = new URL(href, window.location.origin);
        if (url.origin === window.location.origin) {
          const currentUrl = new URL(window.location.href);
          if (url.pathname !== currentUrl.pathname || url.search !== currentUrl.search) {
            setLoading(true);
            setProgress(30);

            // تدرج في سرعة شريط التقدم
            const step1 = setTimeout(() => setProgress(65), 150);
            const step2 = setTimeout(() => setProgress(85), 450);

            return () => {
              clearTimeout(step1);
              clearTimeout(step2);
            };
          }
        }
      } catch {
        // إذا كان الرابط غير صالح نتجاهل
      }
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  if (!loading && progress === 0) return null;

  return (
    <div
      tabIndex={-1}
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none h-[3px] bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-500 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(16,185,129,0.7)]"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
          transition: progress === 100 ? "width 150ms ease-out, opacity 250ms ease-in" : "width 250ms ease-out",
        }}
      />
    </div>
  );
}
