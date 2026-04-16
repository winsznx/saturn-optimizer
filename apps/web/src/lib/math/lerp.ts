export function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

export function inverseLerp(from: number, to: number, value: number): number {
  if (from === to) return 0;
  return (value - from) / (to - from);
}
