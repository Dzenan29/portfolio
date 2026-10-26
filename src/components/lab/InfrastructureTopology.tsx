"use client";

import { useId, useState } from "react";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";

type Kind = "hypervisor" | "vm" | "container" | "proxy" | "monitoring" | "backup" | "client";
type Labels = Dictionary["lab"]["infra"] & { simulated: string; conceptual: string };

interface InfraNode {
  id: string;
  name: string;
  kind: Kind;
  x: number;
  y: number;
  role: Record<Locale, string>;
}

// Fictional, generalized environment. Names are generic on purpose.
const nodes: InfraNode[] = [
  { id: "users", name: "users", kind: "client", x: 400, y: 36, role: { en: "Researchers reach services by name over HTTPS - never by IP and port.", de: "Forschende erreichen Dienste per Name über HTTPS - nie per IP und Port." } },
  { id: "proxy", name: "reverse-proxy", kind: "proxy", x: 400, y: 116, role: { en: "Single entry point: terminates TLS, routes by hostname, keeps backends off the network edge.", de: "Einziger Eingang: terminiert TLS, routet nach Hostname, hält Backends vom Netzrand fern." } },
  { id: "vm-edge", name: "vm-edge", kind: "vm", x: 150, y: 206, role: { en: "Small VM that only runs the proxy - easy to rebuild, nothing else to break it.", de: "Kleine VM nur für den Proxy - schnell neu aufgebaut, nichts anderes kann ihn stören." } },
  { id: "vm-apps", name: "vm-apps", kind: "vm", x: 400, y: 206, role: { en: "Docker host for user-facing applications, each described as a Compose stack.", de: "Docker-Host für Anwendungen der Nutzer, jede als Compose-Stack beschrieben." } },
  { id: "vm-ops", name: "vm-ops", kind: "vm", x: 650, y: 206, role: { en: "Operations VM: checks, automation flows and dashboards live apart from the apps they watch.", de: "Betriebs-VM: Checks, Automatisierung und Dashboards laufen getrennt von den Apps, die sie überwachen." } },
  { id: "wiki", name: "wiki", kind: "container", x: 300, y: 296, role: { en: "Knowledge base container. Data on a volume, configuration in Compose.", de: "Container der Wissensdatenbank. Daten auf einem Volume, Konfiguration in Compose." } },
  { id: "docs", name: "docs", kind: "container", x: 400, y: 296, role: { en: "Document management container with its own database container.", de: "Container für Dokumentenverwaltung mit eigenem Datenbank-Container." } },
  { id: "dash", name: "dashboards", kind: "container", x: 500, y: 296, role: { en: "Grafana: visualizes metrics and sensor data from the monitoring side.", de: "Grafana: visualisiert Metriken und Sensordaten aus dem Monitoring." } },
  { id: "checks", name: "checks", kind: "monitoring", x: 650, y: 296, role: { en: "HTTP checks and Node-RED flows: count failures, alert, report recovery.", de: "HTTP-Checks und Node-RED-Flows: Fehler zählen, alarmieren, Entwarnung melden." } },
  { id: "pve-a", name: "pve-a", kind: "hypervisor", x: 150, y: 386, role: { en: "Hypervisor node. Hosts the edge VM; can take others during maintenance.", de: "Hypervisor-Knoten. Trägt die Edge-VM; kann bei Wartung weitere übernehmen." } },
  { id: "pve-b", name: "pve-b", kind: "hypervisor", x: 400, y: 386, role: { en: "Hypervisor node for the application VM.", de: "Hypervisor-Knoten für die Anwendungs-VM." } },
  { id: "pve-c", name: "pve-c", kind: "hypervisor", x: 650, y: 386, role: { en: "Hypervisor node for operations workloads.", de: "Hypervisor-Knoten für Betriebs-Workloads." } },
  { id: "nas", name: "backup-nas", kind: "backup", x: 400, y: 466, role: { en: "Scheduled rsync target. Mirrors are distinguished from versioned copies; restores are what prove a backup.", de: "Ziel für geplante rsync-Jobs. Spiegel werden von versionierten Kopien unterschieden; erst ein Restore beweist ein Backup." } },
];

const edges: [string, string, "data" | "host" | "watch" | "backup"][] = [
  ["users", "proxy", "data"],
  ["proxy", "vm-edge", "host"],
  ["proxy", "wiki", "data"],
  ["proxy", "docs", "data"],
  ["proxy", "dash", "data"],
  ["wiki", "vm-apps", "host"],
  ["docs", "vm-apps", "host"],
  ["dash", "vm-apps", "host"],
  ["checks", "vm-ops", "host"],
  ["checks", "proxy", "watch"],
  ["checks", "dash", "watch"],
  ["vm-edge", "pve-a", "host"],
  ["vm-apps", "pve-b", "host"],
  ["vm-ops", "pve-c", "host"],
  ["pve-a", "nas", "backup"],
  ["pve-b", "nas", "backup"],
  ["pve-c", "nas", "backup"],
];

