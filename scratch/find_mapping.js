import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { createClient } from "@libsql/client";

const tmpDbPath = path.join(process.cwd(), "prisma", "dev-check.db");

const commits = [
  "53706c0", "fc48074", "040f10c", "745597f", "5dbee28", "32f7a07"
];

async function main() {
  console.log("=== LISTING TABLES FOR COMMITS ===");
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
          const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
          console.log(`\nCommit: ${commit}`);
          console.log(`Tables: ${tables.rows.map(r => r.name).join(", ")}`);
        } catch (dbErr) {
          console.log(`\nCommit ${commit} DB error: ${dbErr.message}`);
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
