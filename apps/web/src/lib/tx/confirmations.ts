export interface ConfirmationProgress {
  confirmations: number;
  required: number;
  progress: number;
  done: boolean;
}

export function trackConfirmations(confirmations: number, required: number): ConfirmationProgress {
  const safeRequired = Math.max(1, required);
  const progress = Math.min(confirmations / safeRequired, 1);
  return {
    confirmations,
    required: safeRequired,
    progress,
    done: confirmations >= safeRequired,
  };
}
