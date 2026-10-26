"use client";

import { useId, useRef, useState } from "react";
import type { Dictionary } from "@/i18n";
import { type AlertLevel, evaluate, type Transition, transition } from "@/lib/alerts";
import { createRandom } from "@/lib/random";
import { useInterval } from "@/lib/useInterval";

type Labels = Dictionary["lab"]["iot"] & { simulated: string; pause: string; resume: string; reset: string };
type ChannelId = "temperature" | "pressure" | "oxygen";

interface ChannelConfig {
  id: ChannelId;
  unit: string;
  min: number;
  max: number;
  step: number;
  setpoint: number;
  warning: number;
  critical: number;
  noise: number;
}

const configs: ChannelConfig[] = [
  { id: "temperature", unit: "°C", min: 0, max: 60, step: 0.5, setpoint: 22, warning: 30, critical: 40, noise: 0.6 },
  { id: "pressure", unit: "bar", min: 0, max: 12, step: 0.1, setpoint: 6, warning: 8, critical: 10, noise: 0.15 },
  { id: "oxygen", unit: "ppm", min: 0, max: 20, step: 0.1, setpoint: 2, warning: 5, critical: 10, noise: 0.3 },
];

const HISTORY = 60;

interface ChannelState extends ChannelConfig {
  history: number[];
  level: AlertLevel;
}

interface LogEntry extends Transition {
  t: number;
  channel: ChannelId;
  value: number;
}

function initial(): ChannelState[] {
  return configs.map((c) => ({ ...c, history: Array.from({ length: HISTORY }, () => c.setpoint), level: "normal" }));
}

const levelStyle: Record<AlertLevel, { text: string; badge: string; icon: string }> = {
  normal: { text: "text-teal", badge: "border-teal/30 bg-teal-soft text-teal", icon: "●" },
  warning: { text: "text-warn", badge: "border-warn/30 bg-warn-soft text-warn", icon: "▲" },
  critical: { text: "text-crit", badge: "border-crit/40 bg-crit-soft text-crit", icon: "■" },
};

