export interface FieldState<T> {
  value: T;
  error: string | null;
  touched: boolean;
}

export function createFieldState<T>(initial: T): FieldState<T> {
  return { value: initial, error: null, touched: false };
}

export function withError<T>(state: FieldState<T>, error: string | null): FieldState<T> {
  return { ...state, error };
}

export function withTouched<T>(state: FieldState<T>, touched = true): FieldState<T> {
  return { ...state, touched };
}
