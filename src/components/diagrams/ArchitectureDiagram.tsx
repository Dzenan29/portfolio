import type { ArchitectureStage, StageKind } from "@/content/types";
import type { Locale } from "@/i18n/config";

const kindLabel: Record<StageKind, Record<Locale, string>> = {
  hardware: { en: "hardware", de: "Hardware" },
  firmware: { en: "firmware", de: "Firmware" },
  network: { en: "network", de: "Netzwerk" },
  service: { en: "service", de: "Dienst" },
  data: { en: "data", de: "Daten" },
  ui: { en: "interface", de: "Oberfläche" },
  ops: { en: "operations", de: "Betrieb" },
};

const kindColor: Record<StageKind, string> = {
  hardware: "var(--fg-subtle)",
  firmware: "var(--fg-subtle)",
  network: "var(--fg-subtle)",
  service: "var(--fg-subtle)",
  data: "var(--fg-subtle)",
  ui: "var(--fg-subtle)",
  ops: "var(--fg-subtle)",
};

/**
 * AnimatedArchitectureDiagram: a left-to-right signal chain (top-to-bottom on phones).
 * The ordered list *is* the accessible description; the traces are decoration.
 */
export function ArchitectureDiagram({
  stages,
  locale,
  plannedLabel,
  compact = false,
  label,
}: {
  stages: ArchitectureStage[];
  locale: Locale;
  plannedLabel: string;
  compact?: boolean;
  label: string;
}) {
  return (
    <ol
      aria-label={label}
      className={`relative grid gap-3 ${compact ? "grid-cols-2 sm:grid-cols-3" : "md:grid-flow-col md:auto-cols-fr"}`}
    >
      {stages.map((stage, i) => {
        const last = i === stages.length - 1;
        return (
          <li key={stage.id} className="reveal relative" style={{ transitionDelay: `${i * 80}ms` }}>
            <div
              className={`relative h-full rounded-xl border bg-surface p-3.5 ${
                stage.planned ? "border-dashed border-line-strong" : "border-line"
              } ${compact ? "p-2.5" : ""}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
                <span
                  className="font-mono text-[9px] uppercase tracking-wider"
                  style={{ color: kindColor[stage.kind] }}
                >
                  {kindLabel[stage.kind][locale]}
                </span>
              </div>
              <p className={`mt-2 font-medium leading-tight ${compact ? "text-xs" : "text-sm"}`}>{stage.label[locale]}</p>
              {!compact && <p className="mt-1 text-xs leading-snug text-fg-muted">{stage.detail[locale]}</p>}
              {stage.planned && (
                <p className="mt-2 inline-block rounded border border-dashed border-line-strong px-1.5 font-mono text-[9px] uppercase tracking-wider text-fg-subtle">
                  {plannedLabel}
                </p>
              )}
            </div>
            {!last && !compact && (
              <>
                {/* horizontal trace (desktop) */}
                <span aria-hidden className="absolute -right-3 top-1/2 hidden h-px w-3 md:block">
                  <svg className="absolute inset-0 h-px w-3 overflow-visible">
                    <line x1="0" y1="0" x2="12" y2="0" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="3 3" className="anim-flow" />
                  </svg>
                </span>
                {/* vertical trace (mobile) */}
                <span aria-hidden className="absolute -bottom-3 left-6 h-3 w-px bg-accent/60 md:hidden" />
              </>
            )}
          </li>
        );
      })}
    </ol>
  );
}
