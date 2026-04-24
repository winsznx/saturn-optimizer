"use client";

import { useCallback, useEffect, useState } from "react";

export function useSessionStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      // ignore
    }
  }, [key]);

  const update = useCallback(
    (next: T) => {
      const valueToStore = next instanceof Function ? next(value) : next;
      setValue(valueToStore);
      try {
        window.sessionStorage.setItem(key, JSON.stringify(next));
      } catch {
        // ignore
      }
    },
    [key],
  );

  return [value, update];
}
