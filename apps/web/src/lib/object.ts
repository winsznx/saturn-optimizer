export function pick<T extends object, K extends keyof T>(
  source: T,
  keys: readonly K[]
): Pick<T, K> {
  const out = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in source) out[key] = source[key];
  }
  return out;
}

export function omit<T extends object, K extends keyof T>(
  source: T,
  keys: readonly K[]
): Omit<T, K> {
  const set = new Set(keys as readonly PropertyKey[]);
  const out = {} as Omit<T, K>;
  for (const key of Object.keys(source) as (keyof T)[]) {
    if (!set.has(key)) {
      (out as Record<PropertyKey, unknown>)[key as PropertyKey] = source[key];
    }
  }
  return out;
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}
