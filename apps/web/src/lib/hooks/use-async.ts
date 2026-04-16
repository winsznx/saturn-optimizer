"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type AsyncStatus = "idle" | "pending" | "success" | "error";

export interface AsyncState<T> {
  status: AsyncStatus;
  data: T | null;
  error: unknown;
}

export function useAsync<T>(
  operation: () => Promise<T>,
  immediate = true
): AsyncState<T> & { run: () => Promise<void> } {
  const [state, setState] = useState<AsyncState<T>>({
    status: "idle",
    data: null,
    error: null,
  });
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const run = useCallback(async () => {
    setState({ status: "pending", data: null, error: null });
    try {
      const data = await operation();
      if (mounted.current) {
        setState({ status: "success", data, error: null });
      }
    } catch (error) {
      if (mounted.current) {
        setState({ status: "error", data: null, error });
      }
    }
  }, [operation]);

  useEffect(() => {
    if (immediate) run();
  }, [immediate, run]);

  return { ...state, run };
}
