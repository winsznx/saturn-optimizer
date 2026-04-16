export function sanitizeInput(value: string): string {
  return value.replace(/[^\w\s.-]/g, "").trim();
}

export function sanitizeAmount(value: string): string {
  return value.replace(/[^0-9.]/g, "").replace(/(\..*?)\..*/g, "$1");
}
