import type { Locale } from "@/i18n/config";

/** "2022-11" -> "Nov 2022"; "2019" -> "2019". */
export function formatMonth(value: string, locale: Locale): string {
  const [year, month] = value.split("-");
  if (!month) return year ?? value;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, 1));
  return new Intl.DateTimeFormat(locale === "de" ? "de-DE" : "en-GB", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatPeriod(start: string, end: string | null, locale: Locale, presentLabel: string) {
  const s = formatMonth(start, locale);
  if (end === null) return `${s} – ${presentLabel}`;
  const e = formatMonth(end, locale);
  return s === e ? s : `${s} – ${e}`;
}
