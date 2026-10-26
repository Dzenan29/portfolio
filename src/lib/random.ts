/** Small deterministic PRNG (mulberry32) so simulations look alive but are reproducible. */
export function createRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A deterministic, gently drifting series around a base value. */
export function series(seed: number, length: number, base: number, amplitude: number): number[] {
  const rnd = createRandom(seed);
  const out: number[] = [];
  let drift = 0;
  for (let i = 0; i < length; i++) {
    drift = drift * 0.85 + (rnd() - 0.5) * amplitude * 0.6;
    out.push(base + drift + Math.sin(i / 5) * amplitude * 0.3);
  }
  return out;
}
