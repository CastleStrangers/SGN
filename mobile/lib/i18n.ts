/**
 * i18n Core Engine
 *
 * Lightweight internationalization for the mobile app.
 * Supports Arabic (ar), Dutch (nl), English (en).
 * Persists user preference via AsyncStorage.
 * Provides RTL/LTR direction utilities.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { I18nManager } from "react-native";

import ar from "../i18n/ar.json";
import nl from "../i18n/nl.json";
import en from "../i18n/en.json";

export type Locale = "ar" | "nl" | "en";

/** All translation dictionaries keyed by locale */
const messages: Record<Locale, Record<string, any>> = { ar, nl, en };

const STORAGE_KEY = "app_locale";

// ---------------------------------------------------------------------------
// Language persistence
// ---------------------------------------------------------------------------

/** Read the saved locale from AsyncStorage */
export async function getSavedLocale(): Promise<Locale | null> {
  try {
    const val = await AsyncStorage.getItem(STORAGE_KEY);
    if (val === "ar" || val === "nl" || val === "en") return val;
    return null;
  } catch {
    return null;
  }
}

/** Persist the chosen locale to AsyncStorage */
export async function saveLocale(locale: Locale): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Silently fail – storage may be unavailable
  }
}

// ---------------------------------------------------------------------------
// Translation lookup
// ---------------------------------------------------------------------------

/**
 * Resolve a dot-notation key against a messages dictionary.
 * Returns the key itself if not found.
 *
 * @example
 *   t("home.searchPlaceholder")      // "بحث عن أخبار..."
 *   t("settings.pushNotifications")  // "الإشعارات الفورية"
 */
export function resolveKey(
  dict: Record<string, any>,
  key: string,
): string {
  const parts = key.split(".");
  let current: any = dict;
  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = current[part];
    } else {
      return key; // fallback: return the key itself
    }
  }
  return typeof current === "string" ? current : key;
}

/**
 * Translate a dot-notation key for the given locale.
 *
 * @param locale – current active locale
 * @param key    – dot-notation key, e.g. "common.ok"
 */
export function translate(locale: Locale, key: string): string {
  const dict = messages[locale];
  if (!dict) return key;
  return resolveKey(dict, key);
}

// ---------------------------------------------------------------------------
// Direction utilities
// ---------------------------------------------------------------------------

export type Direction = "rtl" | "ltr";

/** Return "rtl" for Arabic, "ltr" for Dutch and English */
export function getDirection(locale: Locale): Direction {
  return locale === "ar" ? "rtl" : "ltr";
}

/** Text-align value matching the locale direction */
export function textAlign(locale: Locale): "right" | "left" {
  return locale === "ar" ? "right" : "left";
}

/** Flex-direction value matching the locale direction */
export function flexDirection(locale: Locale): "row" | "row-reverse" {
  return locale === "ar" ? "row-reverse" : "row";
}

/** Margin/padding start/end value based on direction – returns "left" for LTR, "right" for RTL */
export function startAlign(locale: Locale): "left" | "right" {
  return locale === "ar" ? "right" : "left";
}

/** Margin/padding end value based on direction */
export function endAlign(locale: Locale): "left" | "right" {
  return locale === "ar" ? "left" : "right";
}

/** Apply RTL/LTR to I18nManager (requires app restart on Android) */
export function forceDirection(locale: Locale): void {
  const isRtl = locale === "ar";
  if (I18nManager.isRTL !== isRtl) {
    I18nManager.forceRTL(isRtl);
    I18nManager.allowRTL(isRtl);
  }
}
