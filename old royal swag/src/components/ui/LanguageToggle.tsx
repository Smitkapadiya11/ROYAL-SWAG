"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { trackUnified } from "@/lib/analytics";
import { pathWithLocale, type Locale } from "@/lib/i18n";
import { useLocale } from "@/contexts/LocaleContext";
import { cn } from "@/lib/utils";

type LanguageToggleProps = {
  className?: string;
  compact?: boolean;
};

export default function LanguageToggle({
  className,
  compact = false,
}: LanguageToggleProps) {
  const { locale } = useLocale();
  const pathname = usePathname() ?? "/";
  const router = useRouter();

  const switchTo = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      try {
        localStorage.setItem("lang", next);
      } catch {
        /* ignore */
      }
      const href = pathWithLocale(pathname, next);
      trackUnified.customEvent("language_toggle", { from: locale, to: next, page: pathname });
      router.push(href);
    },
    [locale, pathname, router]
  );

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-primary/15 bg-white/60 p-0.5 font-body text-xs font-semibold",
        className
      )}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => switchTo("en")}
        className={cn(
          "rounded-full px-2.5 py-1 transition-colors",
          locale === "en"
            ? "bg-primary text-white"
            : "text-on-surface-variant hover:text-primary",
          compact && "px-2 py-0.5"
        )}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => switchTo("hi")}
        className={cn(
          "rounded-full px-2.5 py-1 transition-colors",
          locale === "hi"
            ? "bg-primary text-white"
            : "text-on-surface-variant hover:text-primary",
          compact && "px-2 py-0.5"
        )}
        aria-pressed={locale === "hi"}
      >
        HI
      </button>
    </div>
  );
}
