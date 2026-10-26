/**
 * Logic of the availability monitor shown in the lab: only persistent failures alert,
 * recoveries are reported, and notifications can be held back during quiet hours.
 */
export interface MonitorState {
  consecutiveFailures: number;
  alerting: boolean;
}

export interface MonitorConfig {
  failureThreshold: number;
}

export type MonitorMessage =
  | { type: "ok" }
  | { type: "failure"; count: number }
  | { type: "alert"; count: number; delivered: boolean }
  | { type: "recovery"; delivered: boolean };

export const initialMonitorState: MonitorState = { consecutiveFailures: 0, alerting: false };

export function step(
  state: MonitorState,
  checkOk: boolean,
  config: MonitorConfig,
  quietHours: boolean,
): { state: MonitorState; message: MonitorMessage } {
  const threshold = Math.max(1, Math.floor(config.failureThreshold));
  if (checkOk) {
    if (state.alerting) {
      return { state: initialMonitorState, message: { type: "recovery", delivered: !quietHours } };
    }
    return { state: initialMonitorState, message: { type: "ok" } };
  }
  const count = state.consecutiveFailures + 1;
  if (!state.alerting && count >= threshold) {
    return {
      state: { consecutiveFailures: count, alerting: true },
      message: { type: "alert", count, delivered: !quietHours },
    };
  }
  return {
    state: { consecutiveFailures: count, alerting: state.alerting },
    message: { type: "failure", count },
  };
}
