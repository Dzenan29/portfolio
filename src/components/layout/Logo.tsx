/** Monogram: a node connected to a trace - the site's motif in miniature. */
export function Logo({ withName = true }: { withName?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden>
        <rect x="0.5" y="0.5" width="31" height="31" rx="8" fill="var(--surface)" stroke="var(--line-strong)" />
        <path d="M8 22V10h4.5a6 6 0 0 1 0 12H8Z" fill="none" stroke="var(--fg)" strokeWidth="2" />
        <path d="M20 16h4" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="24" cy="16" r="2.2" fill="var(--accent)" />
      </svg>
      {withName && (
        <span className="flex flex-col leading-none">
          <span className="text-[15px] font-semibold tracking-tight">Dzenan Kusi</span>
          <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
            Systems Engineering
          </span>
        </span>
      )}
    </span>
  );
}
