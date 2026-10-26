import type { Metadata } from "next";
import { site } from "@/content/site";
import { en } from "@/i18n/dictionaries/en";
import "../globals.css";

export const metadata: Metadata = {
  title: en.meta.siteTitle,
  description: en.meta.siteDescription,
  alternates: {
    canonical: `${site.url}/en/`,
    languages: { en: `${site.url}/en/`, de: `${site.url}/de/`, "x-default": `${site.url}/en/` },
  },
  robots: { index: false, follow: true },
};

/** Root layout for the language-detection entry page at "/". */
export default function RootRedirectLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body>{children}</body>
    </html>
  );
}
