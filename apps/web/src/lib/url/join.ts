export function joinUrl(...segments: string[]): string {
  return segments
    .map((segment, index) => {
      if (index === 0) return segment.replace(/\/+$/, "");
      return segment.replace(/^\/+|\/+$/g, "");
    })
    .filter((segment) => segment.length > 0)
    .join("/");
}
