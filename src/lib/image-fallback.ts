/**
 * ملف مشترك للصور الاحتياطية (placeholders)
 * SVG محلي خفيف الوزن لا يعتمد على شبكة خارجية
 */
import type { SyntheticEvent } from "react";

/** Helper to wrap text in SVG placeholders */
function splitTextIntoLines(text: string, maxCharPerLine: number = 30): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";
  for (const word of words) {
    if ((currentLine + " " + word).trim().length > maxCharPerLine) {
      if (currentLine) lines.push(currentLine.trim());
      currentLine = word;
    } else {
      currentLine = currentLine + " " + word;
    }
  }
  if (currentLine) lines.push(currentLine.trim());
  return lines;
}

/** Generates a premium, dynamic branded SVG background as a placeholder */
export function getPremiumPlaceholder(title?: string | null, category?: string | null): string {
  const cat = category || "أخبار الجالية";
  const cleanTitle = title ? title.trim() : "";
  const lines = cleanTitle ? splitTextIntoLines(cleanTitle, 35).slice(0, 3) : [];
  
  // Decide colors based on category to make them look distinct and premium
  let fromColor = "#113d22";
  let toColor = "#1a5632";
  let accentColor = "#c8a84e";
  
  const lowerCat = cat.toLowerCase();
  if (lowerCat.includes("هولندا")) {
    fromColor = "#0d2b18";
    toColor = "#113d22";
    accentColor = "#c8a84e";
  } else if (lowerCat.includes("أوروبا")) {
    fromColor = "#0b2545";
    toColor = "#134074";
    accentColor = "#8da9c4";
  } else if (lowerCat.includes("ثقاف") || lowerCat.includes("رمضان") || lowerCat.includes("عيد") || lowerCat.includes("فن")) {
    fromColor = "#451a03";
    toColor = "#78350f";
    accentColor = "#fde047";
  } else if (lowerCat.includes("اقتصاد") || lowerCat.includes("مال")) {
    fromColor = "#111827";
    toColor = "#374151";
    accentColor = "#fbbf24";
  } else if (lowerCat.includes("فيديو") || lowerCat.includes("يوتيوب")) {
    fromColor = "#450a0a";
    toColor = "#991b1b";
    accentColor = "#fca5a5";
  } else if (lowerCat.includes("رياضة")) {
    fromColor = "#064e3b";
    toColor = "#047857";
    accentColor = "#a7f3d0";
  }

  const svgTextLines = lines.map((line, index) => {
    // Render text lines starting from y = 115, spaced by 26px
    const yPos = 115 + index * 26;
    // Escape XML special characters
    const escapedLine = line
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
    return `<text x="200" y="${yPos}" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="600" text-anchor="middle" direction="rtl">${escapedLine}</text>`;
  }).join("\n");

  const categoryText = `<text x="200" y="55" fill="${accentColor}" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="800" letter-spacing="1.5" text-anchor="middle" direction="rtl">${cat.toUpperCase()}</text>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${fromColor};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${toColor};stop-opacity:1" />
      </linearGradient>
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" stroke-width="0.5" stroke-opacity="0.05" />
      </pattern>
    </defs>
    
    <!-- Background -->
    <rect width="400" height="240" fill="url(#grad)" />
    <rect width="400" height="240" fill="url(#grid)" />
    
    <!-- Decorative Circle Ornaments -->
    <circle cx="360" cy="40" r="80" fill="white" opacity="0.03" />
    <circle cx="40" cy="200" r="60" fill="${accentColor}" opacity="0.04" />
    
    <!-- Glassmorphic Card Frame -->
    <rect x="15" y="15" width="370" height="210" rx="16" fill="white" fill-opacity="0.02" stroke="white" stroke-opacity="0.08" stroke-width="1.2" />
    
    <!-- Branded Badge -->
    <rect x="140" y="38" width="120" height="24" rx="12" fill="white" fill-opacity="0.07" stroke="white" stroke-opacity="0.1" stroke-width="1" />
    ${categoryText}

    <!-- Dynamic Title text lines or fallback brand name -->
    ${svgTextLines ? svgTextLines : `<text x="200" y="125" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="700" text-anchor="middle" direction="rtl">الجالية السورية في هولندا</text>`}
    
    <!-- Bottom Monogram/Watermark -->
    <text x="200" y="195" fill="white" fill-opacity="0.25" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700" letter-spacing="2" text-anchor="middle">SGN • SY-NL.ORG</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/** Placeholder SVG خضراء بتصميم الجالية — تُستخدم كاحتياطي افتراضي ثابت */
export const PLACEHOLDER_IMG = getPremiumPlaceholder(null, null);

/** onError handler: يستبدل الصورة المكسورة بالـ placeholder فوراً */
export function handleImgError(e: SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  if (img.src !== PLACEHOLDER_IMG) {
    img.src = PLACEHOLDER_IMG;
  }
}

/** تُرجع رابط الصورة الصحيح أو placeholder عند الفشل */
export function resolveImage(img?: string | null, title?: string | null, category?: string | null): string {
  if (!img) return getPremiumPlaceholder(title, category);
  if (img.startsWith("http") || img.startsWith("/")) return img;
  return getPremiumPlaceholder(title, category);
}
