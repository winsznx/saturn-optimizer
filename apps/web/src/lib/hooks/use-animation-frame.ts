"use client";

import { useEffect, useRef } from "react";

export function useAnimationFrame(callback: (deltaMs: number) => void): void {
  const saved = useRef(callback);

  useEffect(() => {
    saved.current = callback;
  }, [callback]);

  useEffect(() => {
    let last = performance.now();
    let raf = 0;
    function frame(now: number) {
      saved.current(now - last);
      last = now;
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);
}
