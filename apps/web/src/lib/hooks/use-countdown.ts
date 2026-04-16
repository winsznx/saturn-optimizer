"use client";

import { useEffect, useState } from "react";

export function useCountdown(
  targetTimestamp: number,
  tickMs = 1000
): number {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, targetTimestamp - Date.now())
  );

  useEffect(() => {
    function update() {
      setRemaining(Math.max(0, targetTimestamp - Date.now()));
    }
    update();
    const id = setInterval(update, tickMs);
    return () => clearInterval(id);
  }, [targetTimestamp, tickMs]);

  return remaining;
}
