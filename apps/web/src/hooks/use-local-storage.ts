"use client";

import { useCallback, useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(initialValue);

  // Initialize from storage on mount
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        setValue(JSON.parse(raw) as T);
      }
    } catch (e) {
      console.warn(`Error reading localStorage key "${key}":`, e);
    }
  }, [key]);

  // Handle storage events from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setValue(JSON.parse(e.newValue) as T);
        } catch {
          // Ignore parse errors
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      try {
        const valueToStore = next instanceof Function ? next(value) : next;
        setValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (e) {
        console.warn(`Error setting localStorage key "${key}":`, e);
      }
    },
    [key, value],
  );

  return [value, update];
}
