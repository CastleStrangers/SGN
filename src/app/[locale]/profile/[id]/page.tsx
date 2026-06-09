"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { MapPin, Globe, Newspaper, Calendar, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { TopBar } from "@/components/home/top-bar";
import { SiteHeader } from "@/components/home/site-header";
import { SiteFooter } from "@/components/home/site-footer";

interface UserProfile {
  id: string; name: string | null; image: string | null; bio: string | null;
  location: string | null; website: string | null; role: string;
  _count: { posts: number };
  posts: { id: string; title: string; slug: string | null; createdAt: string; category: string }[];
  member: { status: string; createdAt: string } | null;
}

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations("userProfile");
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
    <div dir="auto" className="min-h-screen bg-gray-50">
      <TopBar />
      <SiteHeader />
      <main className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-10 h-10 border-4 border-[#1a5632] border-t-transparent rounded-full" />
          </div>
        ) : !user ? (
          <div className="text-center py-20 text-gray-500">
            <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">{t('notFound')}</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-3xl border p-6 md:p-8 mb-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-[#c8a84e] flex items-center justify-center text-white text-4xl font-bold shrink-0 overflow-hidden">
                  {user.image ? <img src={user.image} alt="" className="w-full h-full object-cover" /> : (user.name || "?").charAt(0)}
                </div>
                <div className="flex-1 text-center md:text-right">
                  <h1 className="text-2xl font-bold text-gray-900">{user.name || t('defaultName')}</h1>
                  <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-sm text-gray-500 flex-wrap">
                    {user.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{user.location}</span>}
                    {user.website && <a href={user.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[#1a5632] hover:underline"><Globe className="w-4 h-4" />{user.website.replace(/^https?:\/\//, "")}</a>}
                    <span className="flex items-center gap-1"><Newspaper className="w-4 h-4" />{user._count.posts} {t('article')}</span>
                  </div>
                  {user.bio && <p className="mt-4 text-gray-600 text-sm leading-relaxed">{user.bio}</p>}
                </div>
              </div>
            </div>

            {user.member && (
              <div className="bg-white rounded-2xl border p-4 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">{t('membershipTitle')}</h3>
                    <p className="text-sm text-gray-500 mt-1">{t('submittedSince')} {new Date(user.member.createdAt).toLocaleDateString("ar")}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    user.member.status === "accepted" ? "bg-emerald-100 text-emerald-800" :
                    user.member.status === "rejected" ? "bg-red-100 text-red-800" :
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {user.member.status === "accepted" ? t('accepted') : user.member.status === "rejected" ? t('rejected') : t('pending')}
                  </span>
                </div>
              </div>
            )}

            {user.posts.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">{t('latestArticles')}</h2>
                <div className="space-y-3">
                  {user.posts.map(post => (
                    <Link key={post.id} href={`/news/${post.slug}`} className="block bg-white rounded-2xl border p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 truncate">{post.title}</h3>
                        <span className="text-xs text-gray-400 shrink-0 mr-4">
                          {new Date(post.createdAt).toLocaleDateString("ar")}
                        </span>
                      </div>
                      <span className="text-xs text-[#1a5632] mt-1 block">{post.category}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
