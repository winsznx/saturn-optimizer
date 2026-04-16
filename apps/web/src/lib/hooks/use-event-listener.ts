"use client";

import { RefObject, useEffect, useRef } from "react";

export function useEventListener<K extends keyof WindowEventMap>(
  type: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: RefObject<HTMLElement | null> | Window | Document | null
): void {
  const saved = useRef(handler);

  useEffect(() => {
    saved.current = handler;
  }, [handler]);

  useEffect(() => {
    const target: EventTarget | null | undefined =
      element && "current" in (element as RefObject<HTMLElement>)
        ? (element as RefObject<HTMLElement>).current
        : (element as EventTarget) ?? (typeof window !== "undefined" ? window : null);
    if (!target) return;
    const listener: EventListener = (event) =>
      saved.current(event as WindowEventMap[K]);
    target.addEventListener(type, listener);
    return () => target.removeEventListener(type, listener);
  }, [type, element]);
}
