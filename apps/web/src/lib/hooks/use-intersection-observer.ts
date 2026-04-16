"use client";

import { RefObject, useEffect, useState } from "react";

export interface IntersectionOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

export function useIntersectionObserver<T extends Element>(
  ref: RefObject<T | null>,
  options: IntersectionOptions = {}
): IntersectionObserverEntry | null {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([observed]) => setEntry(observed),
      options
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, options.root, options.rootMargin, options.threshold]);

  return entry;
}
