/**
 * I18nContext – React context provider for internationalization.
 *
 * Wraps the app with language state, a `t()` function, and direction info.
 * Persists the chosen locale to AsyncStorage so the preference survives restarts.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  getSavedLocale,
  saveLocale,
  translate,
  getDirection,
  textAlign,
  flexDirection,
  forceDirection,
  type Locale,
  type Direction,
} from "./i18n";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface I18nContextValue {
  /** Current active locale */
  locale: Locale;
  /** Translate a dot-notation key – e.g. t("common.ok") */
  t: (key: string) => string;
  /** Direction string: "rtl" | "ltr" */
  direction: Direction;
  /** Whether the layout should be right-to-left */
  isRTL: boolean;
  /** Text-align value for the current locale */
  textAlign: "right" | "left";
  /** Flex-direction value for the current locale */
  flexDirection: "row" | "row-reverse";
  /** Switch to a different locale and persist it */
  setLocale: (locale: Locale) => Promise<void>;
  /** All available locales */
  locales: Locale[];
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const I18nContext = createContext<I18nContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ar");
  const [ready, setReady] = useState(false);

  // Restore saved locale on mount
  useEffect(() => {
    getSavedLocale().then((saved) => {
      if (saved) {
        setLocaleState(saved);
        forceDirection(saved);
      }
      setReady(true);
    });
  }, []);

  const setLocale = useCallback(async (next: Locale) => {
    setLocaleState(next);
    forceDirection(next);
    await saveLocale(next);
  }, []);

  const t = useCallback(
    (key: string): string => translate(locale, key),
    [locale],
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      t,
      direction: getDirection(locale),
      isRTL: locale === "ar",
      textAlign: textAlign(locale),
      flexDirection: flexDirection(locale),
      setLocale,
      locales: ["ar", "nl", "en"],
    }),
    [locale, t, setLocale],
  );

  if (!ready) return null;

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Access the i18n context from any component.
 * Returns `{ locale, t, direction, isRTL, textAlign, flexDirection, setLocale, locales }`.
 */
export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
