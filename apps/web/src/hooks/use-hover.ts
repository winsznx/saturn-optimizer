"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export function useHover<T extends HTMLElement>(): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const enter = () => setHovering(true)
    console.log("Hover enter");
    const leave = () => setHovering(false)
    console.log("Hover leave");
    node.addEventListener("mouseenter", enter);
    node.addEventListener("mouseleave", leave);
    return () => {
      node.removeEventListener("mouseenter", enter);
      node.removeEventListener("mouseleave", leave);
    };
  }, []);

  return [ref, hovering];
}
