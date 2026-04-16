const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
  ["second", 1],
];

export function formatRelativeTime(
  input: Date | number,
  locale = "en-US"
): string {
  const target = typeof input === "number" ? input : input.getTime();
  const diffSeconds = (target - Date.now()) / 1000;
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  for (const [unit, seconds] of UNITS) {
    if (Math.abs(diffSeconds) >= seconds || unit === "second") {
      const value = Math.round(diffSeconds / seconds);
      return formatter.format(value, unit);
    }
  }
  return formatter.format(0, "second");
}

export function formatDate(
  input: Date | number,
  locale = "en-US",
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium" }
): string {
  const date = typeof input === "number" ? new Date(input) : input;
  return new Intl.DateTimeFormat(locale, options).format(date);
}
