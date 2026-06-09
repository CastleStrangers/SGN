const { createClient } = require("@libsql/client");

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

(async () => {
  const cmds = [
    "ALTER TABLE Member ADD COLUMN status TEXT DEFAULT 'pending'",
    "ALTER TABLE Member ADD COLUMN notes TEXT",
    "ALTER TABLE Member ADD COLUMN email TEXT",
    "CREATE TABLE IF NOT EXISTS AppSetting (key TEXT PRIMARY KEY, value TEXT NOT NULL)",
  ];
  for (const sql of cmds) {
    try {
      await turso.execute(sql);
      console.log("OK:", sql.slice(0, 50));
    } catch (e) {
      if (!e.message.includes("duplicate")) console.log("SKIP:", e.message);
      else console.log("DONE:", sql.slice(0, 50));
    }
  }
  process.exit(0);
})();
