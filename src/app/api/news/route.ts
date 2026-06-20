import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// الحقول المُرجَعة في قوائم الأخبار (بدون content لتقليل حجم الاستجابة)
const LIST_SELECT = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  image: true,
  videoId: true,
  category: true,
  tags: true,
  source: true,
  featured: true,
  views: true,
  published: true,
  createdAt: true,
  updatedAt: true,
  author: { select: { name: true } },
} as const;

export async function GET(req: NextRequest) {
  // In development mode, trigger a background sync automatically
  if (process.env.NODE_ENV === "development") {
    const lastSyncKey = "last_dev_sync_time";
    const now = Date.now();
    const globalAny = globalThis as any;
    const lastSync = globalAny[lastSyncKey] || 0;
    if (now - lastSync > 5 * 60 * 1000) {
      globalAny[lastSyncKey] = now;
      import("@/lib/sync").then(async ({ runSync }) => {
        console.log("Dev background sync started...");
        const { DEFAULT_SOURCES } = await import("@/lib/sync/types");
        const tempSources = DEFAULT_SOURCES.map(src => {
          // Temporarily enable facebook for dev sync
          if (src.type === "facebook") {
            return { ...src, enabled: true };
          }
          return src;
        });
        await runSync(tempSources);
        console.log("Dev background sync completed!");
      }).catch(err => {
        console.error("Dev background sync failed:", err);
      });
    }
  }

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const slug = searchParams.get("slug");
  const featured = searchParams.get("featured");
  const limit = Math.min(Number(searchParams.get("limit")) || 20, 100);
  const offset = Number(searchParams.get("offset")) || 0;
  const search = searchParams.get("search");
  const video = searchParams.get("video") === "true";

  try {
    // طلب مقال واحد بالـ slug ← نرجع content كاملاً
    if (slug) {
      const post = await prisma.post.findFirst({
        where: { slug, published: true },
        include: { author: { select: { name: true } } },
      });
      if (!post) return NextResponse.json({ error: "not found" }, { status: 404 });
      // تحديث المشاهدات بشكل غير متزامن (لا يحجب الاستجابة)
      prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } }).catch(() => {});
      return NextResponse.json(post);
    }

    // بناء شرط الاستعلام
    const where: any = { published: true, membersOnly: false };
    if (category) where.category = category;
    if (featured === "true") where.featured = true;
    if (video) where.source = "youtube";
    if (search) where.OR = [
      { title: { contains: search } },
      { excerpt: { contains: search } },
    ];

    // جلب القائمة والعدد الإجمالي معاً
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
        select: LIST_SELECT,
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json(
      { posts, total, limit, offset },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("[API/news]", error);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
