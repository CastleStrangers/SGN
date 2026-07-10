export interface SyncSource {
  name: string
  type: "rss" | "webpage" | "api" | "youtube" | "facebook"
  url: string
  enabled: boolean
  category?: string
  /** تاريخ البداية لجلب المنشورات (للـ facebook) */
  since?: string
  /** تفعيل الترجمة التلقائية إلى العربية عن طريق الذكاء الاصطناعي */
  translate?: boolean
}

export interface ExtractedArticle {
  title: string
  content: string
  excerpt: string
  image?: string
  videoId?: string   // YouTube video ID extracted at sync time
  category: string
  tags: string[]
  source: string
  sourceUrl: string
  author: string
  publishedAt: Date
  mediaUrls: string[]
  iframes: string[]
}

export interface SyncResult {
  success: boolean
  source: string
  fetched: number
  new: number
  updated: number
  skipped: number
  errors: string[]
  duration: number
}

export interface SyncConfig {
  sources: SyncSource[]
  dedupField: "sourceUrl" | "contentHash"
  autoCategorize: boolean
  downloadMedia: boolean
  mediaStorage: "local" | "s3" | "r2"
}

export const CATEGORY_MAP: Record<string, string> = {
  "أخبار الجالية": "أخبار الجالية",
  "أخبار هولندا": "أخبار هولندا",
  "أخبار أوروبا": "أخبار أوروبا",
  "اقتصاد وأعمال": "اقتصاد",
  "اقتصاد": "اقتصاد",
  "ثقافة وفن": "ثقافيات",
  "ثقافيات": "ثقافيات",
  "رياضة": "رياضة",
  "تكنولوجيا": "تكنولوجيا",
  "فعاليات": "فعاليات",
  "فعالية": "فعاليات",
  "بيان": "أخبار الجالية",
  "تعزية": "أخبار الجالية",
  "ندوة": "فعاليات",
  "لقاء": "فعاليات",
  "شهر رمضان": "ثقافيات",
  "رمضان": "ثقافيات",
  "صحة": "أخبار هولندا",
  "تعليم": "أخبار هولندا",
  "قوانين": "أخبار هولندا",
  "إقامة": "أخبار هولندا",
  "لجوء": "أخبار هولندا",
}

export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "أخبار الجالية": ["جالية", "سوري", "منظمة", "مجلس إدارة", "المقاطعات", "انتساب", "تطوع", "الجالية"],
  "أخبار هولندا": ["هولندا", "كحولندي", "إقامة", "لجوء", "بلدية", "حكومة", "قانون", "محكمة", "IND", "إندي"],
  "أخبار أوروبا": ["أوروبا", "الاتحاد الأوروبي", "ألماني", "فرنسا", "بلجيكا", "السويد", "اللجوء الأوروبي"],
  "اقتصاد": ["اقتصاد", "أعمال", "شركة", "مشروع", "استثمار", "تجارة", "وظائف", "عمل", "توظيف"],
  "ثقافيات": ["ثقافة", "فن", "معرض", "موسيقى", "كتاب", "أدب", "شعر", "تراث", "هوية", "رمضان", "عيد"],
  "رياضة": ["رياضة", "كرة قدم", "نادي", "بطولة", "مباراة", "سباق"],
  "تكنولوجيا": ["تكنولوجيا", "تقنية", "تطبيق", "برمجة", "ذكاء اصطناعي", "إنترنت"],
  "فعاليات": ["فعالية", "ندوة", "لقاء", "مؤتمر", "ورشة", "محاضرة", "حفل", "مهرجان", "دعوة"],
}

export const DEFAULT_SOURCES: SyncSource[] = [
  {
    name: "sy-nl.org",
    type: "webpage",
    url: "https://www.sy-nl.org/nbdh-aljalyh",
    enabled: true,
  },
  {
    name: "youtube",
    type: "youtube",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCgsEr_WQEnuymVqvTWXqmtw",
    enabled: true,
    category: "فيديوهات",
  },
  {
    name: "facebook-sgn",
    type: "facebook",
    url: "https://www.facebook.com/DeSyrischeGemeenschapInNederland",
    enabled: true,
    category: "أخبار الجالية",
    since: "2026-05-14",
  },
  {
    name: "nos-netherlands",
    type: "rss",
    url: "https://feeds.nos.nl/nosnieuwsalgemeen",
    enabled: true,
    category: "أخبار هولندا",
    translate: false,
  },
  {
    name: "euronews-europe",
    type: "rss",
    url: "https://www.euronews.com/rss?level=theme&name=news",
    enabled: true,
    category: "أخبار أوروبا",
    translate: false,
  },
  {
    name: "euronews-business",
    type: "rss",
    url: "https://www.euronews.com/rss?level=vertical&name=business",
    enabled: true,
    category: "اقتصاد",
    translate: false,
  },
  {
    name: "euronews-culture",
    type: "rss",
    url: "https://www.euronews.com/rss?level=vertical&name=culture",
    enabled: true,
    category: "ثقافيات",
    translate: false,
  },
]
