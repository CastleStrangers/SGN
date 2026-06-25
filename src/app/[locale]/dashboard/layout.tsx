"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { LayoutDashboard, CheckSquare, Users, FileText, LogOut, Menu, X, MessageSquare, Sparkles, MessageCircle, Mail, Calendar, HandHeart, Globe, Megaphone, User, BarChart3, Shield, Image as ImageIcon, Facebook, Heart, Building2, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "@/components/theme-toggle";
import { SgnLogo } from "@/components/sgn-logo";
import { NotificationBell } from "@/components/notification-bell";
import { NotificationToaster } from "@/components/notification-toaster";
import { FreeSyrianFlag, DutchFlag } from "@/components/flags";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useTranslations("dashboard");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      router.push("/");
    }
  }, [status, session, router]);

  // Force body background to be light gray in dashboard to match the layout
  useEffect(() => {
    const originalBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#f9fafb"; 
    
    return () => {
      document.body.style.backgroundColor = originalBg;
    };
  }, []);

  if (status === "loading") {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-[#1a5632] border-t-transparent rounded-full" /></div>;
  }
  if (!session || (session.user as any)?.role !== "admin") return null;

  const role = (session.user as any)?.role || "member";

  function canAccess(item: { admin?: boolean; editor?: boolean }) {
    if (item.admin) return role === "admin";
    if (item.editor) return role === "admin" || role === "editor";
    return true;
  }

  const nav = [
    { label: t("viewSite"), href: "/", icon: Globe },
    { label: t("title"), href: "/dashboard", icon: LayoutDashboard },
    { label: t("ai"), href: "/dashboard/ai", icon: Sparkles },
    { label: t("tasks"), href: "/dashboard/tasks", icon: CheckSquare },
    { label: t("members"), href: "/dashboard/members", icon: Users },
    { label: "إدارة المستندات", href: "/dashboard/members/vault", icon: Shield, admin: true },
    { label: t("board"), href: "/dashboard/board", icon: Building2, admin: true },
    { label: t("memberProfile"), href: "/dashboard/member-profile", icon: User },
    { label: t("statsLink"), href: "/dashboard/stats", icon: BarChart3 },
    { label: t("membershipSettings"), href: "/dashboard/membership-settings", icon: CheckSquare },
    { label: t("volunteers"), href: "/dashboard/volunteers", icon: HandHeart, editor: true },
    { label: t("events"), href: "/dashboard/events", icon: Calendar, editor: true },
    { label: t("messages"), href: "/dashboard/messages", icon: MessageSquare },
    { label: t("subscribers"), href: "/dashboard/subscribers", icon: Mail, admin: true },
    { label: t("comments"), href: "/dashboard/comments", icon: MessageCircle, admin: true },
    { label: t("users"), href: "/dashboard/users", icon: Users, admin: true },
    { label: t("roles"), href: "/dashboard/roles", icon: Shield, admin: true },
    { label: t("mobileControl"), href: "/dashboard/mobile-control", icon: Smartphone, admin: true },
    { label: t("pages"), href: "/dashboard/pages", icon: FileText, editor: true },
    { label: t("landing"), href: "/dashboard/landing", icon: Globe, admin: true },
    { label: t("donationsPage.title"), href: "/dashboard/donations", icon: Heart, admin: true },
    { label: t("ads"), href: "/dashboard/ads", icon: Megaphone, admin: true },
    { label: t("surveys"), href: "/dashboard/surveys", icon: BarChart3, admin: true },
    { label: t("media"), href: "/dashboard/media", icon: ImageIcon, admin: true },
    { label: t("facebookSync"), href: "/dashboard/facebook-sync", icon: Facebook, admin: true },
    { label: t("settings"), href: "/dashboard/settings", icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - positioned on the right for RTL with overflow-y-auto */}
      <aside className={`fixed lg:sticky top-0 right-0 z-40 w-64 h-screen bg-white border-l overflow-y-auto transform transition-transform duration-200 ${open ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SgnLogo size={36} className="w-9 h-9" priority />
              <div className="flex items-center gap-1.5" dir="rtl">
                <FreeSyrianFlag className="w-6 h-4 flex-shrink-0 transition-transform hover:scale-105" />
                <span className="font-bold text-gray-900 text-xs sm:text-sm px-0.5">{t("shortTitle")}</span>
                <DutchFlag className="w-6 h-4 flex-shrink-0 transition-transform hover:scale-105" />
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="lg:hidden p-1 hover:bg-gray-100 rounded" title="Close Menu" aria-label="Close Menu"><X className="w-5 h-5" /></button>
          </div>
        </div>
        <nav className="p-3 space-y-1">
          {nav.filter(n => canAccess(n)).map((n) => (
            <Link key={n.href} href={n.href} className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-xl text-sm transition-colors">
              <n.icon className="w-5 h-5 text-gray-400" />
              {n.label}
            </Link>
          ))}
          <hr className="my-3" />
          <button onClick={() => signOut()} className="flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-xl text-sm w-full transition-colors">
            <LogOut className="w-5 h-5" />
            {t("logout")}
          </button>
        </nav>
      </aside>

      {/* Overlay */}
      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 bg-black/20 z-30 lg:hidden" />}

      {/* Main */}
      <div className="flex-1 min-h-screen">
        <header className="bg-white border-b px-4 lg:px-6 h-16 flex items-center justify-between sticky top-0 z-20">
          <button onClick={() => setOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg" title="Open Menu" aria-label="Open Menu"><Menu className="w-5 h-5" /></button>
          <h2 className="text-lg font-bold text-gray-900 hidden sm:block">{t("title")}</h2>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <ThemeToggle />
            <span className="text-sm text-gray-500">{session.user?.name}</span>
            <div className="w-9 h-9 rounded-full bg-[#c8a84e] flex items-center justify-center text-white font-bold text-sm overflow-hidden">
              {session.user?.image ? (
                <img src={session.user.image} alt="" className="w-full h-full object-cover" />
              ) : (
                (session.user?.name || "?").charAt(0)
              )}
            </div>
          </div>
        </header>
        <main className="p-4 lg:p-6 space-y-6">
          {children}
        </main>
      </div>
      <NotificationToaster />
    </div>
  );
}
