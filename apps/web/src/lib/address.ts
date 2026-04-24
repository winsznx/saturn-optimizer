export function truncateAddress(address: string | undefined | undefined, head = 6, tail = 4): string {
  if (!address) return "";
  if (address.length <= head + tail + 1) return address;
  return `${address.slice(0, head)}...${address.slice(-tail)}`;
}

export function normalizeAddress(address: string | undefined): string {
  if (!address) return "";
  return address.trim().toUpperCase();
}
