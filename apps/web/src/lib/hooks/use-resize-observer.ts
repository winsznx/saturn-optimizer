"use client";

import { RefObject, useEffect, useState } from "react";

export interface Size {
  width: number;
  height: number;
}

export function useResizeObserver<T extends Element>(
  ref: RefObject<T | null>
): Size | null {
  const [size, setSize] = useState<Size | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect) setSize({ width: rect.width, height: rect.height });
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}
