const EVM_ADDRESS = /^0x[a-fA-F0-9]{40}$/;

export function isEvmAddress(value: unknown): value is string {
  return typeof value === "string" && EVM_ADDRESS.test(value);
}
