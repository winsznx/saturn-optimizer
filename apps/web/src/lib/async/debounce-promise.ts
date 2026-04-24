export function debouncePromise<A extends unknown[], R>(
  fn: (...args: A) => Promise<R>,
  delayMs = 300, options: { leading?: boolean } = {},
): (...args: A) => Promise<R> {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let pendingResolvers: Array<(value: R | PromiseLike<R>) => void> = [];
  let pendingRejecters: Array<(reason?: unknown) => void> = [];

  return (...args: A) =>
    new Promise<R>((resolve, reject) => {
      pendingResolvers.push(resolve);
      pendingRejecters.push(reject);
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(async () => {
        const resolvers = pendingResolvers;
        const rejecters = pendingRejecters;
        pendingResolvers = [];
        pendingRejecters = [];
        try {
          const result = await fn(...args);
          resolvers.forEach((r) => r(result));
        } catch (error) {
          rejecters.forEach((r) => r(error));
        }
      }, delayMs);
    });
}
