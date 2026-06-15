"use client";

import { useState } from "react";
import { SgnLogo } from "@/components/sgn-logo";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationBell } from "@/components/notification-bell";
import { useSession, signOut } from "next-auth/react";

const mainNav = [
  { key: "nav.home", href: "/" },
  { key: "nav.communityNews", href: "/news?category=%D8%A3%D8%AE%D8%A8%D8%A7%D8%B1%20%D8%A7%D9%84%D8%AC%D8%A7%D9%84%D9%8A%D8%A9" },
  { key: "nav.netherlandsNews", href: "/news?category=%D8%A3%D8%AE%D8%A8%D8%A7%D8%B1%20%D9%87%D9%88%D9%84%D9%86%D8%AF%D8%A7" },
  { key: "nav.europeNews", href: "/news?category=%D8%A3%D8%AE%D8%A8%D8%A7%D8%B1%20%D8%A3%D9%88%D8%B1%D9%88%D8%A8%D8%A7" },
  { key: "nav.economy", href: "/news?category=%D8%A7%D9%82%D8%AA%D8%B5%D8%A7%D8%AF%20%D9%88%D8%A3%D8%B9%D9%85%D8%A7%D9%84" },
  { key: "nav.culture", href: "/news?category=%D8%AB%D9%82%D8%A7%D9%81%D8%A9%20%D9%88%D9%81%D9%86" },
  { key: "nav.videos", href: "/news?category=%D9%81%D9%8A%D8%AF%D9%8A%D9%88%D9%87%D8%A7%D8%AA" },
  { key: "nav.events", href: "/events" },
  { key: "nav.members", href: "/members" },
  { key: "nav.gallery", href: "/gallery" },
];

const secondaryNav = [
  { key: "nav.about", href: "/about" },
  { key: "nav.regulations", href: "/regulations" },
  { key: "nav.volunteer", href: "/volunteer" },
  { key: "nav.contact", href: "/contact" },
  { key: "nav.donate", href: "/donate" },
];

const allNav = [...mainNav, ...secondaryNav];

import { FreeSyrianFlag, DutchFlag } from "@/components/flags";

export function SiteHeader() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session } = useSession();
  const mainItems = mainNav.map(i => ({ label: i.label || t(i.key!), href: i.href }));
  const secondaryItems = secondaryNav.map(i => ({ label: t(i.key!), href: i.href }));
  const allItems = [...mainItems, ...secondaryItems];

  return (
    <header className="bg-card text-card-foreground border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <SgnLogo size={64} className="w-14 h-14 lg:w-16 lg:h-16" priority />
            <div className="flex items-center gap-1.5" dir="rtl">
              <FreeSyrianFlag className="w-6 h-4 rounded shadow-sm border border-gray-100 flex-shrink-0 object-cover" />
              <span className="text-sm sm:text-base font-bold text-[#1a5632] whitespace-nowrap">
                {t("site.shortTitle")}
              </span>
              <DutchFlag className="w-6 h-4 rounded shadow-sm border border-gray-100 flex-shrink-0 object-cover" />
            </div>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            {session && <NotificationBell />}
            <ThemeToggle />
            <LanguageSwitcher />
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-9 h-9 rounded-full bg-[#c8a84e] flex items-center justify-center text-white font-bold text-sm overflow-hidden focus:outline-none border-2 border-transparent hover:border-[#1a5632] transition-all cursor-pointer"
                >
                  {session.user?.image ? (
                    <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (session.user?.name || "?").charAt(0)
                  )}
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-40">
                      <div className="px-4 py-2 border-b border-gray-50 text-right">
                        <p className="text-[10px] text-gray-400">مرحباً بك</p>
                        <p className="text-sm font-bold text-gray-900 truncate" title={session.user?.name || ""}>
                          {session.user?.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-0.5" title={session.user?.email || ""}>
                          {session.user?.email}
                        </p>
                      </div>
                      <Link href="/messages" onClick={() => setUserMenuOpen(false)} className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium">
                        {t("chat.title")}
                      </Link>
                      {(session.user as any)?.role === "admin" && (
                        <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium">
                          {t("nav.dashboard")}
                        </Link>
                      )}
                      <Link href="/dashboard/member-profile" onClick={() => setUserMenuOpen(false)} className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        ملف العضوية
                      </Link>
                      <Link href="/dashboard/settings" onClick={() => setUserMenuOpen(false)} className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        الملف الشخصي
                      </Link>
                      <hr className="my-1 border-gray-50" />
                      <button onClick={() => { setUserMenuOpen(false); signOut(); }} className="block w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium cursor-pointer">
                        {t("auth.logout")}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/login" className="px-3 py-1.5 bg-[#1a5632] text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-[#0f3d23] transition-colors whitespace-nowrap">
                {t("nav.login")}
              </Link>
            )}
            <button className="lg:hidden p-2" onClick={() => setOpen(!open)} title={open ? "Close Menu" : "Open Menu"} aria-label={open ? "Close Menu" : "Open Menu"}>
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="hidden lg:block border-t border-border bg-muted/50">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-0.5 overflow-x-auto py-1.5" dir="auto">
            {mainItems.map(c => (
              <Link key={c.label} href={c.href}
                className="px-2.5 py-1.5 text-sm text-muted-foreground hover:text-primary hover:bg-card rounded-lg transition-colors font-medium whitespace-nowrap flex-shrink-0">
                {c.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-card text-card-foreground">
          <div className="px-4 py-3 space-y-1 max-h-80 overflow-y-auto">
            {allItems.map(c => (
              <Link key={c.label} href={c.href}
                className="block px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg text-sm"
                onClick={() => setOpen(false)}>{c.label}</Link>
            ))}
            <hr className="my-2" />
            {session ? (
              <div className="space-y-2 px-3 py-1">
                <div className="text-sm text-gray-600 font-bold mb-1">مرحباً، {session.user?.name}</div>
                <Link href="/messages" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium text-gray-700 hover:underline">
                  {t("chat.title")}
                </Link>
                {(session.user as any)?.role === "admin" && (
                  <Link href="/dashboard" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium text-[#1a5632] hover:underline">
                    {t("nav.dashboard")}
                  </Link>
                )}
                <Link href="/dashboard/member-profile" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium text-gray-700 hover:underline">
                  ملف العضوية
                </Link>
                <button onClick={() => { setOpen(false); signOut(); }} className="block w-full text-right py-2 text-sm font-medium text-red-600 hover:underline">
                  {t("auth.logout")}
                </button>
              </div>
            ) : (
              <Link href="/login" className="block px-3 py-2.5 text-[#1a5632] font-medium text-sm" onClick={() => setOpen(false)}>
                {t("nav.login")}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
