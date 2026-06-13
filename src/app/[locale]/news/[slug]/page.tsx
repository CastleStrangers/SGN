import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { Calendar, Clock, Eye, User, ChevronRight, ArrowLeft, Lock } from "lucide-react";
import { ArticleActions } from "@/components/article-actions";
import { CommentSection } from "@/components/comment-section";
import { formatDate } from "@/lib/date";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

interface Props { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const post = await prisma.post.findUnique({ where: { slug: decodedSlug, published: true } });
  if (!post) return { title: "المقال غير موجود" };
  return {
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
  const post = await prisma.post.findUnique({
    where: { slug: decodedSlug, published: true },
    include: { author: { select: { name: true } } },
  });

  if (!post) return (
    <div dir="rtl" className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('notFound')}</h2>
        <Link href="/news" className="text-[#1a5632] hover:underline">{t('backToNews')}</Link>
      </div>
    </div>
  );

  const relatedEvent = post.relatedEventId
    ? await prisma.event.findUnique({ where: { id: post.relatedEventId, published: true } })
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

  const contentHtml = post.content.replace(/\n/g, "<br/>");

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/news" className="inline-flex items-center gap-2 text-[#1a5632] hover:text-[#0f3d23] mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" />
          <span>{t('backToNews')}</span>
        </Link>

        <article className="bg-white rounded-2xl overflow-hidden border shadow-sm">
          {post.image && !post.content.includes("youtube.com/embed") && (
            <img src={post.image} alt={post.title} loading="lazy" decoding="async" className="w-full aspect-video max-h-[70vh] object-cover" />
          )}

          <div className="p-6 md:p-8">
            <div className="flex items-center flex-wrap gap-2 mb-4">
              <Link href={`/news/category/${post.category.replace(/\s+/g, "-")}`} className="bg-[#1a5632] text-white text-xs font-bold px-2.5 py-1 rounded hover:bg-[#0f3d23] transition-colors">{post.category}</Link>
              {post.tags?.split(",").map((t: string) => (
                <span key={t} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">{t.trim()}</span>
              ))}
            </div>

            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h1>

            <div className="flex items-center flex-wrap gap-4 text-sm text-gray-500 mb-6 pb-6 border-b">
              <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{post.author?.name || t('defaultAuthor')}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{formatDate(post.createdAt, locale)}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{t('readTime', { minutes: Math.ceil(post.content.length / 500) })}</span>
              <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" />{t('views', { count: post.views || 0 })}</span>
            </div>

            {post.excerpt && (
              <p className="text-lg text-gray-600 mb-6 font-medium leading-relaxed border-r-4 border-[#c8a84e] pr-4">{post.excerpt}</p>
            )}            {post.membersOnly && !isLoggedIn ? (
              <div className="relative mt-4 overflow-hidden rounded-2xl border border-gray-100 p-6 md:p-8 bg-gray-50/50">
                {/* Blurred preview text */}
                <div className="text-gray-400 leading-8 text-base md:text-lg space-y-4 select-none blur-[5px] pointer-events-none opacity-30">
                  <p>هذا النص مخفي لحماية حقوق النشر وتصفح الأعضاء المسجلين فقط في الجالية السورية في هولندا. يرجى الاشتراك أو تسجيل الدخول للمتابعة وقراءة المزيد من التفاصيل والأنشطة المتعلقة بهذا الخبر...</p>
                  <p>هذا النص مخفي لحماية حقوق النشر وتصفح الأعضاء المسجلين فقط في الجالية السورية في هولندا. يرجى الاشتراك أو تسجيل الدخول للمتابعة وقراءة المزيد من التفاصيل والأنشطة المتعلقة بهذا الخبر...</p>
                </div>
                
                {/* Lock Overlay Card */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-white via-white/95 to-white/30 pt-16 text-center">
                  <div className="w-14 h-14 rounded-full bg-[#1a5632]/10 flex items-center justify-center text-[#1a5632] mb-4 shadow-inner border border-[#1a5632]/5">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">هذا الخبر مخصص للأعضاء فقط</h3>
                  <p className="text-gray-500 text-sm max-w-sm mb-6 leading-relaxed px-4">
                    أنت تقرأ مقدمة الخبر. لمتابعة قراءة الخبر بالكامل والمشاركة بالتعليقات، يرجى تسجيل الدخول أو إنشاء حساب مجاني.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs px-4">
                    <Link
                      href="/login"
                      className="flex-1 bg-[#1a5632] hover:bg-[#0f3d23] text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md shadow-[#1a5632]/20 text-center flex items-center justify-center gap-1.5"
                    >
                      <span>تسجيل الدخول</span>
                      <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/signup"
                      className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 px-4 rounded-xl text-sm transition-all border border-gray-200 text-center"
                    >
                      إنشاء حساب مجاني
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="text-gray-800 leading-8 text-base md:text-lg space-y-4" dangerouslySetInnerHTML={{ __html: contentHtml }} />

                {post.source && (
                  <p className="mt-8 text-sm text-gray-400 pt-4 border-t">{t('source')} {post.source}</p>
                )}

                {/* Related Event Card */}
                {relatedEvent && (
                  <div className="mt-8 p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-emerald-800 font-bold bg-emerald-100/50 px-2 py-0.5 rounded">{t('relatedEvent')}</span>
                      <h4 className="font-bold text-gray-900 mt-2">{relatedEvent.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">📍 {relatedEvent.location || "—"} | 📅 {formatDate(relatedEvent.date, locale)}</p>
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
                  <div className="mt-8 p-6 bg-amber-50/70 rounded-2xl border border-amber-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-amber-800 font-bold bg-amber-100/50 px-2 py-0.5 rounded">{t('relatedTask')}</span>
                      <h4 className="font-bold text-gray-900 mt-2">{relatedTask.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{t('relatedTaskDesc')}</p>
                    </div>
                    <Link
                      href="/tasks"
                      className="px-5 py-2.5 bg-amber-800 hover:bg-amber-950 text-white font-bold rounded-xl text-xs transition-colors shrink-0"
                    >
                      {t('volunteerNow')}
                    </Link>
                  </div>
                )}
              </>
            )}

            <ArticleActions title={post.title} />
            {(!post.membersOnly || isLoggedIn) && <CommentSection postId={post.id} />}

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
