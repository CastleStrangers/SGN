"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Facebook, Instagram, Youtube, Twitter } from "lucide-react";
import { TikTok } from "@/components/tiktok-icon";
import { FreeSyrianFlag, DutchFlag } from "@/components/flags";

const socials = [
  { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61584301535331" },
  { icon: Instagram, href: "https://www.instagram.com/sgn_syria/" },
  { icon: Youtube, href: "https://www.youtube.com/@SY-NL" },
  { icon: Twitter, href: "https://x.com/SGN2098551" },
  { icon: TikTok, href: "https://www.tiktok.com/@sgn_syria" },
];

const quickLinks = [
  { key: "footer.links.about", href: "/about" },
  { key: "footer.links.pulse", href: "/news" },
  { key: "nav.events", href: "/events" },
  { label: "معرض الصور", href: "/gallery" },
  { key: "footer.links.volunteer", href: "/volunteer" },
  { key: "footer.links.contact", href: "/contact" },
  { key: "footer.links.login", href: "/login" },
];

function MailIcon(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>; }
function MapPinIcon(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>; }

export function SiteFooter() {
  const t = useTranslations();
  const items = quickLinks.map(i => ({ label: i.label || t(i.key!), href: i.href }));
  const sections = [t("categories.netherlandsNews"), t("categories.europeNews"), t("categories.economy"), t("categories.culture"), t("categories.sports"), t("categories.tech")];

  return (
    <footer className="bg-[#1a1a2e] text-white mt-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo.png" alt={t("site.shortTitle")} width={56} height={56} className="w-14 h-14 flex-shrink-0" priority />
              <div className="flex items-center gap-1.5" dir="rtl">
                <FreeSyrianFlag className="w-5 h-3.5 rounded shadow-sm border border-gray-600/30 flex-shrink-0 object-cover" />
                <h3 className="font-bold text-white leading-none whitespace-nowrap">{t("site.shortTitle")}</h3>
                <DutchFlag className="w-5 h-3.5 rounded shadow-sm border border-gray-600/30 flex-shrink-0 object-cover" />
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">{t("footer.description")}</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">{t("footer.sections")}</h4>
            <div className="space-y-2 text-sm text-gray-400">
              {sections.map(l => (
                <Link key={l} href="/news" className="block hover:text-[#c8a84e] transition-colors">{l}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4">{t("footer.quickLinks")}</h4>
            <div className="space-y-2 text-sm text-gray-400">
              {items.map(l => (
                <Link key={l.label} href={l.href} className="block hover:text-[#c8a84e] transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4">{t("footer.contactUs")}</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2"><MailIcon className="w-4 h-4 text-[#c8a84e]" /> {t("footer.email")}</div>
              <div className="flex items-start gap-2"><MapPinIcon className="w-4 h-4 text-[#c8a84e] mt-0.5" /> {t("footer.location")}</div>
            </div>
            <div className="flex gap-2 mt-4">
              {socials.map(s => (
                <a key={s.href} href={s.href} target="_blank" className="w-9 h-9 bg-white/10 hover:bg-[#c8a84e] rounded-full flex items-center justify-center transition-colors"><s.icon className="w-4 h-4" /></a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} {t("site.shortTitle")}. {t("footer.copyright")}.</p>
        </div>
      </div>
    </footer>
  );
}
