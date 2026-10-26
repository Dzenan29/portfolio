"use client";

import { useId, useState } from "react";
import type { Locale } from "@/i18n/config";
import { createRandom } from "@/lib/random";
import { useInterval } from "@/lib/useInterval";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Layer = "hardware" | "firmware" | "connectivity" | "software" | "infrastructure" | "monitoring";

interface FlowNode {
  id: string;
  x: number;
  y: number;
  layer: Layer;
  title: Record<Locale, string>;
  protocol: string;
  detail: Record<Locale, string>;
  reading: (t: number) => string;
}

const W = 600;
const H = 500;

const rnd = createRandom(7);
const noise = Array.from({ length: 64 }, () => rnd() - 0.5);
const pressureAt = (t: number) => 6.1 + Math.sin(t / 3) * 0.18 + (noise[t % noise.length] ?? 0) * 0.08;

const nodes: FlowNode[] = [
  {
    id: "sensor",
    x: 100,
    y: 78,
    layer: "hardware",
    title: { en: "Physical sensor", de: "Physischer Sensor" },
    protocol: "analog · 0-10 bar",
    detail: {
      en: "Where the measurement starts: a gauge, probe or transmitter on real equipment.",
      de: "Hier beginnt die Messung: ein Manometer, Fühler oder Transmitter an echter Technik.",
    },
    reading: (t) => `p = ${pressureAt(t).toFixed(2)} bar`,
  },
  {
    id: "mcu",
    x: 300,
    y: 78,
    layer: "firmware",
    title: { en: "Embedded controller", de: "Embedded-Controller" },
    protocol: "ESP32 · C/C++",
    detail: {
      en: "Firmware samples the signal, filters it and turns it into a value with a unit.",
      de: "Die Firmware tastet das Signal ab, filtert es und macht daraus einen Wert mit Einheit.",
    },
    reading: (t) => `adc ${Math.round(2048 + pressureAt(t) * 180)} · ${(30 + (t % 5)).toString()} ms`,
  },
  {
    id: "net",
    x: 500,
    y: 78,
    layer: "connectivity",
    title: { en: "Network", de: "Netzwerk" },
    protocol: "HTTP / MQTT",
    detail: {
      en: "The reading leaves the device as a small message over Wi-Fi or Ethernet.",
      de: "Der Messwert verlässt das Gerät als kleine Nachricht über WLAN oder Ethernet.",
    },
    reading: (t) => `GET /reading → 200 · ${(12 + (t % 7)).toString()} ms`,
  },
  {
    id: "linux",
    x: 500,
    y: 262,
    layer: "infrastructure",
    title: { en: "Linux services", de: "Linux-Dienste" },
    protocol: "Docker · systemd",
    detail: {
      en: "Containers on a virtualized Linux host receive, store and serve the data.",
      de: "Container auf einem virtualisierten Linux-Host empfangen, speichern und liefern die Daten.",
    },
    reading: () => `svc: active (running)`,
  },
  {
    id: "proc",
    x: 300,
    y: 262,
    layer: "software",
    title: { en: "Data processing", de: "Datenverarbeitung" },
    protocol: "Node-RED · Python",
    detail: {
      en: "Rules validate the value, compare it with thresholds and decide what happens next.",
      de: "Regeln prüfen den Wert, vergleichen ihn mit Schwellen und entscheiden, was als Nächstes passiert.",
    },
    reading: (t) => `rule: p < 7.0 → ${pressureAt(t) < 7 ? "ok" : "warn"}`,
  },
  {
    id: "dash",
    x: 100,
    y: 262,
    layer: "monitoring",
    title: { en: "Dashboard", de: "Dashboard" },
    protocol: "Grafana",
    detail: {
      en: "Trends make slow changes visible long before they become a problem.",
      de: "Verläufe machen langsame Veränderungen sichtbar, lange bevor sie zum Problem werden.",
    },
    reading: () => `refresh 30 s · 24 h`,
  },
  {
    id: "alert",
    x: 300,
    y: 430,
    layer: "monitoring",
    title: { en: "Automation & alerts", de: "Automatisierung & Alarme" },
    protocol: "notify · recover",
    detail: {
      en: "Persistent problems notify the right people - and so does the recovery.",
      de: "Anhaltende Probleme benachrichtigen die richtigen Leute - die Entwarnung ebenso.",
    },
    reading: () => `state: normal`,
  },
];

const edges: [string, string][] = [
  ["sensor", "mcu"],
  ["mcu", "net"],
  ["net", "linux"],
  ["linux", "proc"],
  ["proc", "dash"],
  ["proc", "alert"],
];

