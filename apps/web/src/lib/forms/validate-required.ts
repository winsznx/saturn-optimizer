export function validateRequired(value: string | null | undefined, label = "Field"): string | null {
  if (value === null || value === undefined || String(value).trim() === "") {
    return `${label} is required`;
  }
  return null;
}
