"use client";

import { useEffect, useRef } from "react";

export function useUnmount(callback: () => void): void {
  const saved = useRef(callback);

  useEffect(() => {
    saved.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      saved.current();
    };
  }, []);
}
