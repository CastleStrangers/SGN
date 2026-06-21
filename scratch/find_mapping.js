import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { createClient } from "@libsql/client";

const tmpDbPath = path.join(process.cwd(), "prisma", "dev-check.db");

// Specific commits related to board member image additions and migrations
const commits = [
  "53706c0", "fc48074", "040f10c", "745597f", "5dbee28", "32f7a07"
];

async function main() {
  console.log("=== SEARCHING DATABASE COMMITS ===");
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
          // Check for board_members table first
          let tableName = "";
          const tables1 = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='board_members'");
          if (tables1.rows.length > 0) {
            tableName = "board_members";
          } else {
            const tables2 = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='BoardMember'");
            if (tables2.rows.length > 0) {
              tableName = "BoardMember";
            }
          }

          if (tableName) {
            const members = await client.execute(`SELECT nameAr, nameEn, image FROM ${tableName}`);
            console.log(`\nCommit: ${commit}`);
            console.log(`Message: ${execSync(`git log -1 --format=%s ${commit}`, { encoding: "utf-8" }).trim()}`);
            console.log(`Members count: ${members.rows.length}`);
            console.table(members.rows.map(r => ({ nameAr: r.nameAr, nameEn: r.nameEn, image: r.image })));
          } else {
            console.log(`\nCommit ${commit}: BoardMember/board_members table not found`);
          }
        } catch (dbErr) {
          console.log(`\nCommit ${commit} DB query error: ${dbErr.message}`);
        } finally {
          client.close();
        }
      } else {
        console.log(`\nCommit ${commit}: No dev.db found`);
      }
    } catch (err) {
      console.log(`\nCommit ${commit} Git error: ${err.message}`);
    }
  }

  // Clean up
  if (fs.existsSync(tmpDbPath)) {
    try {
      fs.unlinkSync(tmpDbPath);
    } catch (e) {}
  }
}

main().catch(console.error);
