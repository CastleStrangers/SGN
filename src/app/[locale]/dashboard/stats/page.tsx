"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell,
  ResponsiveContainer, LineChart, Line,
} from "recharts";
import {
  Loader2, Eye, MessageCircle, Users, UserPlus, BarChart3,
  Calendar, Mail, ListTodo, MousePointerClick, Megaphone, HandHeart,
} from "lucide-react";

interface DashboardStats {
  tasks: number; users: number; messages: number; events: number;
  subscribers: number; posts: number; comments: number;
  volunteers: number; ads: number;
  totalViews: number; totalAdClicks: number;
  membersByStatus: Record<string, number>;
  topPosts: { title: string; views: number; slug: string | null }[];
  postsByCategory: { name: string; count: number }[];
  commentsByDay: { date: string; count: number }[];
  usersByDay: { date: string; count: number }[];
  membersByDay: { date: string; count: number }[];
}

const COLORS = ["#1a5632", "#c8a84e", "#dc2626", "#2563eb", "#7c3aed", "#059669", "#d97706", "#0891b2"];

export default function StatsPage() {
  const t = useTranslations("stats");
  const st = useTranslations("dashboard.overviewStats");
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then(r => r.ok ? r.json() : null)
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center py-12">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-800" />
    </div>
  );

  if (!data) return (
    <div className="text-center py-12 text-gray-500">{t("noData")}</div>
  );

  const totalMembers = Object.values(data.membersByStatus).reduce((a, b) => a + b, 0);
  const statusData = Object.entries(data.membersByStatus).map(([k, v]) => ({
    name: k === "pending" ? t("pending") : k === "accepted" ? t("accepted") : t("rejected"),
    value: v,
  }));

  return (
    <div dir="rtl" className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>

      {/* Section 1 — KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xl font-bold text-gray-900">{totalMembers.toLocaleString()}</p>
            <p className="text-xs text-gray-500 truncate">{st("members")}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xl font-bold text-gray-900">{data.totalViews.toLocaleString()}</p>
            <p className="text-xs text-gray-500 truncate">{st("views")}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xl font-bold text-gray-900">{data.comments.toLocaleString()}</p>
            <p className="text-xs text-gray-500 truncate">{st("comments")}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <UserPlus className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xl font-bold text-gray-900">{data.users.toLocaleString()}</p>
            <p className="text-xs text-gray-500 truncate">{st("users")}</p>
          </div>
        </div>
      </div>

      {/* Section 2 — Trends Line Charts */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">{st("engagement")}</h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border p-5">
            <h3 className="font-bold text-gray-900 mb-4 text-sm">{st("membersChart")}</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.membersByDay}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#1a5632" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-2xl border p-5">
            <h3 className="font-bold text-gray-900 mb-4 text-sm">{st("commentsChart")}</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.commentsByDay}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#d97706" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-2xl border p-5">
            <h3 className="font-bold text-gray-900 mb-4 text-sm">{st("usersChart")}</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.usersByDay}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Section 3 — Top Posts Table */}
      <div className="bg-white rounded-2xl border p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-bold text-gray-900">{st("topPosts")}</h2>
        </div>
        {data.topPosts.length === 0 ? (
          <p className="text-sm text-gray-400">{t("noData")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="text-right py-2 pr-0 pl-4 font-medium">{st("postTitle")}</th>
                  <th className="text-left py-2 font-medium">{st("views")}</th>
                </tr>
              </thead>
              <tbody>
                {data.topPosts.slice(0, 10).map((post, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-2 pr-0 pl-4 text-gray-800 truncate max-w-[300px]">{post.title}</td>
                    <td className="py-2 text-gray-600">{post.views.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 4 + 5 — Two-column layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Posts by Category Bar Chart */}
        <div className="bg-white rounded-2xl border p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-gray-700" />
            <h3 className="font-bold text-gray-900 text-sm">{st("byCategory")}</h3>
          </div>
          {data.postsByCategory.length === 0 ? (
            <p className="text-sm text-gray-400">{t("noData")}</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.postsByCategory} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#1a5632" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Membership Overview Pie Chart */}
        <div className="bg-white rounded-2xl border p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-gray-700" />
            <h3 className="font-bold text-gray-900 text-sm">{st("membership")}</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, value }) => `${name} (${value})`}
              >
                {statusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Section 6 — Summary Cards Row */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">{st("summary")}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: st("volunteers"), value: data.volunteers, icon: HandHeart, color: "bg-emerald-50 text-emerald-600" },
            { label: st("events"), value: data.events, icon: Calendar, color: "bg-purple-50 text-purple-600" },
            { label: st("subscribers"), value: data.subscribers, icon: Mail, color: "bg-teal-50 text-teal-600" },
            { label: st("tasks"), value: data.tasks, icon: ListTodo, color: "bg-blue-50 text-blue-600" },
            { label: st("ads"), value: data.ads, icon: Megaphone, color: "bg-amber-50 text-amber-600" },
            { label: st("clicks"), value: data.totalAdClicks, icon: MousePointerClick, color: "bg-rose-50 text-rose-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center shrink-0`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xl font-bold text-gray-900">{s.value.toLocaleString()}</p>
                <p className="text-xs text-gray-500 truncate">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
