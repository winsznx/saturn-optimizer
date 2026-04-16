export function deepFreeze<T>(input: T): Readonly<T> {
  if (input && typeof input === "object" && !Object.isFrozen(input)) {
    Object.values(input as Record<string, unknown>).forEach((value) => deepFreeze(value));
    Object.freeze(input);
  }
  return input;
}
