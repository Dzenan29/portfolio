import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { RevealObserver } from "@/components/layout/RevealObserver";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ThemeScript } from "@/components/layout/ThemeScript";
import { site } from "@/content/site";
import { getDictionary } from "@/i18n";
import { isLocale, localeLabels, locales } from "@/i18n/config";
import { geistMono, geistSans } from "@/lib/fonts";
import { buildMetadata } from "@/lib/metadata";
import { asset } from "@/lib/paths";
import "../globals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#080b10" },
    { media: "(prefers-color-scheme: light)", color: "#f6f8fa" },
  ],
  colorScheme: "dark light",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    metadataBase: new URL(site.url),
    ...buildMetadata({ locale, path: "/" }),
    authors: [{ name: site.name }],
    creator: site.name,
    icons: { icon: asset("/favicon.svg") },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <html
      lang={localeLabels[locale].htmlLang}
      data-theme="dark"
      className={`no-js ${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink"
        >
          {dict.a11y.skipToContent}
        </a>
        <SiteHeader locale={locale} dict={{ nav: dict.nav, a11y: dict.a11y }} />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter locale={locale} dict={dict} />
        <RevealObserver />
      </body>
    </html>
  );
}
