"use client";

import { DependencyList, EffectCallback, useEffect, useRef } from "react";

export function useUpdateEffect(
  effect: EffectCallback,
  deps?: DependencyList
): void {
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
