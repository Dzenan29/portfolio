"use client";

import { useState } from "react";

/**
 * Technical detail toggle: recruiters get the short version, engineers the full one.
 * Hides blocks marked data-depth="technical" inside the target container. Content stays in the
 * HTML either way, so search engines and no-JS visitors always get everything.
 */
export function DepthToggle({ target, labels }: { target: string; labels: { label: string; summary: string; technical: string } }) {
  const [mode, setMode] = useState<"summary" | "technical">("technical");
  function set(next: "summary" | "technical") {
    setMode(next);
    document.getElementById(target)?.setAttribute("data-depth-mode", next);
  }
  return (
    <div role="group" aria-label={labels.label} className="inline-flex rounded-lg border border-line p-0.5 text-xs">
      {(["summary", "technical"] as const).map((m) => (
        <button
          key={m}
          type="button"
          aria-pressed={mode === m}
          onClick={() => set(m)}
          data-testid={`depth-${m}`}
          className={`rounded-md px-3 py-1.5 transition-colors ${mode === m ? "bg-surface-2 text-fg" : "text-fg-subtle hover:text-fg"}`}
        >
          {labels[m]}
        </button>
      ))}
    </div>
  );
}
