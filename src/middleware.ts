import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const rateLimit = new Map<string, { count: number; start: number }>();

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip =
      forwardedFor?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";
    const now = Date.now();
    const windowMs = 60 * 1000;
    const maxRequests = 100;

    const data = rateLimit.get(ip) ?? { count: 0, start: now };

    if (now - data.start > windowMs) {
      data.count = 0;
      data.start = now;
    }

    data.count += 1;
    rateLimit.set(ip, data);

    if (data.count > maxRequests) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|_vercel|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|sw.js|offline.html|logo.png|images|uploads|.*\\..*).*)",
  ],
};
