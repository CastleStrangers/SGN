"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Facebook, Instagram, Youtube, Twitter } from "lucide-react";
import { TikTok } from "@/components/tiktok-icon";
import { useSession, signOut } from "next-auth/react";

const socials = [
  { icon: Facebook, href: "https://www.facebook.com/DeSyrischeGemeenschapInNederland" },
  { icon: Instagram, href: "https://www.instagram.com/sgn_syria/" },
  { icon: Youtube, href: "https://www.youtube.com/@SY-NL" },
  { icon: Twitter, href: "https://x.com/SGN2098551" },
  { icon: TikTok, href: "https://www.tiktok.com/@sgn_syria" },
];

export function TopBar() {
  const t = useTranslations();
  const { data: session } = useSession();
  return (
    <div className="bg-[#1a1a2e] text-white text-xs hidden lg:block">
      <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span>{t("site.date")}</span>
          <span className="text-white/20">|</span>
          <div className="flex items-center gap-2">
            {socials.map(s => (
              <a key={s.href} href={s.href} target="_blank" className="hover:text-[#c8a84e] transition-colors"><s.icon className="w-3.5 h-3.5" /></a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/about" className="hover:text-[#c8a84e] transition-colors">{t("topbar.about")}</Link>
          <Link href="/regulations" className="hover:text-[#c8a84e] transition-colors">{t("topbar.regulations")}</Link>
          <Link href="/volunteer" className="hover:text-[#c8a84e] transition-colors">{t("nav.volunteer")}</Link>
          <Link href="/contact" className="hover:text-[#c8a84e] transition-colors">{t("topbar.contact")}</Link>
          <Link href="/donate" className="hover:text-[#c8a84e] transition-colors">{t("nav.donate")}</Link>
          <span className="text-white/20 mr-1">|</span>
          {session ? (
            <>
              <Link href="/messages" className="hover:text-[#c8a84e] transition-colors">{t("chat.title")}</Link>
              <button onClick={() => signOut()} className="hover:text-[#c8a84e] transition-colors cursor-pointer">
                {t("auth.logout")}
              </button>
            </>
          ) : (
            <Link href="/login" className="hover:text-[#c8a84e] transition-colors">{t("topbar.login")}</Link>
          )}
        </div>
      </div>
    </div>
  );
}
