export function match<K extends string | number | symbol, R>(
  value: K,
  cases: Record<K, () => R>,
): R {
  const handler = cases[value];
  if (!handler) {
    throw new Error(`Unhandled match case: ${String(value)}`);
  }
  return handler();
}
