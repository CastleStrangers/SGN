import { NextResponse } from "next/server";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { createClient } from "@libsql/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const tmpDbPath = path.join(process.cwd(), "prisma", "dev-history-temp.db");
  const results: any[] = [];

  try {
    // Get all commits that modified prisma/dev.db or SGN/prisma/dev.db
    const logOutput = execSync("git log --oneline --all --follow -- prisma/dev.db", {
      encoding: "utf8",
    });
    
    const commits = logOutput
      .split("\n")
      .map((line) => line.split(" ")[0])
      .filter((hash) => hash.length > 0);

    for (const commit of commits) {
      try {
        let dbBuffer = null;
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
            const tableCheck = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='BoardMember'");
            if (tableCheck.rows.length > 0) {
              const members = await client.execute("SELECT id, nameAr, image FROM BoardMember");
              const hasRealImages = members.rows.some((m: any) => m.image && !m.image.endsWith(".svg"));
              results.push({
                commit,
                hasRealImages,
                members: members.rows
              });
            }
          } catch (dbErr: any) {
            results.push({ commit, error: dbErr.message });
          } finally {
            client.close();
          }
        }
      } catch (err: any) {
        results.push({ commit, gitError: err.message });
      }
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (fs.existsSync(tmpDbPath)) {
      try {
        fs.unlinkSync(tmpDbPath);
      } catch (e) {}
    }
  }

  return NextResponse.json(results);
}