const layers: { id: Layer; label: Record<Locale, string> }[] = [
  { id: "hardware", label: { en: "Hardware", de: "Hardware" } },
  { id: "firmware", label: { en: "Firmware", de: "Firmware" } },
  { id: "connectivity", label: { en: "Connectivity", de: "Konnektivität" } },
  { id: "software", label: { en: "Software", de: "Software" } },
  { id: "infrastructure", label: { en: "Infrastructure", de: "Infrastruktur" } },
  { id: "monitoring", label: { en: "Monitoring", de: "Monitoring" } },
];

const byId = Object.fromEntries(nodes.map((n) => [n.id, n])) as Record<string, FlowNode>;

function edgePath(a: FlowNode, b: FlowNode) {
  if (a.y === b.y) return `M${a.x} ${a.y} L${b.x} ${b.y}`;
  const midY = (a.y + b.y) / 2;
  return `M${a.x} ${a.y} C${a.x} ${midY} ${b.x} ${midY} ${b.x} ${b.y}`;
}

export interface SignalFlowLabels {
  vizLabel: string;
  vizHint: string;
  vizLayers: string;
  simulated: string;
  illustrative: string;
}

export function SignalFlowVisualization({ locale, labels }: { locale: Locale; labels: SignalFlowLabels }) {
  const reduced = useReducedMotion();
  const [tick, setTick] = useState(0);
  const [selected, setSelected] = useState<string>("sensor");
  const [hovered, setHovered] = useState<string | null>(null);
  const [layer, setLayer] = useState<Layer | null>(null);
  const [userTookOver, setUserTookOver] = useState(false);
  const uid = useId();

  useInterval(() => setTick((t) => t + 1), 1500, true);
  // Gently walk through the layers until the visitor interacts.
  useInterval(
    () => {
      setLayer((current) => {
        const i = current ? layers.findIndex((l) => l.id === current) : -1;
        return layers[(i + 1) % layers.length]!.id;
      });
    },
    3200,
    !reduced && !userTookOver,
  );

  const focus = hovered ?? selected;
  const connected = new Set<string>([focus]);
  edges.forEach(([a, b]) => {
    if (a === focus) connected.add(b);
    if (b === focus) connected.add(a);
  });
  const isLit = (id: string) => (layer ? byId[id]!.layer === layer : connected.has(id));
  const active = byId[selected]!;

  const choose = (id: string) => {
    setSelected(id);
    setLayer(null);
    setUserTookOver(true);
  };

  return (
    <figure className="relative" aria-labelledby={`${uid}-cap`}>
      <figcaption id={`${uid}-cap`} className="sr-only">
        {labels.vizLabel}. {nodes.map((n) => n.title[locale]).join(" → ")}.
      </figcaption>

      {/* Layer selector - "system architecture mode" */}
      <div className="mb-3 hidden flex-wrap items-center gap-1.5 sm:flex" role="group" aria-label={labels.vizLayers}>
        {layers.map((l) => (
          <button
            key={l.id}
            type="button"
            aria-pressed={layer === l.id}
            onClick={() => {
              setUserTookOver(true);
              setLayer((cur) => (cur === l.id ? null : l.id));
            }}
            className={`rounded-md border px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
              layer === l.id
                ? "border-accent/50 bg-accent-soft text-accent"
                : "border-line text-fg-subtle hover:border-line-strong hover:text-fg-muted"
            }`}
          >
            {l.label[locale]}
          </button>
        ))}
      </div>

      <div className="panel ticks relative overflow-hidden">
        <div aria-hidden className="bg-grid-fine pointer-events-none absolute inset-0 opacity-70" />

        {/* Desktop / tablet: spatial diagram */}
        <div className="relative hidden aspect-[6/5] sm:block">
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full" aria-hidden>
            <defs>
              <linearGradient id={`${uid}-g`} x1="0" x2="1">
                <stop offset="0" stopColor="var(--accent)" stopOpacity="0.9" />
                <stop offset="1" stopColor="var(--teal)" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            {/* coordinate ticks */}
            {[100, 200, 300, 400, 500].map((x) => (
              <text key={x} x={x} y={H - 8} textAnchor="middle" className="fill-fg-subtle font-mono" fontSize="8" opacity="0.6">
                {x}
              </text>
            ))}
            {edges.map(([a, b]) => {
              const na = byId[a]!;
              const nb = byId[b]!;
              const lit = isLit(a) && isLit(b);
              const d = edgePath(na, nb);
              return (
                <g key={`${a}-${b}`}>
                  <path d={d} fill="none" stroke="var(--line-strong)" strokeWidth="1.25" />
                  <path
                    d={d}
                    fill="none"
                    stroke={`url(#${uid}-g)`}
                    strokeWidth={lit ? 1.75 : 1}
                    strokeDasharray="4 8"
                    opacity={lit ? 1 : 0.5}
                    className="anim-flow transition-opacity duration-500"
                  />
                  {!reduced &&
                    [0, 1].map((k) => (
                      <circle key={k} r={lit ? 3.2 : 2.2} fill="var(--accent)" opacity={lit ? 1 : 0.5}>
                        <animateMotion dur="2.6s" begin={`${k * 1.3}s`} repeatCount="indefinite" path={d} />
                      </circle>
                    ))}
                </g>
              );
            })}
          </svg>

          {nodes.map((n, i) => {
            const lit = isLit(n.id);
            const isSel = selected === n.id;
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => choose(n.id)}
                onMouseEnter={() => setHovered(n.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(n.id)}
                onBlur={() => setHovered(null)}
                aria-pressed={isSel}
                aria-describedby={isSel ? `${uid}-panel` : undefined}
                data-testid={`flow-node-${n.id}`}
                style={{ left: `${(n.x / W) * 100}%`, top: `${(n.y / H) * 100}%` }}
                className={`absolute w-[30%] -translate-x-1/2 -translate-y-1/2 rounded-lg border px-2.5 py-2 text-left backdrop-blur-sm transition-all duration-300 ${
                  isSel
                    ? "border-accent/70 bg-surface"
                    : lit
                      ? "border-line-strong bg-surface/95"
                      : "border-line bg-surface/70 opacity-60"
                }`}
              >
                <span className="flex items-center justify-between gap-2 font-mono text-[9px] uppercase tracking-wider text-fg-subtle">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <span className="truncate">{n.protocol}</span>
                </span>
                <span className="mt-1 block truncate text-[13px] font-medium leading-tight text-fg">{n.title[locale]}</span>
                <span className="mt-1 block truncate font-mono text-[10px] text-accent">{n.reading(tick)}</span>
              </button>
            );
          })}

        </div>

        {/* Inspection panel */}
        <div id={`${uid}-panel`} aria-live="polite" className="relative hidden border-t border-line bg-bg-raised/80 px-4 py-3 sm:block">
          <InspectorBody node={active} locale={locale} tick={tick} labels={labels} />
        </div>

        {/* Phone: vertical signal chain */}
        <div className="relative p-4 sm:hidden">
          <ol className="relative space-y-2.5 before:absolute before:bottom-6 before:left-[15px] before:top-6 before:w-px before:bg-line-strong">
            {nodes.map((n, i) => {
              const isSel = selected === n.id;
              return (
                <li key={n.id} className="relative">
                  <button
                    type="button"
                    onClick={() => choose(n.id)}
                    aria-pressed={isSel}
                    aria-expanded={isSel}
                    className={`flex w-full items-start gap-3 rounded-lg border p-2.5 text-left transition-colors ${
                      isSel ? "border-accent/60 bg-surface" : "border-line bg-surface/70"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`relative z-10 mt-0.5 flex size-[14px] shrink-0 items-center justify-center rounded-full border ${
                        isSel ? "border-accent bg-accent" : "border-line-strong bg-bg"
                      }`}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium">{n.title[locale]}</span>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
                      </span>
                      <span className="mt-0.5 block font-mono text-[10px] text-accent">{n.reading(tick)}</span>
                      {isSel && <span className="mt-1.5 block text-xs leading-relaxed text-fg-muted">{n.detail[locale]}</span>}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="relative flex items-center justify-between gap-3 border-t border-line px-3 py-2 font-mono text-[10px] text-fg-subtle">
          <span className="truncate">{labels.illustrative}</span>
          <span className="hidden shrink-0 sm:inline">{labels.vizHint}</span>
        </div>
      </div>
    </figure>
  );
}

function InspectorBody({ node, locale, tick, labels }: { node: FlowNode; locale: Locale; tick: number; labels: SignalFlowLabels }) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1">
      <p className="text-sm font-medium leading-tight">
        {node.title[locale]} <span className="ml-1.5 font-mono text-[10px] font-normal text-fg-subtle">{node.protocol}</span>
      </p>
      <span className="self-start justify-self-end rounded border border-line-strong px-1 font-mono text-[9px] uppercase text-fg-subtle">
        {labels.simulated}
      </span>
      <p className="text-xs leading-snug text-fg-muted">{node.detail[locale]}</p>
      <p className="self-end justify-self-end whitespace-nowrap font-mono text-[11px] text-accent">{node.reading(tick)}</p>
    </div>
  );
}
