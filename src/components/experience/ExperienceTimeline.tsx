import { TechList } from "@/components/ui/primitives";
import type { ExperienceEntry } from "@/content/types";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { formatPeriod } from "@/lib/format";

export function ExperienceTimeline({
  entries,
  locale,
  dict,
  compact = false,
}: {
  entries: ExperienceEntry[];
  locale: Locale;
  dict: Dictionary;
  compact?: boolean;
}) {
  return (
    <ol className="relative">
      {entries.map((entry, i) => {
        const current = entry.end === null;
        return (
          <li key={entry.id} className="reveal relative grid gap-3 pb-10 pl-8 last:pb-0 md:grid-cols-[180px_1fr] md:gap-10 md:pl-0">
            {/* rail */}
            <span aria-hidden className="absolute bottom-0 left-[5px] top-2 w-px bg-line md:left-[195px]" />
            <span
              aria-hidden
              className={`absolute left-0 top-1.5 size-[11px] rounded-full border-2 md:left-[190px] ${
                current ? "border-fg bg-fg" : "border-line-strong bg-bg"
              }`}
            />
            <div className="font-mono text-xs text-fg-subtle md:pt-0.5 md:text-right">
              <span className={current ? "text-accent" : ""}>{formatPeriod(entry.start, entry.end, locale, dict.common.present)}</span>
              <span className="mt-1 block">{entry.location[locale]}</span>
            </div>
            <div className="md:pl-10">
              <h3 className="text-lg font-semibold tracking-tight">{entry.role[locale]}</h3>
              <p className="mt-0.5 text-sm text-fg-muted">{entry.organization[locale]}</p>
              {!compact && (
                <>
                  <ul className="mt-4 space-y-1.5 text-sm leading-relaxed text-fg-muted">
                    {entry.focus.map((f, k) => (
                      <li key={k} className="flex gap-3">
                        <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-accent" />
                        <span>{f[locale]}</span>
                      </li>
                    ))}
                  </ul>
                  {entry.technologies && (
                    <div className="mt-4">
                      <TechList items={entry.technologies} label={dict.common.technologies} />
                    </div>
                  )}
                </>
              )}
              {compact && i === 0 && (
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{entry.focus.slice(0, 3).map((f) => f[locale]).join(" · ")}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
