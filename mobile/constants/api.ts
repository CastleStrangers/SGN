/**
 * API constants – reads from the environment-aware config.
 *
 * IMPORTANT:
 *   Before building a production APK/IPA, run:
 *     npm run set:prod
 *
 *   This sets APP_ENV=production so the app uses the live server URL.
 */

import { CONFIG } from "./config";

/** Full API URL (with `/api` suffix) — used by lib/api.ts */
export const API_URL = CONFIG.API_URL;

/** Alias for consistency */
export const API_BASE = API_URL;

export const API_TIMEOUT = CONFIG.API_TIMEOUT;
export const WS_URL = CONFIG.WS_URL;
export const APP_URL = CONFIG.APP_URL;
