import type {
  ContractCallRegularOptions,
  FinishedTxData,
} from "@stacks/connect";

type ContractCallOptionsBase = Omit<
  ContractCallRegularOptions,
  "onFinish" | "onCancel" | "sponsored"
>;

/**
 * Wraps `openContractCall` in a Promise so callers can `await` user signing.
 *
 * The underlying API delivers the result via `onFinish` and surfaces
 * cancellation via `onCancel`. Using callbacks directly leaks state-machine
 * concerns into every page, so this helper centralises the bridge.
 */
export async function callContract(
  options: ContractCallOptionsBase
): Promise<FinishedTxData> {
  const { openContractCall } = await import("@stacks/connect");
  return new Promise<FinishedTxData>((resolve, reject) => {
    openContractCall({
      ...options,
      onFinish: (data) => resolve(data),
      onCancel: () => reject(new Error("User cancelled the transaction")),
    });
  });
}
