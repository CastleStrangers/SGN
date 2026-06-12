/**
 * Formats a Date object or ISO date string into a localized format.
 *
 * For Arabic (ar), it forces Eastern Arabic numerals using "ar-EG-u-nu-arab".
 * For Dutch (nl), it uses "nl-NL".
 * For English (en), it uses "en-US".
 */
export function formatDate(
  date: Date | string | number | undefined | null,
  locale: string,
  options?: any
): string {
  if (!date) return "";
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";

  let resolvedLocale = "en-US";
  if (locale === "ar") {
    resolvedLocale = "ar-EG-u-nu-arab";
  } else if (locale === "nl") {
    resolvedLocale = "nl-NL";
  } else if (locale === "en") {
    resolvedLocale = "en-US";
  } else if (locale) {
    resolvedLocale = locale;
  }

  try {
    return d.toLocaleDateString(resolvedLocale, options);
  } catch (e) {
    // Fallback if the js engine doesn't support the full options/locale string
    return d.toLocaleDateString(locale === "ar" ? "ar" : locale === "nl" ? "nl" : "en", options);
  }
}

/**
 * Formats a Date object or ISO date string into a localized time format.
 */
export function formatTime(
  date: Date | string | number | undefined | null,
  locale: string,
  options?: any
): string {
  if (!date) return "";
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";

  let resolvedLocale = "en-US";
  if (locale === "ar") {
    resolvedLocale = "ar-EG-u-nu-arab";
  } else if (locale === "nl") {
    resolvedLocale = "nl-NL";
  } else if (locale === "en") {
    resolvedLocale = "en-US";
  } else if (locale) {
    resolvedLocale = locale;
  }

  try {
    return d.toLocaleTimeString(resolvedLocale, options);
  } catch (e) {
    return d.toLocaleTimeString(locale === "ar" ? "ar" : locale === "nl" ? "nl" : "en", options);
  }
}
