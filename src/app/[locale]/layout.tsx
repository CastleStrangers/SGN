import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/home/site-footer";
import { LocaleSync } from "@/components/locale-sync";
import { ChatWidget } from "@/components/chat-widget";

const openGraphLocales: Record<string, string> = {
  ar: "ar_AR",
  nl: "nl_NL",
  en: "en_US",
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("site");
  const locale = await getLocale();
  const ogLocale = openGraphLocales[locale] || "ar_AR";
  const title = t("title");
  const description = t("description");

  return {
    metadataBase: new URL("https://sy-nl.org"),
    title: { default: title, template: `%s | ${title}` },
    description,
    keywords: t("keywords").split(","),
    openGraph: {
      type: "website",
      locale: ogLocale,
      siteName: title,
      title,
      description,
      url: "https://sy-nl.org",
    },
    twitter: { card: "summary_large_image", title, description },
    icons: { icon: "/logo.png", apple: "/logo.png" },
    alternates: { canonical: "https://sy-nl.org" },
    robots: { index: true, follow: true },
    appleWebApp: { capable: true, statusBarStyle: "default", title: t("shortTitle") },
  };
}

export default async function LocaleLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  return (
    <NextIntlClientProvider locale={locale}>
      <LocaleSync />
      {children}
      <SiteFooter />
      <ChatWidget />
    </NextIntlClientProvider>
  );
}

