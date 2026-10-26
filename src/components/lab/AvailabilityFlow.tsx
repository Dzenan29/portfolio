"use client";

import { useId, useState } from "react";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { initialMonitorState, type MonitorMessage, step } from "@/lib/healthcheck";

type Labels = Dictionary["lab"]["flow"] & { simulated: string; reset: string };

const stages = [
  { id: "check", name: "http request" },
  { id: "count", name: "count failures" },
  { id: "switch", name: "threshold?" },
  { id: "quiet", name: "quiet hours?" },
  { id: "notify", name: "notify" },
] as const;

type StageId = (typeof stages)[number]["id"];

/** Which stages a message travelled through - drives the highlight in the flow. */
function pathOf(message: MonitorMessage): StageId[] {
  switch (message.type) {
    case "ok":
      return ["check"];
    case "failure":
      return ["check", "count", "switch"];
    case "alert":
      return message.delivered ? ["check", "count", "switch", "quiet", "notify"] : ["check", "count", "switch", "quiet"];
    case "recovery":
      return message.delivered ? ["check", "quiet", "notify"] : ["check", "quiet"];
  }
}

function describe(m: MonitorMessage, locale: Locale): string {
  const de = locale === "de";
  switch (m.type) {
    case "ok":
      return de ? "OK - nichts zu tun" : "OK - nothing to do";
    case "failure":
      return de ? `Fehler #${m.count} - noch kein Alarm` : `failure #${m.count} - no alert yet`;
    case "alert":
      return m.delivered
        ? de ? `ALARM nach ${m.count} Fehlern gesendet` : `ALERT sent after ${m.count} failures`
        : de ? `Alarm nach ${m.count} Fehlern - wegen Ruhezeit zurückgehalten` : `alert after ${m.count} failures - held back (quiet hours)`;
    case "recovery":
      return m.delivered
        ? de ? "ENTWARNUNG gesendet - Dienst antwortet wieder" : "RECOVERY sent - service responds again"
        : de ? "Erholt - Entwarnung wegen Ruhezeit zurückgehalten" : "recovered - notice held back (quiet hours)";
  }
}

export function AvailabilityFlow({ locale, labels }: { locale: Locale; labels: Labels }) {
  const [state, setState] = useState(initialMonitorState);
  const [threshold, setThreshold] = useState(3);
  const [quiet, setQuiet] = useState(false);
  const [log, setLog] = useState<{ n: number; msg: MonitorMessage }[]>([]);
  const [lit, setLit] = useState<StageId[]>([]);
  const uid = useId();

  function run(ok: boolean) {
    const result = step(state, ok, { failureThreshold: threshold }, quiet);
    setState(result.state);
    setLit(pathOf(result.message));
    setLog((l) => [{ n: (l[0]?.n ?? 0) + 1, msg: result.message }, ...l].slice(0, 12));
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <div className="panel p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">flow · availability-check</span>
          <span className="rounded border border-line-strong px-1.5 font-mono text-[10px] uppercase text-fg-subtle">{labels.simulated}</span>
        </div>
        <ol className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-0" aria-label="flow">
          {stages.map((s, i) => {
            const on = lit.includes(s.id);
            return (
              <li key={s.id} className="flex items-center sm:flex-1">
                <span
                  data-active={on}
                  className={`flex w-full items-center gap-2 rounded-md border px-2.5 py-2 font-mono text-[11px] transition-colors sm:justify-center ${
                    on ? "border-accent bg-accent-soft text-fg" : "border-line bg-bg/40 text-fg-subtle"
                  }`}
                >
                  <span aria-hidden className={`size-1.5 rounded-full ${on ? "bg-accent" : "bg-line-strong"}`} />
                  {s.name}
                </span>
                {i < stages.length - 1 && <span aria-hidden className={`hidden h-px w-4 shrink-0 sm:block ${on && lit.includes(stages[i + 1]!.id) ? "bg-accent" : "bg-line-strong"}`} />}
              </li>
            );
          })}
        </ol>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-fg-muted">{labels.inject}</p>
            <div className="mt-2 flex gap-2">
              <button type="button" onClick={() => run(true)} data-testid="flow-ok" className="min-h-10 flex-1 rounded-lg border border-teal/40 bg-teal-soft px-3 text-sm text-teal hover:border-teal">
                ✓ {labels.ok}
              </button>
              <button type="button" onClick={() => run(false)} data-testid="flow-fail" className="min-h-10 flex-1 rounded-lg border border-crit/40 bg-crit-soft px-3 text-sm text-crit hover:border-crit">
                ✕ {labels.fail}
              </button>
            </div>
          </div>
          <div className="space-y-3">
            <label htmlFor={`${uid}-th`} className="flex items-center justify-between text-xs text-fg-muted">
              <span>{labels.threshold}</span>
              <span className="font-mono text-fg">{threshold}</span>
            </label>
            <input id={`${uid}-th`} type="range" min={1} max={5} value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} className="w-full" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={quiet} onChange={(e) => setQuiet(e.target.checked)} className="size-4 accent-[var(--accent)]" />
              {labels.quiet}
            </label>
          </div>
        </div>
        <p className="mt-5 font-mono text-[11px] text-fg-subtle">
          state: {state.alerting ? "ALERTING" : "OK"} · consecutive_failures={state.consecutiveFailures}
        </p>
      </div>

      <div className="panel flex flex-col p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">{labels.log}</p>
          <button
            type="button"
            onClick={() => {
              setState(initialMonitorState);
              setLog([]);
              setLit([]);
            }}
            className="font-mono text-[11px] text-fg-muted hover:text-fg"
          >
            {labels.reset}
          </button>
        </div>
        <ol aria-live="polite" className="mt-3 space-y-1.5 font-mono text-xs" data-testid="flow-log">
          {log.length === 0 && <li className="font-sans text-sm text-fg-muted">{labels.empty}</li>}
          {log.map(({ n, msg }) => (
            <li
              key={n}
              className={`rounded-md border px-2.5 py-1.5 ${
                msg.type === "alert" ? "border-crit/40 text-crit" : msg.type === "recovery" ? "border-teal/40 text-teal" : "border-line text-fg-muted"
              }`}
            >
              <span className="text-fg-subtle">#{String(n).padStart(2, "0")}</span> {describe(msg, locale)}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
