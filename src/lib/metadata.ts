import type { Metadata } from "next";
import { site } from "@/content/site";
import { getDictionary } from "@/i18n";
import { type Locale, localeLabels, localePath, locales } from "@/i18n/config";

export function absoluteUrl(path: string): string {
  return `${site.url}${path}`;
}

interface PageMeta {
  locale: Locale;
  /** Route without locale, e.g. "/projects/" */
  path: string;
  title?: string;
  description?: string;
  type?: "website" | "article" | "profile";
}

export function buildMetadata({ locale, path, title, description, type = "website" }: PageMeta): Metadata {
  const dict = getDictionary(locale);
  const fullTitle = title ? `${title} | ${site.name}` : dict.meta.siteTitle;
  const desc = description ?? dict.meta.siteDescription;
  const url = absoluteUrl(localePath(locale, path));
  const languages: Record<string, string> = {};
  for (const l of locales) languages[localeLabels[l].htmlLang] = absoluteUrl(localePath(l, path));
  languages["x-default"] = absoluteUrl(localePath("en", path));
  const ogImage = absoluteUrl("/og.png");

  return {
    title: fullTitle,
    description: desc,
    alternates: { canonical: url, languages },
    openGraph: {
      type,
      url,
      title: fullTitle,
      description: desc,
      siteName: site.name,
      locale: localeLabels[locale].og,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeLabels[l].og),
      images: [{ url: ogImage, width: 1200, height: 630, alt: dict.meta.siteTitle }],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description: desc, images: [ogImage] },
  };
}
