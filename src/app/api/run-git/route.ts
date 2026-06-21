import { NextResponse } from "next/server";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import Database from "better-sqlite3"; // check if better-sqlite3 or sqlite3 is available, wait, we can just use sqlite3 or better-sqlite3

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
        
        // Open sqlite connection
        const db = new Database(tmpDbPath, { readonly: true });
        
        // Check if table board_members exists
        const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='board_members'").get();
        if (tableCheck) {
          const members = db.prepare("SELECT id, nameAr, nameEn, image FROM board_members").all();
          results.push({
            commit,
            hasMembers: true,
            members: members.map((m: any) => ({ nameAr: m.nameAr, nameEn: m.nameEn, image: m.image }))
          });
        } else {
          results.push({ commit, hasMembers: false, reason: "Table board_members does not exist" });
        }
        db.close();
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

