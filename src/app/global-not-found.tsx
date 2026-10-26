import type { Metadata } from "next";
import { de } from "@/i18n/dictionaries/de";
import { en } from "@/i18n/dictionaries/en";
import { geistMono, geistSans } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = { title: "404 | Dzenan Kusi", robots: { index: false } };

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function GlobalNotFound() {
  return (
    <html lang="en" data-theme="dark" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-grid flex min-h-dvh items-center justify-center bg-bg px-4 text-fg">
        <main className="max-w-lg">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">404 · no carrier</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight">{en.notFound.title}</h1>
          <p className="mt-3 text-fg-muted">{en.notFound.lead}</p>
          <p className="mt-1 text-fg-subtle" lang="de">{de.notFound.lead}</p>
          <div className="mt-8 flex gap-3 font-mono text-sm">
            <a href={`${base}/en/`} className="rounded-lg bg-fg px-4 py-2 text-bg">
              {en.notFound.cta}
            </a>
            <a href={`${base}/de/`} lang="de" className="rounded-lg border border-line px-4 py-2">
              {de.notFound.cta}
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
