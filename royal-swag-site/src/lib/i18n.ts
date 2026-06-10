import en from "@/locales/en.json";
import hi from "@/locales/hi.json";

export const LOCALES = ["en", "hi"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

const MESSAGES: Record<Locale, Record<string, string>> = { en, hi };

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function getMessages(locale: Locale): Record<string, string> {
  return MESSAGES[locale] ?? MESSAGES.en;
}

export function t(locale: Locale, key: string): string {
  const messages = getMessages(locale);
  return messages[key] ?? MESSAGES.en[key] ?? key;
}

/** Strip /hi or /en prefix from pathname */
export function stripLocalePrefix(pathname: string): string {
  const match = pathname.match(/^\/(hi|en)(\/.*|$)/);
  if (!match) return pathname || "/";
  const rest = match[2];
  return rest === "" || rest === "/" ? "/" : rest;
}

export function pathWithLocale(pathname: string, locale: Locale): string {
  const base = stripLocalePrefix(pathname);
  if (locale === "en") {
    return base === "/" ? "/" : base;
  }
  return base === "/" ? "/hi" : `/hi${base}`;
}

export function detectLocaleFromPath(pathname: string): Locale {
  if (pathname === "/hi" || pathname.startsWith("/hi/")) return "hi";
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  return DEFAULT_LOCALE;
}
