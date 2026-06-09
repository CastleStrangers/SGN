const { createClient } = require("@libsql/client");
const fs = require("fs");
const path = require("path");

function loadEnv(filePath) {
  const content = fs.readFileSync(filePath, "utf8").trim();
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

const env = loadEnv(path.resolve(__dirname, "..", ".env"));

const turso = createClient({
  url: env.TURSO_DATABASE_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});

(async () => {
  const sql = "CREATE TABLE IF NOT EXISTS AppSetting (key TEXT PRIMARY KEY, value TEXT NOT NULL)";
  try {
    await turso.execute(sql);
    console.log("OK: AppSetting table created");
  } catch (e) {
    console.log("ERROR:", e.message);
  }
  process.exit(0);
})();
