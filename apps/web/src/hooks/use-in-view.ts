"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export interface UseInViewOptions extends IntersectionObserverInit {
  once?: boolean;
}

export function useInView<T extends HTMLElement>(options: UseInViewOptions = {}): [RefObject<T | null>, boolean] {
  const { once = false, ...observerInit } = options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      if (entry.isIntersecting && once) observer.disconnect();
    }, observerInit);
    observer.observe(node);
    return () => observer.disconnect();
  }, [once, observerInit]);

  return [ref, inView];
}
