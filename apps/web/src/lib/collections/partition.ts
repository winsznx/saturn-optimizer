export function partition<T>(
  items: readonly T[],
  predicate: (item: T) => boolean,
): [T[], T[]] {
  const passing: T[] = [];
  const failing: T[] = [];
  for (const item of items) {
    (predicate(item) ? passing : failing).push(item);
  }
  return [passing, failing];
}
