"use client";

import { useEffect, useRef } from "react";

export function useEventListener<K extends keyof WindowEventMap>(
  type: K,
  handler: (event: WindowEventMap[K]) => void,
  element: Window | Document | HTMLElement | null = typeof window !== "undefined" ? window : null,
): void {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!element) return;
    const listener = (event: Event) => handlerRef.current(event as WindowEventMap[K]);
    element.addEventListener(type, listener);
    return () => element.removeEventListener(type, listener);
  }, [type, element]);
}
