import { NextResponse } from "next/server";
import { analyzeDocument } from "@/lib/ai/chat";
import { getApiMessage } from "@/lib/api-messages";
import { getSessionUser } from "@/lib/mobile-auth";

function t(req: Request, key: string) {
  const locale = (req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
  return getApiMessage(locale, key);
}

export async function POST(req: Request) {
  const user = await getSessionUser(req);
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { imageUrl, locale } = await req.json();
    if (!imageUrl) {
      return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
    }

    const userLocale = locale || "ar";
    const analysis = await analyzeDocument(imageUrl, userLocale);

    return NextResponse.json({ analysis });
  } catch (error: any) {
    console.error("[API/analyze-letter] Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
