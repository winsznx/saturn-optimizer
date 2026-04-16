export function applySlippage(amount: number, slippageBps: number, direction: "up" | "down" = "down"): number {
  const multiplier = direction === "down" ? 1 - slippageBps / 10_000 : 1 + slippageBps / 10_000;
  return amount * multiplier;
}

export function minAmountOut(amountIn: number, slippageBps: number): number {
  return applySlippage(amountIn, slippageBps, "down");
}

export function maxAmountIn(amountOut: number, slippageBps: number): number {
  return applySlippage(amountOut, slippageBps, "up");
}
