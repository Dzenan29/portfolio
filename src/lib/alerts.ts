/** Threshold evaluation for the simulated monitoring demo. Higher values are worse. */
export type AlertLevel = "normal" | "warning" | "critical";

export interface Thresholds {
  warning: number;
  critical: number;
}

export function evaluate(value: number, t: Thresholds): AlertLevel {
  // If critical is configured below warning, critical still wins.
  if (value >= t.critical) return "critical";
  if (value >= t.warning) return "warning";
  return "normal";
}

const rank: Record<AlertLevel, number> = { normal: 0, warning: 1, critical: 2 };

export type TransitionKind = "raised" | "escalated" | "deescalated" | "cleared";

export interface Transition {
  from: AlertLevel;
  to: AlertLevel;
  kind: TransitionKind;
}

/** Returns the notification for a state change, or null when nothing should be sent. */
export function transition(from: AlertLevel, to: AlertLevel): Transition | null {
  if (from === to) return null;
  if (to === "normal") return { from, to, kind: "cleared" };
  if (from === "normal") return { from, to, kind: "raised" };
  return { from, to, kind: rank[to] > rank[from] ? "escalated" : "deescalated" };
}
