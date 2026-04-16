export function readEnv(name: string, fallback = ""): string {
  if (typeof process === "undefined" || !process.env) return fallback;
  return process.env[name] ?? fallback;
}

export function requireEnv(name: string): string {
  const value = readEnv(name);
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function readBooleanEnv(name: string, fallback = false): boolean {
  const value = readEnv(name);
  if (!value) return fallback;
  return value === "1" || value.toLowerCase() === "true";
}
