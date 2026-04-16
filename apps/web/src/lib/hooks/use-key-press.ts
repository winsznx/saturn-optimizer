"use client";

import { useEffect } from "react";

export function useKeyPress(
  key: string,
  handler: (event: KeyboardEvent) => void
): void {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === key) handler(event);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [key, handler]);
}
