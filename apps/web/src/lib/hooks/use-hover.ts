"use client";

import { RefObject, useEffect, useState } from "react";

export function useHover<T extends HTMLElement>(
  ref: RefObject<T | null>
): boolean {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const enter = () => setHovered(true);
    const leave = () => setHovered(false);
    node.addEventListener("mouseenter", enter);
    node.addEventListener("mouseleave", leave);
    return () => {
      node.removeEventListener("mouseenter", enter);
      node.removeEventListener("mouseleave", leave);
    };
  }, [ref]);

  return hovered;
}
