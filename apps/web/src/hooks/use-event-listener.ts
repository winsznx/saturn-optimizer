"use client";

import { useEffect, useRef } from "react";

export function useEventListener<K extends keyof WindowEventMap>(
  type: K,
  handler: (event: WindowEventMap[K]) => void,
  element: Window | Document | HTMLElement | null | React.RefObject<HTMLElement> = typeof window !== "undefined" ? window : null,
): void {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const target = element && "current" in element ? element.current : element;
    if (!target) return;
    const listener = (event: Event) => handlerRef.current(event as WindowEventMap[K]);
    target.addEventListener(type, listener);
    return () => target.removeEventListener(type, listener);
  }, [type, element]);
}
