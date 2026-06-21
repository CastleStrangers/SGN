import { NextResponse } from "next/server";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { createClient } from "@libsql/client";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const tmpDbPath = path.join(process.cwd(), "prisma", "dev-check.db");
  const results: any[] = [];
  
  // Get all git commits
  let commits: string[] = [];
  try {
    const commitsRaw = execSync("git log --format=%H", { encoding: "utf-8" });
    commits = commitsRaw.trim().split("\n");
  } catch (e: any) {
    return NextResponse.json({ success: false, error: "Failed to get commits: " + e.message });
  }

  for (const commit of commits) {
    try {
      let dbBuffer: Buffer | null = null;
      try {
        dbBuffer = execSync(`git show ${commit}:prisma/dev.db`, { maxBuffer: 50 * 1024 * 1024 });
      } catch (e) {
        try {
          dbBuffer = execSync(`git show ${commit}:prisma/prisma/dev.db`, { maxBuffer: 50 * 1024 * 1024 });
        } catch (e2) {}
      }

      if (dbBuffer && dbBuffer.length > 0) {
        fs.writeFileSync(tmpDbPath, dbBuffer);
        const client = createClient({ url: `file:${tmpDbPath}` });

        try {
          const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='board_members'");
          if (tables.rows.length > 0) {
            const members = await client.execute("SELECT nameAr, nameEn, image FROM board_members");
            const uploadedMembers = members.rows.filter((m: any) => 
              m.image && (m.image.includes("178") || m.image.includes("screenshot") || m.image.includes("لقطة"))
            );
            if (uploadedMembers.length > 0) {
              results.push({
                commit,
                date: execSync(`git log -1 --format=%cd ${commit}`, { encoding: "utf-8" }).trim(),
                message: execSync(`git log -1 --format=%s ${commit}`, { encoding: "utf-8" }).trim(),
                members: uploadedMembers
              });
            }
          }
        } catch (dbErr: any) {
          // ignore db query errors for older schemas
        } finally {
          client.close();
        }
      }
    } catch (err: any) {
      // ignore git show errors if file doesn't exist in that commit
    }
  }

  // Clean up
  if (fs.existsSync(tmpDbPath)) {
    try {
      fs.unlinkSync(tmpDbPath);
    } catch (e) {}
  }

  return NextResponse.json({ success: true, count: results.length, results });
}

