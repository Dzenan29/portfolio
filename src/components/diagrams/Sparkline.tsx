/** Tiny server-rendered trend line. Values are drawn as given; callers label them as simulated. */
export function Sparkline({
  values,
  width = 160,
  height = 40,
  color = "var(--accent)",
  threshold,
  min,
  max,
}: {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
  threshold?: number;
  min?: number;
  max?: number;
}) {
  const lo = min ?? Math.min(...values, threshold ?? Infinity);
  const hi = max ?? Math.max(...values, threshold ?? -Infinity);
  const span = hi - lo || 1;
  const x = (i: number) => (i / Math.max(1, values.length - 1)) * width;
  const y = (v: number) => height - 2 - ((v - lo) / span) * (height - 4);
  const line = values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${width} ${height} L0 ${height} Z`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" preserveAspectRatio="none" aria-hidden>
      <path d={area} fill={color} opacity="0.08" />
      {threshold !== undefined && (
        <line x1="0" x2={width} y1={y(threshold)} y2={y(threshold)} stroke="var(--warn)" strokeDasharray="3 3" strokeWidth="1" />
      )}
      <path d={line} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
