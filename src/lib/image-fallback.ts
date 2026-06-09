/**
 * ملف مشترك للصور الاحتياطية (placeholders)
 * SVG محلي خفيف الوزن لا يعتمد على شبكة خارجية
 */
import type { SyntheticEvent } from "react";

/** Placeholder SVG خضراء بتصميم الجالية — تُستخدم عند فشل تحميل أي صورة */
export const PLACEHOLDER_IMG = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240">
    <rect width="400" height="240" fill="#f0faf4"/>
    <rect x="140" y="70" width="120" height="100" rx="12" fill="#1a5632" opacity="0.12"/>
    <circle cx="200" cy="100" r="24" fill="#1a5632" opacity="0.2"/>
    <path d="M188 100 l18-10 v20 z" fill="#1a5632" opacity="0.35"/>
    <line x1="155" y1="148" x2="245" y2="148" stroke="#1a5632" stroke-width="3" stroke-linecap="round" opacity="0.18"/>
    <line x1="168" y1="162" x2="232" y2="162" stroke="#1a5632" stroke-width="2" stroke-linecap="round" opacity="0.12"/>
  </svg>`
)}`;

/** onError handler: يستبدل الصورة المكسورة بالـ placeholder فوراً */
export function handleImgError(e: SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  if (img.src !== PLACEHOLDER_IMG) {
    img.src = PLACEHOLDER_IMG;
  }
}

/** تُرجع رابط الصورة الصحيح أو placeholder عند الفشل */
export function resolveImage(img?: string | null): string {
  if (!img) return PLACEHOLDER_IMG;
  if (img.startsWith("http") || img.startsWith("/")) return img;
  return PLACEHOLDER_IMG;
}