const W = 800;
const H = 510;
const byId = Object.fromEntries(nodes.map((n) => [n.id, n])) as Record<string, InfraNode>;

const kindColor: Record<Kind, string> = {
  client: "var(--fg-muted)",
  proxy: "var(--accent)",
  vm: "var(--fg-muted)",
  container: "var(--accent)",
  monitoring: "var(--accent)",
  hypervisor: "var(--teal)",
  backup: "var(--teal)",
};

export function neighbours(id: string): string[] {
  return edges.filter(([a, b]) => a === id || b === id).map(([a, b]) => (a === id ? b : a));
}

export function InfrastructureTopology({ locale, labels }: { locale: Locale; labels: Labels }) {
  const [selected, setSelected] = useState("proxy");
  const uid = useId();
  const linked = new Set([selected, ...neighbours(selected)]);
  const sel = byId[selected]!;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
      <div className="panel ticks relative overflow-hidden">
        <div aria-hidden className="bg-grid-fine absolute inset-0 opacity-60" />
        <div className="relative flex items-center justify-between border-b border-line px-4 py-2.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">{labels.conceptual}</span>
          <span className="rounded border border-line-strong px-1.5 font-mono text-[10px] uppercase text-fg-subtle">{labels.simulated}</span>
        </div>
        {/* Diagram (tablet+) */}
        <div className="relative hidden aspect-[800/510] md:block">
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full" aria-hidden>
            {edges.map(([a, b, type]) => {
              const na = byId[a]!;
              const nb = byId[b]!;
              const lit = linked.has(a) && linked.has(b) && (a === selected || b === selected);
              return (
                <line
                  key={`${a}-${b}`}
                  x1={na.x}
                  y1={na.y}
                  x2={nb.x}
                  y2={nb.y}
                  stroke={lit ? (type === "backup" ? "var(--teal)" : type === "watch" ? "var(--warn)" : "var(--accent)") : "var(--line-strong)"}
                  strokeWidth={lit ? 2 : 1}
                  strokeDasharray={type === "host" ? undefined : "4 5"}
                  className={lit ? "anim-flow" : undefined}
                />
              );
            })}
          </svg>
          {nodes.map((n) => {
            const isSel = n.id === selected;
            const isLinked = linked.has(n.id);
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => setSelected(n.id)}
                aria-pressed={isSel}
                aria-controls={`${uid}-info`}
                data-testid={`infra-${n.id}`}
                style={{ left: `${(n.x / W) * 100}%`, top: `${(n.y / H) * 100}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border px-2.5 py-1.5 font-mono text-[11px] transition-all ${
                  isSel
                    ? "border-accent bg-surface text-fg"
                    : isLinked
                      ? "border-line-strong bg-surface text-fg"
                      : "border-line bg-surface/80 text-fg-subtle hover:text-fg"
                }`}
              >
                <span aria-hidden className="mr-1.5 inline-block size-1.5 rounded-full align-middle" style={{ background: kindColor[n.kind] }} />
                {n.name}
                <span className="sr-only"> - {labels.kinds[n.kind]}</span>
              </button>
            );
          })}
        </div>
        {/* List (phone) */}
        <ul className="relative grid grid-cols-2 gap-2 p-3 md:hidden">
          {nodes.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => setSelected(n.id)}
                aria-pressed={n.id === selected}
                className={`w-full rounded-md border px-2.5 py-2 text-left font-mono text-[11px] ${
                  n.id === selected ? "border-accent bg-surface" : linked.has(n.id) ? "border-line-strong bg-surface" : "border-line bg-surface/70 text-fg-subtle"
                }`}
              >
                <span aria-hidden className="mr-1.5 inline-block size-1.5 rounded-full" style={{ background: kindColor[n.kind] }} />
                {n.name}
                <span className="mt-0.5 block text-[10px] text-fg-subtle">{labels.kinds[n.kind]}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <aside id={`${uid}-info`} aria-live="polite" className="panel p-5" data-testid="infra-info">
        <p className="font-mono text-[10px] uppercase tracking-wider" style={{ color: kindColor[sel.kind] }}>
          {labels.kinds[sel.kind]}
        </p>
        <h3 className="mt-2 font-mono text-xl">{sel.name}</h3>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">{labels.role}</p>
        <p className="mt-1 text-sm leading-relaxed text-fg-muted">{sel.role[locale]}</p>
        <p className="mt-5 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">{labels.connects}</p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {neighbours(selected).map((id) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => setSelected(id)}
                className="rounded-md border border-line px-2 py-1 font-mono text-[11px] text-fg-muted hover:border-accent hover:text-fg"
              >
                {byId[id]!.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
