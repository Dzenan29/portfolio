import type { Domain } from "@/content/types";

/** Miniature diagrams instead of stock icons - each one sketches how the domain works. */
export function DomainGlyph({ glyph, className = "" }: { glyph: Domain["glyph"]; className?: string }) {
  const stroke = { stroke: "currentColor", strokeWidth: 1.5, fill: "none", vectorEffect: "non-scaling-stroke" as const };
  const accent = { stroke: "var(--accent)", strokeWidth: 1.5, fill: "none" };
  return (
    <svg viewBox="0 0 64 40" className={className} aria-hidden>
      {glyph === "chip" && (
        <>
          <rect x="22" y="10" width="20" height="20" rx="3" {...stroke} />
          <rect x="28" y="16" width="8" height="8" rx="1" fill="var(--accent)" />
          {[14, 20, 26].map((y) => (
            <g key={y}>
              <path d={`M16 ${y}h6`} {...stroke} />
              <path d={`M42 ${y}h6`} {...stroke} />
            </g>
          ))}
          <path d="M2 20h8" {...accent} className="anim-flow" strokeDasharray="2 4" />
          <circle cx="10" cy="20" r="2" fill="var(--accent)" />
        </>
      )}
      {glyph === "stack" && (
        <>
          <rect x="14" y="5" width="36" height="8" rx="2" {...stroke} />
          <rect x="14" y="16" width="36" height="8" rx="2" {...stroke} />
          <rect x="14" y="27" width="36" height="8" rx="2" {...stroke} />
          {[9, 20, 31].map((y, i) => (
            <circle key={y} cx="19" cy={y} r="1.5" fill={i === 1 ? "var(--accent)" : "var(--teal)"} />
          ))}
          <path d="M42 9h4M42 20h4M42 31h4" {...stroke} />
        </>
      )}
      {glyph === "pulse" && (
        <>
          <path d="M2 30h60" {...stroke} strokeOpacity="0.3" />
          <path d="M2 24h12l4-12 6 20 5-14 4 6h29" {...accent} />
          <path d="M2 14h60" stroke="var(--warn)" strokeWidth="1" strokeDasharray="2 3" />
          <circle cx="24" cy="32" r="2" fill="var(--accent)" />
        </>
      )}
      {glyph === "code" && (
        <>
          <rect x="6" y="5" width="52" height="30" rx="3" {...stroke} />
          <path d="M6 12h52" {...stroke} />
          <path d="M14 20l-4 4 4 4" {...accent} />
          <path d="M20 24h14M20 29h22" {...stroke} strokeOpacity="0.6" />
        </>
      )}
      {glyph === "cluster" && (
        <>
          {[12, 32, 52].map((x) => (
            <g key={x}>
              <rect x={x - 7} y="22" width="14" height="12" rx="2" {...stroke} />
              <path d={`M${x} 22V14`} {...stroke} />
            </g>
          ))}
          <rect x="22" y="4" width="20" height="10" rx="2" {...accent} />
          <path d="M12 14h40" {...stroke} />
        </>
      )}
      {glyph === "shield" && (
        <>
          <path d="M32 4l14 5v10c0 9-6 15-14 18-8-3-14-9-14-18V9z" {...stroke} />
          <path d="M26 20l4 4 8-9" {...accent} />
        </>
      )}
    </svg>
  );
}
