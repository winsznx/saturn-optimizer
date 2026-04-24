"use client";

import { useEffect, useRef } from "react";

export function useTimeout(callback: (...args: any[]) => void, delayMs: number | null): void {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delayMs === null) return;
    const id = setTimeout(() => callbackRef.current(), delayMs);
    return () => clearTimeout(id);
  }, [delayMs]);
}
