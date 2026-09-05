"use client";

import { useState, useRef, useEffect } from "react";
import { SgnLogo } from "@/components/sgn-logo";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import {
  Menu,
  X,
  ChevronDown,
  Briefcase,
  Users,
  CreditCard,
  Sparkles,
  FileText,
  Tag,
  Crown,
  Image as ImageIcon,
  Sparkle,
} from "lucide-react";
import LanguageSwitcher from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationBell } from "@/components/notification-bell";
import { useSession, signOut } from "next-auth/react";
import { FreeSyrianFlag, DutchFlag } from "@/components/flags";

const mainNav = [
  { key: "nav.home", href: "/" },
  { key: "nav.communityNews", href: "/news?category=%D8%A3%D8%AE%D8%A8%D8%A7%D8%B1%20%D8%A7%D9%84%D8%AC%D8%A7%D9%84%D9%8A%D8%A9" },
  { key: "nav.netherlandsNews", href: "/news?category=%D8%A3%D8%AE%D8%A8%D8%A7%D8%B1%20%D9%87%D9%88%D9%84%D9%86%D8%AF%D8%A7" },
  { key: "nav.europeNews", href: "/news?category=%D8%A3%D8%AE%D8%A8%D8%A7%D8%B1%20%D8%A3%D9%88%D8%B1%D9%88%D8%A8%D8%A7" },
  { key: "nav.economy", href: "/news?category=%D8%A7%D9%82%D8%AA%D8%B5%D8%A7%D8%AF%20%D9%88%D8%A3%D8%B9%D9%85%D8%A7%D9%84" },
  { key: "nav.culture", href: "/news?category=%D8%AB%D9%82%D8%A7%D9%81%D8%A9%20%D9%88%D9%81%D9%86" },
  { key: "nav.videos", href: "/news?category=%D9%81%D9%8A%D8%AF%D9%8A%D9%88%D9%87%D8%A7%D8%AA" },
  { key: "nav.events", href: "/events" },
];

interface ServiceItem {
  key: string;
  subKey: string;
  href: string;
  icon: any;
  badge?: string;
  iconColor: string;
}

interface ServiceGroup {
  titleKey: string;
  items: ServiceItem[];
}

const serviceGroups: ServiceGroup[] = [
  {
    titleKey: "nav.communityServicesGroup",
    items: [
      {
        key: "nav.services",
        subKey: "nav.servicesSub",
        href: "/services",
        icon: Briefcase,
        iconColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200/60 dark:border-emerald-800/40",
      },
      {
        key: "nav.members",
        subKey: "nav.membersSub",
        href: "/members",
        icon: Users,
        iconColor: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50 border-sky-200/60 dark:border-sky-800/40",
      },
      {
        key: "nav.membershipCard",
        subKey: "nav.membershipCardSub",
        href: "/membership-card",
        icon: CreditCard,
        iconColor: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200/60 dark:border-amber-800/40",
      },
    ],
  },
  {
    titleKey: "nav.smartToolsGroup",
    items: [
      {
        key: "nav.briefScanner",
        subKey: "nav.briefScannerSub",
        href: "/services/brief-scanner",
        icon: Sparkles,
        badge: "AI",
        iconColor: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 border-purple-200/60 dark:border-purple-800/40",
      },
      {
        key: "nav.cvBuilder",
        subKey: "nav.cvBuilderSub",
        href: "/services/cv-builder",
        icon: FileText,
        iconColor: "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 border-teal-200/60 dark:border-teal-800/40",
      },
    ],
  },
  {
    titleKey: "nav.perksAndMediaGroup",
    items: [
      {
        key: "nav.discounts",
        subKey: "nav.discountsSub",
        href: "/services/discounts",
        icon: Tag,
        iconColor: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border-rose-200/60 dark:border-rose-800/40",
      },
      {
        key: "nav.pricing",
        subKey: "nav.pricingSub",
        href: "/pricing",
        icon: Crown,
        iconColor: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200/60 dark:border-amber-800/40",
      },
      {
        key: "nav.gallery",
        subKey: "nav.gallerySub",
        href: "/gallery",
        icon: ImageIcon,
        iconColor: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200/60 dark:border-indigo-800/40",
      },
    ],
  },
];

const secondaryNav = [
  { key: "nav.about", href: "/about" },
  { key: "nav.regulations", href: "/regulations" },
  { key: "nav.volunteer", href: "/volunteer" },
  { key: "nav.contact", href: "/contact" },
  { key: "nav.donate", href: "/donate" },
];

