"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { CheckSquare, Users, MessageSquare, Sparkles, FileText, LayoutDashboard, Calendar, Mail, Eye, MessageCircle, TrendingUp, BarChart3, Activity, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";

interface Stats {
  tasks: number; users: number; messages: number; events: number;
  subscribers: number; posts: number; comments: number; totalViews: number;
  commentsByDay: { date: string; count: number }[];
  usersByDay: { date: string; count: number }[];
}

function MiniBar({ data, label, color }: { data: { date: string; count: number }[]; label: string; color: string }) {
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div>
      <h4 className="text-xs font-medium text-gray-500 mb-2">{label}</h4>
      <div className="flex items-end gap-0.5 h-24">
        {data.slice(-14).map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
            <span className="text-[9px] text-gray-400">{d.count || ""}</span>
            <div className="w-full rounded-t" style={{ height: `${(d.count / max) * 100}%`, backgroundColor: color, minHeight: d.count > 0 ? "4px" : "0" }} />
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[9px] text-gray-400 mt-1">
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
  const [stats, setStats] = useState<Stats>({
    tasks: 0, users: 0, messages: 0, events: 0, subscribers: 0,
    posts: 0, comments: 0, totalViews: 0,
    commentsByDay: [], usersByDay: [],
  });

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/dashboard/stats").then(r => r.json()).then(setStats).catch(() => {});
    }
  }, [status]);

  if (!session) return null;

  const role = (session.user as any)?.role || "member";

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {[
          { label: t("stats.tasks"), value: stats.tasks, icon: CheckSquare, color: "bg-blue-50 text-blue-600" },
          { label: t("stats.users"), value: stats.users, icon: Users, color: "bg-green-50 text-green-600" },
          { label: t("stats.messages"), value: stats.messages, icon: MessageSquare, color: "bg-amber-50 text-amber-600" },
          { label: st("events"), value: stats.events, icon: Calendar, color: "bg-purple-50 text-purple-600" },
          { label: t("subscribers"), value: stats.subscribers, icon: Mail, color: "bg-teal-50 text-teal-600" },
          { label: st("views"), value: stats.totalViews.toLocaleString(), icon: Eye, color: "bg-rose-50 text-rose-600" },
          { label: st("posts"), value: stats.posts, icon: FileText, color: "bg-indigo-50 text-indigo-600" },
          { label: st("comments"), value: stats.comments, icon: MessageCircle, color: "bg-orange-50 text-orange-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center shrink-0`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 truncate">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border p-5">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="w-4 h-4 text-[#1a5632]" />
            <h3 className="font-bold text-gray-900 text-sm">{st("commentsChart")}</h3>
          </div>
          <MiniBar data={stats.commentsByDay} label="" color="#1a5632" />
        </div>
        <div className="bg-white rounded-2xl border p-5">
          <div className="flex items-center gap-2 mb-3">
            <UserPlus className="w-4 h-4 text-[#c8a84e]" />
            <h3 className="font-bold text-gray-900 text-sm">{st("usersChart")}</h3>
          </div>
          <MiniBar data={stats.usersByDay} label="" color="#c8a84e" />
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl border p-6">
        <h3 className="font-bold text-gray-900 mb-4">{t("quickActions")}</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: t("addTask"), href: "/dashboard/tasks", icon: CheckSquare },
            { label: t("ai"), href: "/dashboard/ai", icon: Sparkles },
            { label: t("managePages"), href: "/dashboard/pages", icon: FileText, admin: true },
            { label: t("viewSite"), href: "/", icon: LayoutDashboard },
          ].filter(a => a.admin ? (role === "admin" || role === "editor") : true).map((a) => (
            <Link key={a.label} href={a.href} className="flex items-center gap-3 p-4 border rounded-xl hover:bg-gray-50 transition-colors">
              <a.icon className="w-5 h-5 text-[#1a5632]" />
              <span className="text-sm font-medium text-gray-700">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent */}
      <div className="bg-white rounded-2xl border p-6">
        <h3 className="font-bold text-gray-900 mb-4">{t("recentTasks")}</h3>
        <p className="text-sm text-gray-400">{t("noTasks")}</p>
      </div>
    </>
  );
}
