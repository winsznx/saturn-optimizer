"use client";

import { useCallback, useState } from "react";

export function useToggle(initial = false): [boolean, (next?: boolean) => void] {
  const [value, setValue] = useState(initial);

  const toggle = useCallback((next?: boolean) => {
    setValue((prev) => (typeof next === "boolean" ? next : !prev));
  }, []);

  return [value, toggle];
}
