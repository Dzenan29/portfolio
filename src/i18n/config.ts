export const locales = ["en", "de"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, { short: string; long: string; htmlLang: string; og: string }> = {
  en: { short: "EN", long: "English", htmlLang: "en", og: "en_US" },
  de: { short: "DE", long: "Deutsch", htmlLang: "de", og: "de_DE" },
};

export const LOCALE_STORAGE_KEY = "dk-locale";

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** Text that exists in every supported language. */
export type Localized<T = string> = Record<Locale, T>;

export function pick<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}

/**
 * Route segments stay identical across languages (`/en/projects`, `/de/projects`) so that
 * switching language always lands on the equivalent page and static hosting needs no rewrites.
 */
export const routes = {
  home: "/",
  projects: "/projects/",
  project: (slug: string) => `/projects/${slug}/`,
  expertise: "/expertise/",
  about: "/about/",
  experience: "/experience/",
  lab: "/lab/",
  contact: "/contact/",
} as const;

/** Prefix a route with its locale: localePath("de", "/projects/") -> "/de/projects/". */
export function localePath(locale: Locale, path: string = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return clean === "/" ? `/${locale}/` : `/${locale}${clean}`;
}

/** Swap the locale segment of a pathname that already contains one. */
export function switchLocalePath(pathname: string, target: Locale): string {
  const parts = pathname.split("/");
  const index = parts.findIndex((segment) => isLocale(segment));
  if (index === -1) return localePath(target, "/");
  parts[index] = target;
  return parts.join("/") || "/";
}
