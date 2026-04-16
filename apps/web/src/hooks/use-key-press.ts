"use client";

import { useEffect } from "react";

export function useKeyPress(targetKey: string, handler: (event: KeyboardEvent) => void): void {
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === targetKey) handler(event);
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [targetKey, handler]);
}
