export type SortDirection = "asc" | "desc";

export function sortBy<T>(
  items: readonly T[],
  keyFn: (item: T) => number | string,
  direction: SortDirection = "asc",
): T[] {
  const multiplier = direction === "asc" ? 1 : -1;
  return [...items].sort((a, b) => {
    const aKey = keyFn(a);
    const bKey = keyFn(b);
    if (aKey < bKey) return -1 * multiplier;
    if (aKey > bKey) return 1 * multiplier;
    return 0;
  });
}
