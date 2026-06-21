import { NextResponse } from "next/server";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const tmpDbPath = path.join(process.cwd(), "prisma", "dev-check.db");
  const results: any[] = [];
  
  // Let's get the list of commits that modified prisma/dev.db or prisma/prisma/dev.db
  const commits = [
    "c109ed4", "f287b87", "fce8429", "7af49c2", "9dcca45", "442035a", "487bfbc", "3731d17", "a300478",
    "0ab2a17", "0b30f28", "943bc9a", "a88a96c", "37f1f71", "7d01299", "6e9b083"
  ];

  for (const commit of commits) {
    try {
      // Try to get dev.db from the commit
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
        
        // Execute sqlite3 CLI to get table count and then the rows
        try {
          const tableCheck = execSync(`sqlite3 "${tmpDbPath}" "SELECT name FROM sqlite_master WHERE type='table' AND name='board_members';"`, { encoding: "utf-8" }).trim();
          if (tableCheck === "board_members") {
            const rowsJson = execSync(`sqlite3 "${tmpDbPath}" "SELECT json_group_array(json_object('nameAr', nameAr, 'nameEn', nameEn, 'image', image)) FROM board_members;"`, { encoding: "utf-8" }).trim();
            results.push({
              commit,
              hasMembers: true,
              members: JSON.parse(rowsJson)
            });
          } else {
            results.push({ commit, hasMembers: false, reason: "Table board_members not found" });
          }
        } catch (sqliteErr: any) {
          results.push({ commit, error: "Sqlite CLI error: " + sqliteErr.message });
        }
      }
    } catch (err: any) {
      results.push({ commit, error: err.message });
    }
  }

  // Clean up
  if (fs.existsSync(tmpDbPath)) {
    try {
      fs.unlinkSync(tmpDbPath);
    } catch (e) {}
  }

  return NextResponse.json({ success: true, results });
}

