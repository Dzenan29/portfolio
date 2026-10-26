"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { LOCALE_STORAGE_KEY, type Locale, localeLabels, locales, switchLocalePath } from "@/i18n/config";

export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname() ?? `/${locale}/`;

  // Remember the language the visitor is reading in; "/" uses it on the next visit.
  useEffect(() => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      /* storage unavailable */
    }
  }, [locale]);

  return (
    <nav aria-label={label} className="flex items-center rounded-lg border border-line p-0.5 font-mono text-xs">
      {locales.map((l) => {
        const active = l === locale;
        return (
          <Link
            key={l}
            href={switchLocalePath(pathname, l)}
            hrefLang={localeLabels[l].htmlLang}
            lang={localeLabels[l].htmlLang}
            aria-current={active ? "true" : undefined}
            aria-label={localeLabels[l].long}
            data-testid={`lang-${l}`}
            className={`rounded-md px-2 py-1.5 tracking-wider transition-colors ${
              active ? "bg-surface-2 text-fg" : "text-fg-subtle hover:text-fg"
            }`}
          >
            {localeLabels[l].short}
          </Link>
        );
      })}
    </nav>
  );
}
