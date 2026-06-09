const { createClient } = require("@libsql/client");

const url = process.env.TURSO_DATABASE_URL;
const token = process.env.TURSO_AUTH_TOKEN;

if (!url || !token) {
  console.error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN");
  process.exit(1);
}

const turso = createClient({ url, authToken: token });

const sql = `CREATE TABLE IF NOT EXISTS Member (
  id TEXT PRIMARY KEY,
  nameAr TEXT NOT NULL,
  nameNl TEXT NOT NULL,
  birthYear INTEGER NOT NULL,
  gender TEXT NOT NULL,
  originCity TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  nlProvincie TEXT NOT NULL,
  nlCity TEXT NOT NULL,
  expNl TEXT,
  expOutside TEXT,
  agreed INTEGER DEFAULT 1,
  userId TEXT,
  createdAt TEXT DEFAULT (datetime('now'))
)`;

const sqlIndex = `CREATE UNIQUE INDEX IF NOT EXISTS Member_userId_key ON Member(userId)`;

(async () => {
  try {
    await turso.execute(sql);
    console.log("Member table created!");
    await turso.execute(sqlIndex);
    console.log("Index created!");
    process.exit(0);
  } catch (e) {
    console.error("Error:", e.message);
    process.exit(1);
  }
})();
