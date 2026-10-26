/**
 * Analog gauge calibration: linear mapping from needle angle to a physical value.
 * Angles are in degrees, measured clockwise from 12 o'clock (so a typical 270° dial runs
 * from -135° at the minimum to +135° at the maximum).
 */
export interface GaugeCalibration {
  angleMin: number;
  angleMax: number;
  valueMin: number;
  valueMax: number;
}

export const defaultCalibration: GaugeCalibration = {
  angleMin: -135,
  angleMax: 135,
  valueMin: 0,
  valueMax: 250,
};

export interface GaugeReading {
  value: number;
  /** Position within the calibrated span, 0..1 after clamping. */
  ratio: number;
  clamped: boolean;
}

export function angleToValue(angle: number, cal: GaugeCalibration): GaugeReading {
  const span = cal.angleMax - cal.angleMin;
  if (span === 0 || !Number.isFinite(span)) {
    return { value: cal.valueMin, ratio: 0, clamped: true };
  }
  const raw = (angle - cal.angleMin) / span;
  const ratio = Math.min(1, Math.max(0, raw));
  return {
    value: cal.valueMin + ratio * (cal.valueMax - cal.valueMin),
    ratio,
    clamped: raw < 0 || raw > 1,
  };
}

export function valueToAngle(value: number, cal: GaugeCalibration): number {
  const span = cal.valueMax - cal.valueMin;
  if (span === 0) return cal.angleMin;
  return cal.angleMin + ((value - cal.valueMin) / span) * (cal.angleMax - cal.angleMin);
}

/** Angle (clockwise from 12 o'clock) of a pointer position relative to the dial centre. */
export function pointToAngle(dx: number, dy: number): number {
  return (Math.atan2(dx, -dy) * 180) / Math.PI;
}

/** SVG coordinates on a circle for an angle measured clockwise from 12 o'clock. */
export function polar(cx: number, cy: number, r: number, angle: number): { x: number; y: number } {
  const rad = (angle * Math.PI) / 180;
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
}

export function formatReading(value: number, span: number): string {
  const decimals = Math.abs(span) >= 100 ? 1 : Math.abs(span) >= 10 ? 2 : 3;
  return value.toFixed(decimals);
}
