export function chunk<T>(items: readonly T[], size: number): T[][] {
  if (size <= 0) throw new Error("chunk: size must be > 0");
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
}

export function unique<T>(items: readonly T[]): T[] {
  return Array.from(new Set(items));
}

export function groupBy<T, K extends string | number>(
  items: readonly T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  const out = {} as Record<K, T[]>;
  for (const item of items) {
    const key = keyFn(item);
    (out[key] ??= []).push(item);
  }
  return out;
}

export function partition<T>(
  items: readonly T[],
  predicate: (item: T) => boolean
): [T[], T[]] {
  const pass: T[] = [];
  const fail: T[] = [];
  for (const item of items) {
    if (predicate(item)) pass.push(item);
    else fail.push(item);
  }
  return [pass, fail];
}
