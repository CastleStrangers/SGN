import type { Metadata } from "next";
import { Almarai } from "next/font/google";
import { cookies } from "next/headers";
import AuthProvider from "@/components/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { PWARegister } from "@/components/pwa-register";
import "./globals.css";

const almarai = Almarai({
  variable: "--font-almarai",
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1a5632",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://sy-nl.org"),
  title: { default: "الجالية السورية في هولندا", template: "%s | الجالية السورية في هولندا" },
  description: "الموقع الرسمي للجالية السورية في هولندا — أخبار الجالية، فعاليات، خدمات، ومنصة تفاعلية لأبناء الجالية السورية",
  keywords: ["الجالية السورية", "هولندا", "أخبار", "فعاليات", "سوريون في هولندا", "syrische gemeenschap", "Nederland"],
  openGraph: {
    type: "website",
    locale: "ar_AR",
    siteName: "الجالية السورية في هولندا",
    title: "الجالية السورية في هولندا",
    description: "الموقع الرسمي للجالية السورية في هولندا",
    url: "https://sy-nl.org",
  },
  twitter: { card: "summary_large_image", title: "الجالية السورية في هولندا", description: "الموقع الرسمي للجالية السورية في هولندا" },
  icons: { icon: "/logo.png", apple: "/logo.png" },
  alternates: { canonical: "https://sy-nl.org" },
  robots: { index: true, follow: true },
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "SY-NL" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "ar";
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className={`${almarai.variable} font-sans antialiased`}>
        <PWARegister />
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
