import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const f1 = path.join(process.cwd(), "temp_db_push_log.txt");
    const f2 = path.join(process.cwd(), "temp_sync_run_log.txt");
    if (fs.existsSync(f1)) fs.unlinkSync(f1);
    if (fs.existsSync(f2)) fs.unlinkSync(f2);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
