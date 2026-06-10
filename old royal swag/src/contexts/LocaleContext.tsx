"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_LOCALE,
  detectLocaleFromPath,
  getMessages,
  type Locale,
  t as translate,
} from "@/lib/i18n";

type LocaleContextValue = {
  locale: Locale;
  t: (key: string) => string;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const pathLocale = detectLocaleFromPath(pathname);
  const [locale, setLocaleState] = useState<Locale>(pathLocale);

  useEffect(() => {
    setLocaleState(pathLocale);
    try {
      localStorage.setItem("lang", pathLocale);
    } catch {
      /* ignore */
    }
  }, [pathLocale]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale === "hi" ? "hi" : "en";
    }
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem("lang", next);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      t: (key: string) => translate(locale, key),
      setLocale,
    }),
    [locale, setLocale]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    return {
      locale: DEFAULT_LOCALE,
      t: (key: string) => translate(DEFAULT_LOCALE, key),
      setLocale: () => {},
    };
  }
  return ctx;
}

export function useTranslations() {
  const { locale, t } = useLocale();
  return { locale, t, messages: getMessages(locale) };
}
