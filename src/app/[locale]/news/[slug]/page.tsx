import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { Calendar, Clock, Eye, User, ChevronRight, ArrowLeft } from "lucide-react";
import { ArticleActions } from "@/components/article-actions";
import { CommentSection } from "@/components/comment-section";
import { formatDate } from "@/lib/date";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ArticleContent } from "@/components/article-content";
import { resolveImage } from "@/lib/image-fallback";
import SafeImage from "@/components/ui/safe-image";

interface Props { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const post = await prisma.post.findFirst({
    where: { slug: decodedSlug, published: true },
    include: { author: { select: { name: true } } },
  });
  if (!post) return { title: "المقال غير موجود" };
  return {
    metadataBase: new URL("https://sy-nl.org"),
    title: post.title,
    description: post.excerpt || post.title,
    openGraph: {
      type: "article", title: post.title, description: post.excerpt || post.title,
      images: post.image ? [{ url: post.image }] : [],
      publishedTime: post.createdAt.toISOString(),
      authors: [post.author?.name || "الجالية السورية"],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt || post.title },
    alternates: { canonical: `https://sy-nl.org/news/${slug}` },
  };
}

export default async function ArticlePage({ params }: Props) {
  const t = await getTranslations('newsDetail');
  const { locale, slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user;
  const post = await prisma.post.findFirst({
    where: { slug: decodedSlug, published: true },
    include: { author: { select: { name: true } } },
  });


  const dir = locale === "ar" ? "rtl" : "ltr";

  if (!post) return (
    <div dir={dir} className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('notFound')}</h2>
        <Link href="/news" className="text-[#1a5632] hover:underline">{t('backToNews')}</Link>
      </div>
    </div>
  );

  const relatedEvent = post.relatedEventId
    ? await prisma.event.findFirst({ where: { id: post.relatedEventId, published: true } })
    : null;
  const relatedTask = post.relatedTaskId
    ? await prisma.task.findUnique({ where: { id: post.relatedTaskId } })
    : null;

  // Increment view count asynchronously to avoid blocking page render/SQL locks
  prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } }).catch(() => {});

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: [{ "@type": "Person", name: post.author?.name || t('defaultAuthor') }],
    publisher: { "@type": "Organization", name: t('publisher') },
    articleSection: post.category,
  };

  const imgSrc = resolveImage(post.image, post.title, post.category);
  const fallbackSrc = resolveImage(null, post.title, post.category);

  return (
    <div dir={dir} className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/news" className="inline-flex items-center gap-2 text-[#1a5632] hover:text-[#0f3d23] mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" />
          <span>{t('backToNews')}</span>
        </Link>

        <article className="bg-white rounded-2xl overflow-hidden border shadow-sm">
          {post.image && !post.content.includes("youtube.com/embed") && (
            <SafeImage src={imgSrc} alt={post.title} fallbackSrc={fallbackSrc} className="w-full aspect-video max-h-[70vh] object-cover" />
          )}

          <div className="p-6 md:p-8">
            <div className="flex items-center flex-wrap gap-2 mb-4">
              <Link href={`/news/category/${post.category.replace(/\s+/g, "-")}`} className="bg-[#1a5632] text-white text-xs font-bold px-2.5 py-1 rounded hover:bg-[#0f3d23] transition-colors">{post.category}</Link>
              {post.tags?.split(",").map((t: string) => (
                <span key={t} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">{t.trim()}</span>
              ))}
            </div>

            <div className="flex items-center flex-wrap gap-4 text-sm text-gray-500 mb-6 pb-6 border-b">
              <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{post.author?.name || t('defaultAuthor')}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{formatDate(post.createdAt, locale)}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{t('readTime', { minutes: Math.ceil(post.content.length / 500) })}</span>
              <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" />{t('views', { count: post.views || 0 })}</span>
            </div>

            <ArticleContent
              originalTitle={post.title}
              originalExcerpt={post.excerpt}
              originalContent={post.content}
              locale={locale}
              isLoggedIn={isLoggedIn}
              membersOnly={post.membersOnly}
              tSource={t('source')}
              postSource={post.source}
            >
              {/* Related Event Card */}
              {relatedEvent && (
                <div className="mt-8 p-6 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-emerald-800 font-bold bg-emerald-100/50 px-2 py-0.5 rounded">{t('relatedEvent')}</span>
                    <h4 className="font-bold text-gray-900 dark:text-white mt-2">{relatedEvent.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">📍 {relatedEvent.location || "—"} | 📅 {formatDate(relatedEvent.date, locale)}</p>
                  </div>
                  <Link
                    href="/events"
                    className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-950 text-white font-bold rounded-xl text-xs transition-colors shrink-0"
                  >
                    {t('relatedEventRegister')}
                  </Link>
                </div>
              )}

              {/* Related Volunteer Task Card */}
              {relatedTask && (
                <div className="mt-8 p-6 bg-amber-50/70 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-900/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-amber-800 font-bold bg-amber-100/50 px-2 py-0.5 rounded">{t('relatedTask')}</span>
                    <h4 className="font-bold text-gray-900 dark:text-white mt-2">{relatedTask.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('relatedTaskDesc')}</p>
                  </div>
                  <Link
                    href="/tasks"
                    className="px-5 py-2.5 bg-amber-800 hover:bg-amber-950 text-white font-bold rounded-xl text-xs transition-colors shrink-0"
                  >
                    {t('volunteerNow')}
                  </Link>
                </div>
              )}
            </ArticleContent>

            <ArticleActions title={post.title} />
            {(!post.membersOnly || isLoggedIn) && <CommentSection postId={post.id} />}
          </div>
        </article>

        <div className="mt-8 text-center">
          <Link href="/news" className="inline-flex items-center gap-2 text-[#1a5632] hover:underline text-sm">
            <ChevronRight className="w-4 h-4" /> {t('allNews')}
          </Link>
        </div>
      </div>
    </div>
  );
}
