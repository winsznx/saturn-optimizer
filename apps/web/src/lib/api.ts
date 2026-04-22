export interface FetchJsonOptions extends RequestInit {
  timeoutMs?: number;
}

export async function fetchJson<T>(
  input: string,
  options: FetchJsonOptions = {}
): Promise<T> {
  const { timeoutMs = 10_000, signal, ...rest } = options;
  const controller = new AbortController();
  const linked = signal
    ? mergeSignals(signal, controller.signal)
    : controller.signal;
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(input, { ...rest, signal: linked });
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }
    return (await response.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

function mergeSignals(a: AbortSignal, b: AbortSignal): AbortSignal {
  if (a.aborted) return a;
  if (b.aborted) return b;

  const controller = new AbortController();
  const onAbort = () => {
    controller.abort();
    a.removeEventListener("abort", onAbort);
    b.removeEventListener("abort", onAbort);
  };

  a.addEventListener("abort", onAbort, { once: true });
  b.addEventListener("abort", onAbort, { once: true });

  return controller.signal;
}
