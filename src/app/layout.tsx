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
  title: { default: "SGN", template: "%s" },
  description: "Syrian Community in the Netherlands — Platform for Syrian expats in the Netherlands",
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
