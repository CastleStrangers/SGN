"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { MapPin, Globe, Newspaper, User, CreditCard, ExternalLink, Clock, CheckCircle, XCircle, Sparkles, ChevronRight, Loader2, Shield, Briefcase, Star, Send, MessageCircle } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { formatDate } from "@/lib/date";
import { TopBar } from "@/components/home/top-bar";
import { useSession } from "next-auth/react";
import { SiteHeader } from "@/components/home/site-header";

interface RecommendedTask {
  id: string;
  title: string;
  description: string;
  matchReason: string;
}

interface UserProfile {
  id: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  role: string;
  _count: { posts: number };
  posts: { id: string; title: string; slug: string | null; createdAt: string; category: string }[];
  member: { id: string; status: string; createdAt: string; showInPublicProfile: boolean; isServiceProvider?: boolean; serviceDescription?: string | null; userId?: string | null } | null;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  reviewer: { name: string | null; image: string | null };
}

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const t = useTranslations("userProfile");
  const tm = useTranslations("memberProfilePage");
  const tCard = useTranslations("membershipCard");
  const locale = useLocale();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [recommendedTasks, setRecommendedTasks] = useState<RecommendedTask[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/user/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { setUser(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (user?.member?.status === "accepted") {
      setLoadingTasks(true);
      fetch("/api/member/recommendations")
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data?.tasks) setRecommendedTasks(data.tasks);
          setLoadingTasks(false);
        })
        .catch(() => setLoadingTasks(false));
    }

    if (user?.member?.isServiceProvider) {
      fetch(`/api/members/services/${user.member.id}/reviews`)
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data?.reviews) setReviews(data.reviews);
        })
        .catch(() => {});
    }
  }, [user?.member?.status, user?.member?.isServiceProvider, user?.member?.id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.member?.id) return;
    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/members/services/${user.member.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });
      if (res.ok) {
        const data = await res.json();
        setReviews([data.review, ...reviews]);
        setComment("");
        setRating(5);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to submit review");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div dir="auto" className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <TopBar />
      <SiteHeader />
      <main className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-10 h-10 border-4 border-emerald-700 border-t-transparent rounded-full" />
          </div>
        ) : !user ? (
          <div className="text-center py-20 text-slate-500">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-lg font-medium">{t('notFound')}</p>
          </div>
        ) : (
          <>
            {/* Profile header card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 mb-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar */}
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center text-white text-4xl font-black shrink-0 overflow-hidden shadow-md">
                  {user.image
                    ? <img src={user.image} alt="" className="w-full h-full object-cover" />
                    : (user.name || "?").charAt(0)
                  }
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-start">
                  <h1 className="text-2xl font-black text-slate-900">{user.name || t('defaultName')}</h1>
                  <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-sm text-slate-500 flex-wrap">
                    {user.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {user.location}
                      </span>
                    )}
                    {user.website && (
                      <a href={user.website} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-emerald-700 hover:underline">
                        <Globe className="w-3.5 h-3.5" />
                        {user.website.replace(/^https?:\/\//, "")}
                      </a>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Newspaper className="w-3.5 h-3.5" />
                      {user._count.posts} {t('article')}
                    </span>
                  </div>
                  {user.bio && (
                    <p className="mt-3 text-slate-600 text-sm leading-relaxed max-w-lg">{user.bio}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Membership status card */}
            {user.member && (
              <>
                <div className={`rounded-3xl border p-5 mb-6 ${
                  user.member.status === "accepted"
                    ? "bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 border-emerald-700 shadow-xl shadow-emerald-900/20"
                    : "bg-white border-slate-100 shadow-sm"
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start gap-3">
                      {/* Status icon */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        user.member.status === "accepted" ? "bg-white/10" :
                        user.member.status === "rejected" ? "bg-red-100" : "bg-yellow-100"
                      }`}>
                        {user.member.status === "accepted"
                          ? <CheckCircle className="w-5 h-5 text-emerald-300" />
                          : user.member.status === "rejected"
                          ? <XCircle className="w-5 h-5 text-red-500" />
                          : <Clock className="w-5 h-5 text-yellow-600" />
                        }
                      </div>
                      <div>
                        <h3 className={`font-bold ${user.member.status === "accepted" ? "text-white" : "text-slate-900"}`}>
                          {t('membershipTitle')}
                        </h3>
                        <p className={`text-sm mt-0.5 ${user.member.status === "accepted" ? "text-emerald-300/80" : "text-slate-500"}`}>
                          {t('submittedSince')} {formatDate(user.member.createdAt, locale)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Status badge */}
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        user.member.status === "accepted" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
                        user.member.status === "rejected" ? "bg-red-100 text-red-700" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {user.member.status === "accepted" ? t('accepted') :
                         user.member.status === "rejected" ? t('rejected') : t('pending')}
                      </span>

                      {/* Digital card button — only for accepted + public profile */}
                      {user.member.status === "accepted" && user.member.showInPublicProfile && (
                        <Link
                          href={`/membership-card/${user.member.id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold transition-all hover:scale-105"
                        >
                          <CreditCard className="w-4 h-4" />
                          {tCard('cardTitle')}
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {/* Secure Vault Quick Access */}
                <div className="bg-emerald-700/5 border border-emerald-700/10 rounded-3xl p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-700 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-900/20">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">{tm("vaultTitle") || "المخزن الآمن"}</h3>
                      <p className="text-xs text-slate-500 max-w-sm">{tm("vaultDesc")}</p>
                    </div>
                  </div>
                  <Link
                    href={`/profile/${id}/vault`}
                    className="w-full md:w-auto px-6 py-3 bg-white hover:bg-slate-50 text-emerald-800 border border-emerald-200 rounded-2xl text-sm font-black transition-all shadow-sm hover:shadow-md"
                  >
                    {t("openVault") || "فتح المخزن"}
                  </Link>
                </div>

                {/* Professional Services Badge */}
                {user.member.isServiceProvider && (
                  <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6 mb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-amber-900/20">
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-black text-amber-900 text-lg uppercase tracking-tight">{tm("isServiceProvider") || "مزود خدمات مهنية"}</h3>
                        <p className="text-sm text-amber-800 mt-1 leading-relaxed">{user.member.serviceDescription}</p>
                      </div>
                    </div>
                    {currentUserId !== user.id && (
                      <Link
                        href={`/messages?with=${user.id}`}
                        className="mt-4 md:mt-0 flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl text-sm font-bold shadow-lg shadow-amber-900/20 transition-all hover:scale-105"
                      >
                        <MessageCircle className="w-5 h-5" />
                        دردشة مباشرة
                      </Link>
                    )}
                  </div>
                )}

                {/* AI Recommendations */}
                {user.member.status === "accepted" && (
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      <h2 className="font-bold text-slate-900">{t('recommendedTasks') || "مهام تطوعية مقترحة لك"}</h2>
                    </div>

                    {loadingTasks ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                      </div>
                    ) : recommendedTasks.length > 0 ? (
                      <div className="grid sm:grid-cols-2 gap-3">
                        {recommendedTasks.map((task) => (
                          <div key={task.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all group">
                            <h3 className="font-bold text-sm text-slate-900 mb-1 group-hover:text-emerald-700">{task.title}</h3>
                            <p className="text-xs text-emerald-600 font-medium italic mb-2">✨ {task.matchReason}</p>
                            <Link href="/tasks" className="text-[10px] uppercase tracking-wider font-bold text-slate-400 hover:text-emerald-600 flex items-center gap-1">
                              {t('viewDetails') || "عرض التفاصيل"}
                              <ChevronRight className="w-3 h-3" />
                            </Link>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 text-center py-2">{t('noRecommendations') || "لا توجد مهام مقترحة حالياً"}</p>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Latest articles */}
            {user.posts.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-3 px-1">{t('latestArticles')}</h2>
                <div className="space-y-2">
                  {user.posts.map(post => (
                    <Link
                      key={post.id}
                      href={`/news/${post.slug}`}
                      className="flex items-center justify-between bg-white rounded-2xl border border-slate-100 hover:border-emerald-200 p-4 hover:shadow-sm transition-all group"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                          {post.title}
                        </h3>
                        <span className="text-xs text-emerald-700 mt-0.5 block">{post.category}</span>
                      </div>
                      <span className="text-xs text-slate-400 shrink-0 ms-4">
                        {formatDate(post.createdAt, locale)}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Service Reviews Section */}
            {user.member?.isServiceProvider && (
              <div className="mt-8 border-t pt-8">
                <h2 className="text-xl font-black text-slate-900 mb-6 px-1 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  تقييمات وأراء الأعضاء
                </h2>

                {/* Review Form */}
                {user.member.userId !== currentUserId && (
                  <div className="bg-white rounded-3xl border border-slate-100 p-6 mb-8 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4 text-sm">أضف تقييمك للخدمة</h3>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setRating(s)}
                            className="focus:outline-none transition-transform hover:scale-110"
                          >
                            <Star className={`w-6 h-6 ${s <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="اكتب تجربتك مع مزود الخدمة..."
                        className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 min-h-[100px] outline-none"
                      />
                      <button
                        type="submit"
                        disabled={submittingReview || !comment.trim()}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-sm font-bold transition-all disabled:opacity-50"
                      >
                        {submittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        إرسال التقييم
                      </button>
                    </form>
                  </div>
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed">
                      <p className="text-slate-400 text-sm italic">لا توجد تقييمات بعد. كن أول من يقيّم!</p>
                    </div>
                  ) : (
                    reviews.map((rev) => (
                      <div key={rev.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border">
                              {rev.reviewer.image ? <img src={rev.reviewer.image} alt="" className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-slate-300" />}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{rev.reviewer.name || "عضو"}</p>
                              <p className="text-[10px] text-slate-400">{formatDate(rev.createdAt, locale)}</p>
                            </div>
                          </div>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} className={`w-3 h-3 ${s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
