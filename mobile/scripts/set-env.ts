/**
 * set-env.ts
 *
 * Build-time script that sets the API URL for the mobile app.
 *
 * Usage:
 *   npx tsx scripts/set-env.ts dev   →  http://localhost:3001
 *   npx tsx scripts/set-env.ts prod  →  https://sgn-indol.vercel.app
 *
 * This overwrites the DEV_API_BASE in constants/config.ts
 * so the built APK/IPA connects to the correct server.
 */

import * as fs from "fs";
import * as path from "path";

const CONFIG_PATH = path.resolve(__dirname, "../constants/config.ts");
const mode = process.argv[2]; // "dev" | "prod"

if (!mode || !["dev", "prod"].includes(mode)) {
  console.error("Usage: npx tsx scripts/set-env.ts <dev|prod>");
  process.exit(1);
}

const PRODUCTION_URL = "https://sgn-indol.vercel.app";
const DEV_URL = "http://localhost:3001";
const targetUrl = mode === "prod" ? PRODUCTION_URL : DEV_URL;

let content = fs.readFileSync(CONFIG_PATH, "utf-8");

// Replace the dev API base
content = content.replace(
  /const DEV_API_BASE = process\.env\.EXPO_PUBLIC_API_URL \|\| "[^"]*"/,
  `const DEV_API_BASE = process.env.EXPO_PUBLIC_API_URL || "${targetUrl}"`,
);

// Replace the production URLs
content = content.replace(
  /const PRODUCTION_API_URL = "[^"]*"/,
  `const PRODUCTION_API_URL = "${PRODUCTION_URL}/api"`,
);
content = content.replace(
  /const PRODUCTION_WS_URL = "[^"]*"/,
  `const PRODUCTION_WS_URL = "wss://${new URL(PRODUCTION_URL).host}"`,
);

// Replace the APP_URL
content = content.replace(
  /APP_URL: IS_PRODUCTION \? "[^"]*" : DEV_API_BASE/,
  `APP_URL: IS_PRODUCTION ? "${PRODUCTION_URL}" : DEV_API_BASE`,
);

fs.writeFileSync(CONFIG_PATH, content, "utf-8");
console.log(`[set-env] Mobile API URL set to: ${targetUrl}`);
