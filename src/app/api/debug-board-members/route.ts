import { NextResponse } from "next/server";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { createClient } from "@libsql/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbPath = path.join(process.cwd(), "prisma", "dev.db.bak");
  
  if (!fs.existsSync(dbPath)) {
    return NextResponse.json({ error: "dev.db.bak not found" }, { status: 404 });
  }

  const client = createClient({ url: `file:${dbPath}` });
  try {
    const tableCheck = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND (name='board_members' OR name='BoardMember')");
    if (tableCheck.rows.length === 0) {
      return NextResponse.json({ error: "No board members table found in dev.db.bak" }, { status: 404 });
    }
    const tableName = tableCheck.rows[0].name as string;
    const members = await client.execute(`SELECT id, nameAr, nameEn, image FROM ${tableName}`);
    return NextResponse.json({
      success: true,
      tableName,
      members: members.rows
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    client.close();
  }
}
