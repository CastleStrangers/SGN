"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { MapPin, Globe, Newspaper, User, CreditCard, ExternalLink, Clock, CheckCircle, XCircle } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { formatDate } from "@/lib/date";
import { TopBar } from "@/components/home/top-bar";
import { SiteHeader } from "@/components/home/site-header";

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
  member: { id: string; status: string; createdAt: string; showInPublicProfile: boolean } | null;
}

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations("userProfile");
  const tCard = useTranslations("membershipCard");
  const locale = useLocale();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/user/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { setUser(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

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
              <div className={`rounded-3xl border p-5 mb-6 ${
                user.member.status === "accepted"
                  ? "bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 border-emerald-700"
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
          </>
        )}
      </main>
    </div>
  );
}
