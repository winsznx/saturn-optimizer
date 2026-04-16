export type Maybe<T> = T | null | undefined;

export function isSome<T>(value: Maybe<T>): value is T {
  return value !== null && value !== undefined;
}

export function mapMaybe<T, U>(value: Maybe<T>, fn: (value: T) => U): Maybe<U> {
  return isSome(value) ? fn(value) : value;
}

export function unwrapOr<T>(value: Maybe<T>, fallback: T): T {
  return isSome(value) ? value : fallback;
}
