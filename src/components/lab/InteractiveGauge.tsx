"use client";

import { useId, useRef, useState } from "react";
import type { Dictionary } from "@/i18n";
import {
  angleToValue,
  defaultCalibration,
  formatReading,
  type GaugeCalibration,
  pointToAngle,
  polar,
  valueToAngle,
} from "@/lib/gauge";

type Labels = Dictionary["lab"]["gauge"] & { simulated: string; reset: string };

const C = 150;
const R = 118;
const ANGLE_LIMIT = 170;
const units = ["bar", "psi", "kPa", "mbar"];

function arcPath(r: number, a0: number, a1: number) {
  const start = polar(C, C, r, a0);
  const end = polar(C, C, r, a1);
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  const sweep = a1 > a0 ? 1 : 0;
  return `M${start.x} ${start.y} A${r} ${r} 0 ${large} ${sweep} ${end.x} ${end.y}`;
}

export function InteractiveGauge({ labels }: { labels: Labels }) {
  const [cal, setCal] = useState<GaugeCalibration>(defaultCalibration);
  const [unit, setUnit] = useState("bar");
  const [angle, setAngle] = useState(Math.round(valueToAngle(160, defaultCalibration)));
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const uid = useId();

  const reading = angleToValue(angle, cal);
  const span = cal.valueMax - cal.valueMin;
  const valueText = `${formatReading(reading.value, span)} ${unit}`;

  const ticks = Array.from({ length: 11 }, (_, i) => {
    const t = i / 10;
    return { a: cal.angleMin + t * (cal.angleMax - cal.angleMin), v: cal.valueMin + t * span, major: i % 2 === 0 };
  });

  function updateFromPointer(e: React.PointerEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scale = 300 / rect.width;
    const dx = (e.clientX - rect.left) * scale - C;
    const dy = (e.clientY - rect.top) * scale - C;
    const a = pointToAngle(dx, dy);
    setAngle(Math.max(-ANGLE_LIMIT, Math.min(ANGLE_LIMIT, Math.round(a))));
  }

  const setNum = (key: keyof GaugeCalibration) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const n = Number(e.target.value);
    if (Number.isFinite(n)) setCal((c) => ({ ...c, [key]: n }));
  };

  const needleTip = polar(C, C, R - 14, angle);
  const needleTail = polar(C, C, 18, angle + 180);
  const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
      {/* Dial */}
      <div className="panel ticks relative self-start p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">camera frame · roi</span>
          <span className="rounded border border-line-strong px-1.5 font-mono text-[10px] uppercase text-fg-subtle">{labels.simulated}</span>
        </div>
        <svg
          ref={svgRef}
          viewBox="0 0 300 300"
          className="mx-auto mt-2 w-full max-w-[340px] touch-none select-none"
          role="img"
          aria-label={`${labels.angle}: ${angle}°. ${labels.readout}: ${valueText}`}
          onPointerDown={(e) => {
            dragging.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            updateFromPointer(e);
          }}
          onPointerMove={(e) => dragging.current && updateFromPointer(e)}
          onPointerUp={() => (dragging.current = false)}
          onPointerCancel={() => (dragging.current = false)}
        >
          <circle cx={C} cy={C} r={140} fill="var(--surface-2)" stroke="var(--line-strong)" />
          <circle cx={C} cy={C} r={128} fill="var(--bg-raised)" stroke="var(--line)" />
          {/* calibrated range */}
          {cal.angleMax !== cal.angleMin && (
            <path d={arcPath(R, cal.angleMin, cal.angleMax)} fill="none" stroke="var(--accent)" strokeOpacity="0.35" strokeWidth="3" />
          )}
          {/* sampling arcs, like the device's detection overlay */}
          {[52, 62, 72, 82, 92].map((r) => (
            <path key={r} d={arcPath(r, cal.angleMin, cal.angleMax)} fill="none" stroke="var(--teal)" strokeOpacity="0.35" strokeDasharray="1 3" />
          ))}
          {ticks.map((t, i) => {
            const a = polar(C, C, R, t.a);
            const b = polar(C, C, t.major ? R - 12 : R - 7, t.a);
            const lbl = polar(C, C, R - 26, t.a);
            return (
              <g key={i}>
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--fg-muted)" strokeWidth={t.major ? 2 : 1} />
                {t.major && (
                  <text x={lbl.x} y={lbl.y} textAnchor="middle" dominantBaseline="middle" className="fill-fg-muted font-mono" fontSize="11">
                    {fmt(t.v)}
                  </text>
                )}
              </g>
            );
          })}
          <text x={C} y={C + 50} textAnchor="middle" className="fill-fg-subtle font-mono" fontSize="11">
            {unit}
          </text>
          {/* detected needle */}
          <line x1={needleTail.x} y1={needleTail.y} x2={needleTip.x} y2={needleTip.y} stroke="var(--crit)" strokeWidth="3" strokeLinecap="round" />
          <circle cx={C} cy={C} r="9" fill="var(--fg)" />
          <circle cx={needleTip.x} cy={needleTip.y} r="10" fill="transparent" className="cursor-grab" />
        </svg>
        <p className="mt-2 text-center font-mono text-[10px] text-fg-subtle">{labels.dragHint}</p>
      </div>

      {/* Controls & readout */}
      <div className="flex flex-col gap-5">
        <div className="panel p-5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">{labels.readout}</p>
          <p className="mt-1 font-mono text-4xl tracking-tight sm:text-5xl" aria-live="polite" data-testid="gauge-value">
            {formatReading(reading.value, span)}
            <span className="ml-2 text-xl text-fg-muted">{unit}</span>
          </p>
          {reading.clamped && (
            <p role="status" className="mt-2 inline-flex items-center gap-1.5 rounded border border-warn/30 bg-warn-soft px-2 py-1 text-xs text-warn">
              ⚠ {labels.outOfRange}
            </p>
          )}
          <label htmlFor={`${uid}-angle`} className="mt-5 flex items-center justify-between text-sm">
            <span>{labels.angle}</span>
            <span className="font-mono text-fg-muted">{angle}°</span>
          </label>
          <input
            id={`${uid}-angle`}
            type="range"
            min={-ANGLE_LIMIT}
            max={ANGLE_LIMIT}
            step={1}
            value={angle}
            aria-valuetext={`${angle}°, ${valueText}`}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="w-full"
            data-testid="gauge-angle"
          />
        </div>

        <fieldset className="panel p-5">
          <legend className="sr-only">{labels.calibration}</legend>
          <div className="flex items-center justify-between">
            <p aria-hidden className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">{labels.calibration}</p>
            <button
              type="button"
              onClick={() => {
                setCal(defaultCalibration);
                setUnit("bar");
              }}
              className="font-mono text-[11px] text-fg-muted underline-offset-4 hover:text-fg hover:underline"
            >
              {labels.reset}
            </button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {(
              [
                ["angleMin", labels.angleMin, "°"],
                ["angleMax", labels.angleMax, "°"],
                ["valueMin", labels.valueMin, unit],
                ["valueMax", labels.valueMax, unit],
              ] as const
            ).map(([key, label, suffix]) => (
              <label key={key} className="text-xs text-fg-muted">
                {label}
                <span className="mt-1 flex items-center rounded-lg border border-line bg-bg focus-within:border-accent">
                  <input
                    type="number"
                    value={cal[key]}
                    onChange={setNum(key)}
                    step={key.startsWith("angle") ? 1 : "any"}
                    data-testid={`gauge-${key}`}
                    className="w-full min-w-0 bg-transparent px-2.5 py-2 font-mono text-sm text-fg outline-none"
                  />
                  <span className="pr-2.5 font-mono text-xs text-fg-subtle">{suffix}</span>
                </span>
              </label>
            ))}
            <label className="col-span-2 text-xs text-fg-muted">
              {labels.unit}
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-line bg-bg px-2.5 py-2 font-mono text-sm text-fg"
              >
                {units.map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </select>
            </label>
          </div>
        </fieldset>

        <div className="panel overflow-x-auto p-5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">{labels.formula}</p>
          <p className="mt-2 whitespace-nowrap font-mono text-[13px] text-fg-muted">
            v = v<sub>min</sub> + (θ − θ<sub>min</sub>) / (θ<sub>max</sub> − θ<sub>min</sub>) · (v<sub>max</sub> − v<sub>min</sub>)
          </p>
          <p className="mt-2 whitespace-nowrap font-mono text-[13px]">
            v = {fmt(cal.valueMin)} + ({angle} − ({fmt(cal.angleMin)})) / ({fmt(cal.angleMax)} − ({fmt(cal.angleMin)})) · {fmt(span)} ={" "}
            <span className="text-accent">{formatReading(reading.value, span)}</span>
          </p>
          <p className="mt-4 text-sm leading-relaxed text-fg-muted">{labels.explain}</p>
        </div>
      </div>
    </div>
  );
}
