import { createClient } from "@libsql/client";
import "dotenv/config";

const local = createClient({ url: "file:./prisma/dev.db" });
const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function copyTable(table: string) {
  const rows = await local.execute(`SELECT * FROM "${table}"`);
  if (rows.rows.length === 0) { console.log(`  ${table}: 0 rows, skipped`); return; }

  // Get column names from the first row
  const cols = Object.keys(rows.rows[0] as Record<string, unknown>);
  const placeholders = cols.map(() => "?").join(", ");
  const colList = cols.map(c => `"${c}"`).join(", ");

  // Batch upsert — delete all first, then insert
  await turso.execute(`DELETE FROM "${table}"`);
  for (const row of rows.rows) {
    const values = cols.map(c => (row as Record<string, unknown>)[c]);
    await turso.execute({
      sql: `INSERT INTO "${table}" (${colList}) VALUES (${placeholders})`,
      args: values,
    });
  }
  console.log(`  ${table}: ${rows.rows.length} rows`);
}

async function main() {
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

  for (const t of tables) {
    try { await copyTable(t); }
    catch (e: any) { console.error(`  ${t}: ERROR — ${e.message?.substring(0, 80)}`); }
  }

  console.log("✅ Done");
  local.close();
  turso.close();
}

main().catch(console.error);
