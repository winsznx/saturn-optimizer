/**
 * Simple async sleep utility that resolves after a given number of milliseconds.
 * 
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after ms
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
