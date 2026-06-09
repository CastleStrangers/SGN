import type { MetadataRoute } from "next";
import { cookies } from "next/headers";
import arMessages from "../../messages/ar.json";
import nlMessages from "../../messages/nl.json";
import enMessages from "../../messages/en.json";

const messages: Record<string, any> = { ar: arMessages, nl: nlMessages, en: enMessages };

function t(locale: string, key: string): string {
  const val = key.split(".").reduce((o, k) => o?.[k], messages[locale] || messages.ar);
  return typeof val === "string" ? val : key;
}

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "ar";
  const name = t(locale, "site.title");
  const shortName = t(locale, "site.shortTitle");
  const description = t(locale, "site.description");

  return {
    name,
    short_name: shortName,
    description,
    start_url: `/${locale}`,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1a5632",
    orientation: "portrait",
    lang: locale,
    dir: locale === "ar" ? "rtl" : "ltr",
    categories: ["news", "community", "culture"],
    screenshots: [
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        form_factor: "wide",
      },
    ],
    icons: [
      { src: "/logo.png", sizes: "192x192", type: "image/png" },
      { src: "/logo.png", sizes: "512x512", type: "image/png" },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
