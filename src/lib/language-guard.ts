/**
 * src/lib/language-guard.ts
 *
 * Strict Language Isolation Guard:
 * Ensures absolute separation between Arabic, English, and Dutch content.
 * 
 * Rules:
 * 1. Arabic (ar): MUST contain Arabic characters. No Dutch/English title may appear.
 * 2. English (en): MUST NOT contain Arabic characters.
 * 3. Dutch (nl): MUST NOT contain Arabic characters.
 */

const ARABIC_CHAR_REGEX = /[\u0600-\u06FF]/;

export function hasArabicCharacters(text: string | null | undefined): boolean {
  if (!text) return false;
  return ARABIC_CHAR_REGEX.test(text);
}

export function isPureLocaleText(text: string | null | undefined, locale: string): boolean {
  if (!text) return true;
  const hasArabic = hasArabicCharacters(text);
  if (locale === "ar") {
    // In Arabic section, content MUST contain Arabic script!
    return hasArabic;
  }
  // In English and Dutch sections, content MUST NOT contain Arabic script!
  return !hasArabic;
}

export const CATEGORY_TRANSLATIONS: Record<string, { ar: string; en: string; nl: string }> = {
  "أخبار الجالية": {
    ar: "أخبار الجالية",
    en: "Community News",
    nl: "Gemeenschapsnieuws",
  },
  "أخبار هولندا": {
    ar: "أخبار هولندا",
    en: "Netherlands News",
    nl: "Nederland Nieuws",
  },
  "أخبار أوروبا": {
    ar: "أخبار أوروبا",
    en: "Europe News",
    nl: "Europa Nieuws",
  },
  "اقتصاد": {
    ar: "اقتصاد",
    en: "Economy",
    nl: "Economie",
  },
  "اقتصاد وأعمال": {
    ar: "اقتصاد وأعمال",
    en: "Economy & Business",
    nl: "Economie & Zaken",
  },
  "ثقافيات": {
    ar: "ثقافيات",
    en: "Culture",
    nl: "Cultuur",
  },
  "ثقافة وفن": {
    ar: "ثقافة وفن",
    en: "Culture & Art",
    nl: "Cultuur & Kunst",
  },
  "فيديوهات": {
    ar: "فيديوهات",
    en: "Videos",
    nl: "Video's",
  },
  "فعاليات": {
    ar: "فعاليات",
    en: "Events",
    nl: "Evenementen",
  },
  "خدمات": {
    ar: "خدمات",
    en: "Services",
    nl: "Diensten",
  },
  "منوعات": {
    ar: "منوعات",
    en: "Variety",
    nl: "Diversen",
  },
  "معرض الصور": {
    ar: "معرض الصور",
    en: "Photo Gallery",
    nl: "Fotogalerij",
  },
  "سياسة": {
    ar: "سياسة",
    en: "Politics",
    nl: "Politiek",
  },
  "رياضة": {
    ar: "رياضة",
    en: "Sports",
    nl: "Sport",
  },
  "تكنولوجيا": {
    ar: "تكنولوجيا",
    en: "Technology",
    nl: "Technologie",
  },
  "صحة": {
    ar: "صحة",
    en: "Health",
    nl: "Gezondheid",
  },
  "أخبار عامة": {
    ar: "أخبار عامة",
    en: "General News",
    nl: "Algemeen Nieuws",
  },
};

export function localizeCategory(category: string, locale: string): string {
  if (!category) return "";
  
  // Direct match in Arabic keys
  if (CATEGORY_TRANSLATIONS[category]) {
    const item = CATEGORY_TRANSLATIONS[category];
    return (item as any)[locale] || item.ar;
  }

  // Reverse search across English or Dutch values
  for (const item of Object.values(CATEGORY_TRANSLATIONS)) {
    if (item.en.toLowerCase() === category.toLowerCase() || 
        item.nl.toLowerCase() === category.toLowerCase() ||
        item.ar === category) {
      return (item as any)[locale] || item.ar;
    }
  }

  return category;
}
