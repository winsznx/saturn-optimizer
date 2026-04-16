"use client";

import { useCallback, useEffect, useState } from "react";
import { copyToClipboard } from "@/lib/copy";

export function useCopyToClipboard(
  resetMs = 1500
): [boolean, (value: string) => Promise<void>] {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), resetMs);
    return () => clearTimeout(id);
  }, [copied, resetMs]);

  const copy = useCallback(async (value: string) => {
    const ok = await copyToClipboard(value);
    setCopied(ok);
  }, []);

  return [copied, copy];
}
