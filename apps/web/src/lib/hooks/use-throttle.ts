"use client";

import { useEffect, useRef, useState } from "react";

export function useThrottle<T>(value: T, intervalMs: number): T {
  const [throttled, setThrottled] = useState(value);
  const lastRun = useRef(Date.now());

  useEffect(() => {
    const remaining = intervalMs - (Date.now() - lastRun.current);
    if (remaining <= 0) {
      lastRun.current = Date.now();
      setThrottled(value);
      return;
    }
    const id = setTimeout(() => {
      lastRun.current = Date.now();
      setThrottled(value);
    }, remaining);
    return () => clearTimeout(id);
  }, [value, intervalMs]);

  return throttled;
}