export function SimulatedSensorDashboard({ labels }: { labels: Labels }) {
  const [channels, setChannels] = useState<ChannelState[]>(initial);
  const [selected, setSelected] = useState<ChannelId>("pressure");
  const [running, setRunning] = useState(true);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [t, setT] = useState(0);
  const rnd = useRef(createRandom(42));
  const uid = useId();

  function advance(nextChannels: (c: ChannelState) => Partial<ChannelState>, appendSample: boolean) {
    const time = appendSample ? t + 1 : t;
    const events: LogEntry[] = [];
    const next = channels.map((c) => {
      const merged = { ...c, ...nextChannels(c) };
      const sample = appendSample
        ? Math.max(merged.min, merged.setpoint + (rnd.current() - 0.5) * 2 * merged.noise)
        : (merged.history.at(-1) ?? merged.setpoint);
      const history = appendSample ? [...merged.history.slice(1), sample] : merged.history;
      const level = evaluate(sample, { warning: merged.warning, critical: merged.critical });
      const tr = transition(c.level, level);
      if (tr) events.push({ ...tr, t: time, channel: c.id, value: sample });
      return { ...merged, history, level };
    });
    setChannels(next);
    if (appendSample) setT(time);
    if (events.length) setLog((l) => [...events.reverse(), ...l].slice(0, 30));
  }

  useInterval(() => advance(() => ({}), true), 1000, running);

  /** Changing a control re-evaluates immediately, even while paused. */
  const update = (id: ChannelId, patch: Partial<ChannelConfig>) =>
    advance((c) => (c.id === id ? (patch.setpoint !== undefined ? { ...patch, history: [...c.history.slice(1), patch.setpoint] } : patch) : {}), false);

  const sel = channels.find((c) => c.id === selected)!;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-4">
        <div role="tablist" aria-label={labels.channel} className="grid grid-cols-3 gap-2">
          {channels.map((c) => {
            const current = c.history.at(-1) ?? 0;
            const s = levelStyle[c.level];
            return (
              <button
                key={c.id}
                role="tab"
                type="button"
                aria-selected={selected === c.id}
                aria-controls={`${uid}-panel`}
                onClick={() => setSelected(c.id)}
                data-testid={`channel-${c.id}`}
                data-level={c.level}
                className={`panel p-3 text-left transition-colors sm:p-4 ${selected === c.id ? "!border-accent/60" : "hover:border-line-strong"}`}
              >
                <span className="block truncate text-xs text-fg-muted">{labels.channels[c.id]}</span>
                <span className="mt-1 block font-mono text-lg tracking-tight sm:text-2xl">
                  {current.toFixed(1)}
                  <span className="ml-1 text-xs text-fg-subtle">{c.unit}</span>
                </span>
                <span className={`mt-2 inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase ${s.badge}`}>
                  <span aria-hidden>{s.icon}</span>
                  {labels.states[c.level]}
                </span>
              </button>
            );
          })}
        </div>

        <div id={`${uid}-panel`} role="tabpanel" className="panel p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
              {labels.channels[sel.id]} · t+{t}s
            </p>
            <div className="flex items-center gap-2">
              <span className="rounded border border-warn/30 bg-warn-soft px-1.5 font-mono text-[10px] uppercase text-warn">{labels.simulated}</span>
              <button
                type="button"
                onClick={() => setRunning((r) => !r)}
                className="rounded-md border border-line px-2 py-1 font-mono text-[11px] text-fg-muted hover:text-fg"
                aria-pressed={!running}
              >
                {running ? labels.pause : labels.resume}
              </button>
              <button
                type="button"
                onClick={() => {
                  setChannels(initial());
                  setLog([]);
                  setT(0);
                }}
                className="rounded-md border border-line px-2 py-1 font-mono text-[11px] text-fg-muted hover:text-fg"
              >
                {labels.reset}
              </button>
            </div>
          </div>
          <Chart channel={sel} />
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <Slider
              label={labels.value}
              value={sel.setpoint}
              unit={sel.unit}
              cfg={sel}
              testId="iot-value"
              onChange={(v) => update(sel.id, { setpoint: v })}
            />
            <Slider
              label={labels.warning}
              value={sel.warning}
              unit={sel.unit}
              cfg={sel}
              accent="var(--warn)"
              testId="iot-warning"
              onChange={(v) => update(sel.id, { warning: v })}
            />
            <Slider
              label={labels.critical}
              value={sel.critical}
              unit={sel.unit}
              cfg={sel}
              accent="var(--crit)"
              testId="iot-critical"
              onChange={(v) => update(sel.id, { critical: v })}
            />
          </div>
        </div>
      </div>

      <div className="panel flex flex-col p-4 sm:p-5">
        <p className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">{labels.events}</p>
        <ol aria-live="polite" className="mt-3 max-h-[420px] flex-1 space-y-2 overflow-y-auto" data-testid="iot-log">
          {log.length === 0 && <li className="text-sm text-fg-muted">{labels.noEvents}</li>}
          {log.map((e, i) => {
            const s = levelStyle[e.to];
            return (
              <li key={`${e.t}-${e.channel}-${i}`} className="flex items-start gap-3 rounded-lg border border-line bg-bg/40 px-3 py-2 text-sm">
                <span aria-hidden className={`mt-0.5 font-mono text-xs ${s.text}`}>{s.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="font-medium">{labels.channels[e.channel]}</span>{" "}
                  <span className="text-fg-muted">
                    {labels[e.kind]} · {labels.states[e.from]} → {labels.states[e.to]}
                  </span>
                  <span className="block font-mono text-[11px] text-fg-subtle">
                    t+{e.t}s · {e.value.toFixed(2)}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
        <p className="mt-4 border-t border-line pt-3 text-xs leading-relaxed text-fg-subtle">{labels.explain}</p>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  unit,
  cfg,
  accent,
  onChange,
  testId,
}: {
  label: string;
  value: number;
  unit: string;
  cfg: ChannelConfig;
  accent?: string;
  onChange: (v: number) => void;
  testId: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="flex items-center justify-between text-xs text-fg-muted">
        <span>{label}</span>
        <span className="font-mono text-fg">
          {value.toFixed(1)} {unit}
        </span>
      </label>
      <input
        id={id}
        type="range"
        min={cfg.min}
        max={cfg.max}
        step={cfg.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={accent ? { accentColor: accent } : undefined}
        className="w-full"
        data-testid={testId}
      />
    </div>
  );
}

function Chart({ channel }: { channel: ChannelState }) {
  const w = 600;
  const h = 180;
  const y = (v: number) => h - 8 - ((v - channel.min) / (channel.max - channel.min)) * (h - 16);
  const x = (i: number) => (i / (HISTORY - 1)) * w;
  const line = channel.history.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const color = channel.level === "critical" ? "var(--crit)" : channel.level === "warning" ? "var(--warn)" : "var(--accent)";
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 h-auto w-full" preserveAspectRatio="none" aria-hidden>
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1="0" x2={w} y1={h * f} y2={h * f} stroke="var(--line)" />
      ))}
      <rect x="0" y="0" width={w} height={Math.max(0, y(channel.critical))} fill="var(--crit)" opacity="0.06" />
      <line x1="0" x2={w} y1={y(channel.warning)} y2={y(channel.warning)} stroke="var(--warn)" strokeDasharray="5 4" vectorEffect="non-scaling-stroke" />
      <line x1="0" x2={w} y1={y(channel.critical)} y2={y(channel.critical)} stroke="var(--crit)" strokeDasharray="5 4" vectorEffect="non-scaling-stroke" />
      <path d={`${line} L${w} ${h} L0 ${h} Z`} fill={color} opacity="0.08" />
      <path d={line} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
