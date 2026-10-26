import { describe, expect, it } from "vitest";
import { evaluate, transition } from "@/lib/alerts";
import { validateContact, isLikelySpam } from "@/lib/contact";
import { angleToValue, defaultCalibration, pointToAngle, valueToAngle } from "@/lib/gauge";
import { initialMonitorState, step } from "@/lib/healthcheck";
import { createRandom } from "@/lib/random";

describe("gauge calibration", () => {
  const cal = defaultCalibration; // -135° → 0, +135° → 250

  it("maps the calibration end points exactly", () => {
    expect(angleToValue(-135, cal).value).toBe(0);
    expect(angleToValue(135, cal).value).toBe(250);
  });

  it("interpolates linearly", () => {
    expect(angleToValue(0, cal).value).toBeCloseTo(125);
    expect(angleToValue(-67.5, cal).value).toBeCloseTo(62.5);
  });

  it("clamps and flags readings outside the calibrated span", () => {
    const below = angleToValue(-160, cal);
    expect(below.value).toBe(0);
    expect(below.clamped).toBe(true);
    const above = angleToValue(170, cal);
    expect(above.value).toBe(250);
    expect(above.clamped).toBe(true);
    expect(angleToValue(10, cal).clamped).toBe(false);
  });

  it("supports offset ranges and reversed dials", () => {
    const offset = { angleMin: -120, angleMax: 120, valueMin: -1, valueMax: 9 };
    expect(angleToValue(0, offset).value).toBeCloseTo(4);
    const reversed = { angleMin: 120, angleMax: -120, valueMin: 0, valueMax: 10 };
    expect(angleToValue(60, reversed).value).toBeCloseTo(2.5);
  });

  it("is invertible", () => {
    for (const v of [0, 33.3, 125, 249]) expect(angleToValue(valueToAngle(v, cal), cal).value).toBeCloseTo(v);
  });

  it("never divides by zero for a degenerate calibration", () => {
    const r = angleToValue(10, { angleMin: 5, angleMax: 5, valueMin: 1, valueMax: 2 });
    expect(r.value).toBe(1);
    expect(r.clamped).toBe(true);
  });

  it("converts pointer offsets to clockwise angles from 12 o'clock", () => {
    expect(pointToAngle(0, -10)).toBeCloseTo(0);
    expect(pointToAngle(10, 0)).toBeCloseTo(90);
    expect(pointToAngle(-10, 0)).toBeCloseTo(-90);
  });
});

describe("threshold alerting", () => {
  const t = { warning: 8, critical: 10 };

  it("classifies values", () => {
    expect(evaluate(7.9, t)).toBe("normal");
    expect(evaluate(8, t)).toBe("warning");
    expect(evaluate(10, t)).toBe("critical");
  });

  it("lets critical win when thresholds are misconfigured", () => {
    expect(evaluate(6, { warning: 8, critical: 5 })).toBe("critical");
  });

  it("emits the right notification for each state change", () => {
    expect(transition("normal", "normal")).toBeNull();
    expect(transition("normal", "warning")?.kind).toBe("raised");
    expect(transition("warning", "critical")?.kind).toBe("escalated");
    expect(transition("critical", "warning")?.kind).toBe("deescalated");
    expect(transition("critical", "normal")?.kind).toBe("cleared");
  });
});

describe("availability monitor", () => {
  const config = { failureThreshold: 3 };

  it("alerts once after N consecutive failures, then reports recovery", () => {
    let s = initialMonitorState;
    const types: string[] = [];
    for (const ok of [false, false, false, false, true]) {
      const r = step(s, ok, config, false);
      s = r.state;
      types.push(r.message.type);
    }
    expect(types).toEqual(["failure", "failure", "alert", "failure", "recovery"]);
    expect(s).toEqual(initialMonitorState);
  });

  it("resets the counter on a successful check", () => {
    let s = step(initialMonitorState, false, config, false).state;
    s = step(s, true, config, false).state;
    expect(s.consecutiveFailures).toBe(0);
    expect(step(s, false, config, false).message.type).toBe("failure");
  });

  it("holds back notifications during quiet hours but still tracks state", () => {
    let s = initialMonitorState;
    let last = step(s, false, { failureThreshold: 1 }, true);
    expect(last.message).toEqual({ type: "alert", count: 1, delivered: false });
    s = last.state;
    last = step(s, true, { failureThreshold: 1 }, true);
    expect(last.message).toEqual({ type: "recovery", delivered: false });
  });
});

describe("contact validation", () => {
  const ok = { name: "Ada", email: "ada@example.org", subject: "", message: "Hello, I have a technical question.", website: "" };

  it("accepts a valid message", () => expect(validateContact(ok)).toEqual({}));

  it("reports each invalid field", () => {
    const e = validateContact({ ...ok, name: " ", email: "nope", message: "short" });
    expect(e).toEqual({ name: "nameRequired", email: "emailInvalid", message: "messageShort" });
  });

  it("flags the honeypot", () => expect(isLikelySpam({ ...ok, website: "http://spam" })).toBe(true));
});

describe("deterministic simulation", () => {
  it("produces the same sequence for the same seed", () => {
    const a = createRandom(1);
    const b = createRandom(1);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
});
