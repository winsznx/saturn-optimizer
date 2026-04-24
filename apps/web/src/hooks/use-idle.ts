"use client";

import { useEffect, useState } from "react";

const EVENTS = ["mousemove", "keydown", "mousedown", "touchstart", "scroll"] as const;

export function useIdle(timeoutMs = 60_000, options: { onIdle?: () => void } = {}): boolean {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const reset = () => {
      setIdle(false);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIdle(true), timeoutMs);
    };

    reset();
    EVENTS.forEach((event) => window.addEventListener(event, reset, { passive: true }));

    return () => {
      clearTimeout(timeoutId);
      EVENTS.forEach((event) => window.removeEventListener(event, reset));
    };
  }, [timeoutMs]);

  return idle;
}
