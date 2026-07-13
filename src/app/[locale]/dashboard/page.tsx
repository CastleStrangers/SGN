"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { CheckSquare, Users, MessageSquare, Sparkles, FileText, LayoutDashboard, Calendar, Mail, Eye, MessageCircle, TrendingUp, BarChart3, Activity, UserPlus, Heart, Megaphone, ShieldAlert, Award, Clock, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface Stats {
  tasks: number;
  users: number;
  messages: number;
  events: number;
  subscribers: number;
  posts: number;
  comments: number;
  volunteers: number;
  ads: number;
  totalViews: number;
  totalAdClicks: number;
  membersByStatus: Record<string, number>;
  topPosts: { title: string; views: number; slug: string }[];
  postsByCategory: { name: string; count: number }[];
  commentsByDay: { date: string; count: number }[];
  usersByDay: { date: string; count: number }[];
  membersByDay: { date: string; count: number }[];
}

function MiniBar({ data, label, color }: { data: { date: string; count: number }[]; label: string; color: string }) {
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div>
      {label && <h4 className="text-xs font-medium text-gray-500 mb-2">{label}</h4>}
      <div className="flex items-end gap-1.5 h-28 pt-2">
        {data.slice(-14).map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative cursor-pointer">
            {/* Tooltip on hover */}
            <span className="absolute bottom-full mb-1 scale-0 group-hover:scale-100 transition-transform bg-gray-800 text-white text-[9px] px-1.5 py-0.5 rounded shadow whitespace-nowrap z-10">
              {d.count} ({d.date})
            </span>
            <div 
              className="w-full rounded-t-md hover:opacity-85 transition-opacity" 
              style={{ 
                height: `${(d.count / max) * 100}%`, 
                backgroundColor: color, 
                minHeight: d.count > 0 ? "4px" : "1px" 
              }} 
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[9px] text-gray-400 mt-2 border-t pt-1 border-gray-100">
        <span>{data[0]?.date?.slice(5) || ""}</span>
        <span>{data[data.length - 1]?.date?.slice(5) || ""}</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const t = useTranslations("dashboard");
  const st = useTranslations("dashboard.overviewStats");
  const md = useTranslations("membersDashboard");
  
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<Stats>({
    tasks: 0,
    users: 0,
    messages: 0,
    events: 0,
    subscribers: 0,
    posts: 0,
    comments: 0,
    volunteers: 0,
    ads: 0,
    totalViews: 0,
    totalAdClicks: 0,
    membersByStatus: {},
    topPosts: [],
    postsByCategory: [],
    commentsByDay: [],
    usersByDay: [],
    membersByDay: [],
  });

  useEffect(() => {
    setMounted(true);
    if (status === "authenticated") {
      fetch("/api/dashboard/stats")
        .then(r => r.json())
        .then(setStats)
        .catch((e) => console.error("Failed to load stats:", e));
    }
  }, [status]);

  if (!session) return null;

  const role = (session.user as any)?.role || "member";
  const totalApplications = Object.values(stats.membersByStatus).reduce((a, b) => a + b, 0);

  return (
    <>
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-[#1a5632] to-[#123d24] rounded-3xl p-6 text-white relative overflow-hidden shadow-md border border-emerald-800">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#c8a84e]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-[#c8a84e]" />
              <span className="text-xs uppercase tracking-wider font-bold text-[#c8a84e]">{t("welcome")}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black mb-1" dir="auto">
              {t("welcome") || "مرحباً بك"}، {session.user?.name} 👋
            </h1>
            <p className="text-xs md:text-sm text-emerald-100/90 font-medium">
              لوحة التحكم المتكاملة لإدارة شؤون الجالية السورية في هولندا. إليك ملخص نشاط المنصة لهذا اليوم.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/10 shrink-0 text-center md:text-right">
            <div className="flex items-center gap-2 justify-center md:justify-end text-[#c8a84e] mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-bold">التوقيت المحلي</span>
            </div>
            <p className="text-xs md:text-sm font-bold min-w-[120px]">
              {mounted ? new Date().toLocaleDateString(session.user?.locale || 'ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "..."}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        {[
          { label: t("stats.users"), value: stats.users, icon: Users, color: "bg-emerald-50 text-[#1a5632] hover:bg-emerald-100" },
          { label: st("views"), value: stats.totalViews.toLocaleString(), icon: Eye, color: "bg-rose-50 text-rose-600 hover:bg-rose-100" },
          { label: st("members"), value: totalApplications, icon: UserPlus, color: "bg-sky-50 text-sky-600 hover:bg-sky-100" },
          { label: st("volunteers"), value: stats.volunteers, icon: Heart, color: "bg-purple-50 text-purple-600 hover:bg-purple-100" },
          { label: st("clicks"), value: stats.totalAdClicks.toLocaleString(), icon: Megaphone, color: "bg-teal-50 text-teal-600 hover:bg-teal-100" },
          { label: t("stats.messages"), value: stats.messages, icon: MessageSquare, color: "bg-amber-50 text-amber-600 hover:bg-amber-100" },
          { label: t("stats.tasks"), value: stats.tasks, icon: CheckSquare, color: "bg-blue-50 text-blue-600 hover:bg-blue-100" },
          { label: st("posts"), value: stats.posts, icon: FileText, color: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border p-4 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200 cursor-default group shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 rounded-xl ${s.color.split(' ')[0]} ${s.color.split(' ')[1]} flex items-center justify-center shrink-0 transition-colors`}>
                <s.icon className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-gray-400 font-semibold truncate mb-0.5">{s.label}</p>
              <p className="text-base md:text-lg font-black text-gray-900 leading-none">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs list */}
      <div className="bg-white rounded-2xl border p-2 flex flex-wrap gap-2 shadow-sm">
        {[
          { id: "overview", label: t("overview") || "Overview", icon: LayoutDashboard },
          { id: "content", label: st("engagement") || "Platform Activity", icon: Activity },
          { id: "memberships", label: st("membership") || "Membership", icon: Users },
          { id: "quickActions", label: t("quickActions") || "Quick Actions", icon: Sparkles },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all duration-150 ${
              activeTab === tab.id
                ? "bg-[#1a5632] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab Content */}
      {activeTab === "overview" && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle className="w-4 h-4 text-[#1a5632]" />
              <h3 className="font-bold text-gray-900 text-xs sm:text-sm">{st("commentsChart")}</h3>
            </div>
            <MiniBar data={stats.commentsByDay} label="" color="#1a5632" />
          </div>
          
          <div className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <UserPlus className="w-4 h-4 text-[#c8a84e]" />
              <h3 className="font-bold text-gray-900 text-xs sm:text-sm">{st("usersChart")}</h3>
            </div>
            <MiniBar data={stats.usersByDay} label="" color="#c8a84e" />
          </div>

          <div className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-sky-600" />
              <h3 className="font-bold text-gray-900 text-xs sm:text-sm">{st("membersChart") || "الأعضاء الجدد — آخر ٣٠ يوماً"}</h3>
            </div>
            <MiniBar data={stats.membersByDay} label="" color="#0284c7" />
          </div>
        </div>
      )}

      {/* Content Tab Content */}
      {activeTab === "content" && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Top Viewed Posts */}
          <div className="bg-white rounded-2xl border p-5 shadow-sm lg:col-span-2 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-rose-600" />
                <h3 className="font-bold text-gray-900 text-xs sm:text-sm">{st("topPosts")}</h3>
              </div>
              <Link href="/dashboard/pages" className="text-[10px] font-bold text-[#1a5632] hover:underline flex items-center gap-1">
                {t("managePages")}
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b text-gray-400 font-bold">
                    <th className="pb-2 font-semibold text-right">{st("postTitle")}</th>
                    <th className="pb-2 font-semibold text-left">{st("views")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.topPosts.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="py-4 text-center text-gray-400">لا توجد مقالات بعد</td>
                    </tr>
                  ) : (
                    stats.topPosts.map((post, i) => (
                      <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-2.5 font-semibold text-gray-800 max-w-xs sm:max-w-sm md:max-w-md truncate">
                          {post.title}
                        </td>
                        <td className="py-2.5 text-left font-black text-rose-600">
                          {post.views.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Posts By Category */}
          <div className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-gray-900 text-xs sm:text-sm">{st("byCategory")}</h3>
            </div>
            <div className="space-y-3.5">
              {stats.postsByCategory.length === 0 ? (
                <p className="text-xs text-gray-400 py-4 text-center">لا توجد تصنيفات نشطة</p>
              ) : (
                stats.postsByCategory.map((cat, i) => {
                  const maxCount = Math.max(...stats.postsByCategory.map(c => c.count), 1);
                  const percentage = (cat.count / maxCount) * 100;
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-gray-700">{cat.name}</span>
                        <span className="text-gray-500 font-bold">{cat.count}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Memberships Tab Content */}
      {activeTab === "memberships" && (
        <div className="grid lg:grid-cols-4 gap-4">
          {[
            { status: "accepted", count: stats.membersByStatus.accepted || 0, color: "border-emerald-200 bg-emerald-50/20 text-emerald-800", icon: Award, label: md("accepted") || "مقبول" },
            { status: "pending", count: stats.membersByStatus.pending || 0, color: "border-amber-200 bg-amber-50/20 text-amber-800", icon: Clock, label: md("pending") || "قيد المراجعة" },
            { status: "rejected", count: stats.membersByStatus.rejected || 0, color: "border-rose-200 bg-rose-50/20 text-rose-800", icon: ShieldAlert, label: md("rejected") || "مرفوض" },
            { status: "registered", count: stats.membersByStatus.registered || 0, color: "border-gray-200 bg-gray-50/20 text-gray-800", icon: UserPlus, label: md("registered") || "مسجل" },
          ].map((item) => (
            <div key={item.status} className={`border rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow ${item.color}`}>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{item.label}</span>
                <p className="text-2xl md:text-3xl font-black leading-none mt-0.5">{item.count}</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-white/70 flex items-center justify-center border shadow-sm shrink-0">
                <item.icon className="w-5 h-5" />
              </div>
            </div>
          ))}

          {/* Quick Review Applications */}
          <div className="bg-white rounded-2xl border p-5 shadow-sm lg:col-span-4 flex flex-col sm:flex-row items-center justify-between gap-4 hover:shadow-md transition-shadow">
            <div className="space-y-1 text-center sm:text-right">
              <h4 className="font-bold text-gray-900 text-sm">مراجعة طلبات العضوية المعلقة</h4>
              <p className="text-xs text-gray-500">لديك طلبات انتساب جديدة بحاجة إلى تدقيق وقبول أو رفض لإصدار البطاقات الرقمية.</p>
            </div>
            <Link
              href="/dashboard/members"
              className="bg-[#1a5632] hover:bg-[#123d24] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition-colors shrink-0"
            >
              عرض وتدقيق الطلبات ({stats.membersByStatus.pending || 0})
            </Link>
          </div>
        </div>
      )}

      {/* Quick Actions Tab Content */}
      {activeTab === "quickActions" && (
        <div className="bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-black text-gray-900 mb-4 text-sm">{t("quickActions")}</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: t("addTask"), href: "/dashboard/tasks", icon: CheckSquare },
              { label: t("ai"), href: "/dashboard/ai", icon: Sparkles },
              { label: t("managePages"), href: "/dashboard/pages", icon: FileText, admin: true },
              { label: t("viewSite"), href: "/", icon: LayoutDashboard },
            ].filter(a => a.admin ? (role === "admin" || role === "editor") : true).map((a) => (
              <Link key={a.label} href={a.href} className="flex items-center gap-3 p-4 border rounded-2xl hover:bg-gray-50/50 hover:shadow-sm transition-all group">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#1a5632] flex items-center justify-center group-hover:bg-[#1a5632] group-hover:text-white transition-colors shrink-0">
                  <a.icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-gray-700">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Tasks always visible below */}
      <div className="bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="font-black text-gray-900 mb-2 text-sm">{t("recentTasks")}</h3>
        <p className="text-xs text-gray-400 font-semibold">{t("noTasks")}</p>
      </div>
    </>
  );
}
