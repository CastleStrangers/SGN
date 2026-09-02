import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@libsql/client";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  if (secret !== "sgn-sync-2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tursoUrl = process.env.TURSO_DATABASE_URL?.trim();
  const tursoToken = process.env.TURSO_AUTH_TOKEN?.trim();

  if (!tursoUrl || !tursoToken || tursoUrl.includes("mydb-user")) {
    return NextResponse.json({ error: "Turso credentials not configured on server" }, { status: 400 });
  }

  try {
    const localDbPath = path.resolve(process.cwd(), "prisma/dev.db");
    const local = createClient({ url: `file:${localDbPath}` });
    const turso = createClient({ url: tursoUrl, authToken: tursoToken });

    const tables = [
      "User", "Account", "Session", "VerificationToken",
      "Post", "Task", "Contact", "Comment", "Event", "Subscriber",
      "Volunteer", "Member", "MemberView", "AppSetting",
      "Notification", "ActivityLog", "PasswordResetToken", "OtpCode",
      "Survey", "SurveyOption", "SurveyVote", "Ad", "Favorite",
      "PushToken", "Role", "UserPermission", "ChatMessage",
      "ChatAISession", "ChatAIMessage", "Donation", "LandingPage",
      "Guide", "EventRegistration", "TaskApplication", "board_members",
      "MobileTranslation", "MemberDocument", "ServiceReview",
    ];

    const results: Record<string, { count: number; error?: string }> = {};

    for (const table of tables) {
      try {
        const rows = await local.execute(`SELECT * FROM "${table}"`);
        if (rows.rows.length === 0) {
          results[table] = { count: 0 };
          continue;
        }

        const cols = Object.keys(rows.rows[0] as Record<string, unknown>);
        const placeholders = cols.map(() => "?").join(", ");
        const colList = cols.map((c) => `"${c}"`).join(", ");

        await turso.execute(`DELETE FROM "${table}"`);
        for (const row of rows.rows) {
          const values = cols.map((c) => (row as Record<string, any>)[c]);
          await turso.execute({
            sql: `INSERT INTO "${table}" (${colList}) VALUES (${placeholders})`,
            args: values as any[],
          });
        }
        results[table] = { count: rows.rows.length };
      } catch (e: any) {
        results[table] = { count: -1, error: e.message };
      }
    }

    local.close();
    turso.close();

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}
