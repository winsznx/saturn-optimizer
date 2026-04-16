export function buildSearchParams(
  params: Record<string, string | number | boolean | null | undefined>
): string {
  const url = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === "") continue;
    url.append(key, String(value));
  }
  return url.toString();
}

export function parseSearchParams(search: string): Record<string, string> {
  const out: Record<string, string> = {};
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  params.forEach((value, key) => {
    out[key] = value;
  });
  return out;
}

export function joinPath(base: string, path: string): string {
  const b = base.endsWith("/") ? base.slice(0, -1) : base;
  const p = path.startsWith("/") ? path.slice(1) : path;
  return `${b}/${p}`;
}