export function SiteHeader() {
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const servicesDropdownRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  const mainItems = mainNav.map(i => ({ label: t(i.key!), href: i.href }));
  const secondaryItems = secondaryNav.map(i => ({ label: t(i.key!), href: i.href }));

  // إغلاق قائمة الخدمات المنسدلة عند النقر خارجها
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target as Node)) {
        setServicesMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-card text-card-foreground border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo & Flags */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <SgnLogo size={64} className="w-14 h-14 lg:w-16 lg:h-16" priority />
            <div className="flex items-center gap-2" dir={isRtl ? "rtl" : "ltr"}>
              <FreeSyrianFlag className="w-8 h-5 flex-shrink-0 transition-transform hover:scale-105" />
              <span className="text-sm sm:text-base font-bold text-[#1a5632] whitespace-nowrap px-0.5">
                {t("site.shortTitle")}
              </span>
              <DutchFlag className="w-8 h-5 flex-shrink-0 transition-transform hover:scale-105" />
            </div>
          </Link>

          {/* User Controls & Language */}
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
                    <div className="absolute ltr:right-0 rtl:left-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl shadow-xl py-2 z-40">
                      <div className={`px-4 py-2 border-b border-gray-50 dark:border-slate-800 ${isRtl ? "text-right" : "text-left"}`}>
                        <p className="text-[10px] text-gray-400">{t("dashboard.welcome")}</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate" title={session.user?.name || ""}>
                          {session.user?.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5" title={session.user?.email || ""}>
                          {session.user?.email}
                        </p>
                      </div>
                      <Link href="/messages" onClick={() => setUserMenuOpen(false)} className={`block w-full ${isRtl ? "text-right" : "text-left"} px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 font-medium`}>
                        {t("chat.title")}
                      </Link>
                      {(session.user as any)?.role === "admin" && (
                        <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className={`block w-full ${isRtl ? "text-right" : "text-left"} px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 font-medium`}>
                          {t("nav.dashboard")}
                        </Link>
                      )}
                      <Link href="/dashboard/member-profile" onClick={() => setUserMenuOpen(false)} className={`block w-full ${isRtl ? "text-right" : "text-left"} px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800`}>
                        {t("dashboard.memberProfile")}
                      </Link>
                      <Link href="/dashboard/settings" onClick={() => setUserMenuOpen(false)} className={`block w-full ${isRtl ? "text-right" : "text-left"} px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800`}>
                        {t("dashboard.settings")}
                      </Link>
                      <hr className="my-1 border-gray-50 dark:border-slate-800" />
                      <button onClick={() => { setUserMenuOpen(false); signOut(); }} className={`block w-full ${isRtl ? "text-right" : "text-left"} px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium cursor-pointer`}>
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
            <button className="lg:hidden p-2 text-muted-foreground hover:text-primary" onClick={() => setOpen(!open)} title={open ? "Close Menu" : "Open Menu"} aria-label={open ? "Close Menu" : "Open Menu"}>
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Main Navigation Bar */}
      <div className="hidden lg:block border-t border-border bg-muted/40">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center justify-between py-1.5" dir={isRtl ? "rtl" : "ltr"}>
            {/* Primary Content Links */}
            <div className="flex items-center gap-1">
              {mainItems.map(c => (
                <Link
                  key={c.label}
                  href={c.href}
                  className="px-3 py-1.5 text-sm text-muted-foreground hover:text-primary hover:bg-card rounded-lg transition-colors font-medium whitespace-nowrap"
                >
                  {c.label}
                </Link>
              ))}
            </div>

            {/* Services Dropdown Button & Mega Menu */}
            <div className="relative" ref={servicesDropdownRef}>
              <button
                onClick={() => setServicesMenuOpen(!servicesMenuOpen)}
                onMouseEnter={() => setServicesMenuOpen(true)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-bold rounded-xl transition-all border cursor-pointer ${
                  servicesMenuOpen
                    ? "bg-[#1a5632] text-white border-[#1a5632] shadow-sm"
                    : "bg-card hover:bg-muted text-card-foreground border-border/80 hover:border-[#1a5632]/40"
                }`}
              >
                <Sparkles className={`w-4 h-4 ${servicesMenuOpen ? "text-[#c8a84e]" : "text-amber-500"}`} />
                <span>{t("nav.allServices")}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Services Floating Mega Menu */}
              {servicesMenuOpen && (
                <div
                  onMouseLeave={() => setServicesMenuOpen(false)}
                  className={`absolute top-full mt-2 ${
                    isRtl ? "left-0" : "right-0"
                  } w-[680px] bg-card/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150`}
                >
                  <div className="grid grid-cols-3 gap-5">
                    {serviceGroups.map(group => (
                      <div key={group.titleKey} className="space-y-2.5">
                        <h4 className="text-[11px] font-black uppercase tracking-wider text-muted-foreground/80 pb-1.5 border-b border-border/50 flex items-center gap-1.5">
                          <span>{t(group.titleKey)}</span>
                        </h4>
                        <div className="space-y-1">
                          {group.items.map(item => {
                            const IconComponent = item.icon;
                            return (
                              <Link
                                key={item.key}
                                href={item.href}
                                onClick={() => setServicesMenuOpen(false)}
                                className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted/80 transition-all border border-transparent hover:border-border/50"
                              >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 mt-0.5 transition-transform group-hover:scale-105 ${item.iconColor}`}>
                                  <IconComponent className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-card-foreground group-hover:text-primary transition-colors truncate">
                                      {t(item.key)}
                                    </span>
                                    {item.badge && (
                                      <span className="px-1.5 py-0.2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-black rounded text-[9px] uppercase tracking-wider">
                                        {item.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                                    {t(item.subKey)}
                                  </p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Dropdown Footer CTA */}
                  <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="text-[11px]">{t("nav.servicesDesc")}</span>
                    <Link
                      href="/services"
                      onClick={() => setServicesMenuOpen(false)}
                      className="text-xs font-bold text-[#1a5632] dark:text-emerald-400 hover:underline"
                    >
                      {t("nav.services")} &larr;
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {open && (
        <div className="lg:hidden border-t border-border bg-card text-card-foreground">
          <div className="px-4 py-3 space-y-4 max-h-[80vh] overflow-y-auto" dir={isRtl ? "rtl" : "ltr"}>
            {/* Primary News & Content Links */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-2 px-1">
                {isRtl ? "الأخبار والمحتوى" : (locale === "nl" ? "Nieuws & Inhoud" : "News & Content")}
              </p>
              <div className="grid grid-cols-2 gap-1">
                {mainItems.map(c => (
                  <Link
                    key={c.label}
                    href={c.href}
                    className="px-3 py-2 text-card-foreground hover:bg-muted rounded-lg text-xs font-medium truncate"
                    onClick={() => setOpen(false)}
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>

            <hr className="border-border/60" />

            {/* Services & Tools Section */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-2 px-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{t("nav.allServices")}</span>
              </p>
              <div className="space-y-1">
                {serviceGroups.flatMap(g => g.items).map(item => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2 text-card-foreground hover:bg-muted rounded-xl text-xs font-bold transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center border shrink-0 ${item.iconColor}`}>
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">{t(item.key)}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.2 bg-purple-600 text-white font-black rounded text-[8px] uppercase tracking-wider mr-auto rtl:mr-auto rtl:ml-0 ltr:ml-auto">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            <hr className="border-border/60" />

            {/* Secondary Links */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-2 px-1">
                {isRtl ? "عن الجالية" : (locale === "nl" ? "Over de Gemeenschap" : "About the Community")}
              </p>
              <div className="grid grid-cols-2 gap-1">
                {secondaryItems.map(c => (
                  <Link
                    key={c.label}
                    href={c.href}
                    className="px-3 py-2 text-muted-foreground hover:text-card-foreground hover:bg-muted rounded-lg text-xs"
                    onClick={() => setOpen(false)}
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>

            <hr className="border-border/60" />

            {/* User Session Section */}
            {session ? (
              <div className="space-y-2 px-1 py-1">
                <div className="text-xs text-muted-foreground font-bold">
                  {t("dashboard.welcome")}, {session.user?.name}
                </div>
                <Link
                  href="/messages"
                  onClick={() => setOpen(false)}
                  className="block py-1.5 text-xs font-medium text-card-foreground hover:underline"
                >
                  {t("chat.title")}
                </Link>
                {(session.user as any)?.role === "admin" && (
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="block py-1.5 text-xs font-bold text-[#1a5632] dark:text-emerald-400 hover:underline"
                  >
                    {t("nav.dashboard")}
                  </Link>
                )}
                <Link
                  href="/dashboard/member-profile"
                  onClick={() => setOpen(false)}
                  className="block py-1.5 text-xs font-medium text-card-foreground hover:underline"
                >
                  {t("dashboard.memberProfile")}
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    signOut();
                  }}
                  className="block w-full text-start py-1.5 text-xs font-medium text-red-600 hover:underline cursor-pointer"
                >
                  {t("auth.logout")}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="block text-center py-2.5 bg-[#1a5632] text-white font-bold rounded-xl text-xs"
                onClick={() => setOpen(false)}
              >
                {t("nav.login")}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
