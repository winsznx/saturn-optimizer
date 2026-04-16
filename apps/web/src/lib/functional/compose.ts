export function compose<T>(...fns: Array<(input: T) => T>): (value: T) => T {
  return (value: T) => fns.reduceRight((acc, fn) => fn(acc), value);
}
