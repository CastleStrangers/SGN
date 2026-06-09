import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { translateContent } from "@/lib/ai/text";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { text, to, from: fromLang } = await req.json();
    if (!text?.trim() || !to) {
      return NextResponse.json({ error: "text and to are required" }, { status: 400 });
    }

    const from = fromLang || "ar";
    const translated = await translateContent(text, from, to);
    return NextResponse.json({ translated, from, to });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
