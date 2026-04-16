function hasWindow(): boolean {
  return typeof window !== "undefined";
}

export const safeLocalStorage = {
  get<T>(key: string, fallback: T): T {
    if (!hasWindow()) return fallback;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T): void {
    if (!hasWindow()) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      return;
    }
  },
  remove(key: string): void {
    if (!hasWindow()) return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      return;
    }
  },
};
