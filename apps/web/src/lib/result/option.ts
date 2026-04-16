export type Option<T> =
  | { some: true; value: T }
  | { some: false };

export function some<T>(value: T): Option<T> {
  return { some: true, value };
}

export const none: Option<never> = { some: false };

export function mapOption<T, U>(option: Option<T>, fn: (value: T) => U): Option<U> {
  return option.some ? some(fn(option.value)) : none;
}
