"use client";

import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delayMs = 300, options: { leading?: boolean } = {}): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}
