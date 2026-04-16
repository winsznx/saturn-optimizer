export function normaliseStacksAddress(address: string): string {
  return address.trim().toUpperCase();
}

export function sameAddress(a: string | null | undefined, b: string | null | undefined): boolean {
  if (!a || !b) return false;
  return a.toLowerCase() === b.toLowerCase();
}
