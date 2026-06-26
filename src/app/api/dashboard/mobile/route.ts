import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { authorize } from "@/lib/server-permissions";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await authorize(session.user.id, "settings.view"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await prisma.appSetting.findMany({
      where: {
        key: { in: ["mobile_settings", "mobile_theme"] }
      }
    });

    const settingsMap = settings.reduce((acc, curr) => {
      try {
        acc[curr.key] = JSON.parse(curr.value);
      } catch {
        acc[curr.key] = curr.value;
      }
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json({
      mobile_settings: settingsMap.mobile_settings || {
        banner: { titleAr: "أهلاً بكم في تطبيق الجالية", visible: true, image: "" },
        version: { latest: "1.0.0", required: false, alertMessage: "هناك تحديث جديد متوفر!" }
      },
      mobile_theme: settingsMap.mobile_theme || {
        primary: "#1a5632",
        accent: "#c8a84e",
        background: "#f8fafc"
      }
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await authorize(session.user.id, "settings.edit"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, mobile_settings, mobile_theme, push } = body;

    // Handle settings update
    if (action === "update_settings") {
      if (mobile_settings) {
        await prisma.appSetting.upsert({
          where: { key: "mobile_settings" },
          update: { value: JSON.stringify(mobile_settings) },
          create: { key: "mobile_settings", value: JSON.stringify(mobile_settings) }
        });
      }
      if (mobile_theme) {
        await prisma.appSetting.upsert({
          where: { key: "mobile_theme" },
          update: { value: JSON.stringify(mobile_theme) },
          create: { key: "mobile_theme", value: JSON.stringify(mobile_theme) }
        });
      }
      return NextResponse.json({ success: true });
    }

    // Handle sending targeted push notifications
    if (action === "send_push") {
      const { title, body: msgBody, province, city } = push || {};
      if (!title || !msgBody) {
        return NextResponse.json({ error: "Title and body are required" }, { status: 400 });
      }

      // Filter users by province/city
      let targetUserIds: string[] | null = null;
      if (province || city) {
        const members = await prisma.member.findMany({
          where: {
            ...(province && { nlProvincie: province }),
            ...(city && { nlCity: city }),
            status: "approved"
          },
          select: { userId: true }
        });
        targetUserIds = members.map(m => m.userId).filter((id): id is string => !!id);
      }

      // Fetch tokens
      const pushTokens = await prisma.pushToken.findMany({
        where: {
          ...(targetUserIds && { userId: { in: targetUserIds } })
        },
        select: { token: true }
      });

      if (pushTokens.length === 0) {
        return NextResponse.json({ success: true, count: 0, message: "No push tokens found for targeted audience" });
      }

      const messages = pushTokens.map((pt: { token: string }) => ({
        to: pt.token,
        title,
        body: msgBody,
        sound: "default",
        data: { timestamp: new Date().toISOString() }
      }));

      // Call Expo push server
      const expoRes = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate"
        },
        body: JSON.stringify(messages)
      });

      const expoData = await expoRes.json();
      return NextResponse.json({ success: true, count: pushTokens.length, expoResponse: expoData });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
