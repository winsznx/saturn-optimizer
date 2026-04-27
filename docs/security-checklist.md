# Pre-Deploy Security Checklist

Run through this list before promoting a Saturn build to mainnet or staging.

## Contracts

- [ ] `clarinet check` passes for all contracts in `Clarinet.toml`
- [ ] All adapters and strategies registered in the vault allowlist match the
      principals listed in `docs/integrations/`
- [ ] `emergency-pause` admin is set to a multisig, not an EOA
- [ ] `saturn-vault` exposes `pause`/`unpause` only to the admin set in
      `saturn-governance`
- [ ] No new `as-contract` call paths bypass the strategy/adapter trait gates

## Web app

- [ ] `NEXT_PUBLIC_STACKS_NETWORK` is set to `mainnet` for production builds
- [ ] `NEXT_PUBLIC_SATURN_DEPLOYER` matches the on-chain deployer
- [ ] `useVault` write paths attach post-conditions (see
      [`post-conditions.md`](./post-conditions.md))
- [ ] `npx tsc --noEmit` is clean
- [ ] `npm run build` (in `apps/web/`) succeeds without warnings flipping into errors
- [ ] No `console.log` left from debugging; `console.warn`/`console.error` only on
      genuine failure paths
- [ ] No private keys, mnemonics, or wallet exports committed to the tree

## Operations

- [ ] Keeper scripts target the correct deployer principal
- [ ] Chainhook events route to a working notification surface
- [ ] Hiro API quota / fallback behaviour confirmed for the production network

## Sign-off

A reviewer initials each box and dates the file before deploy. Re-run the contract
section after any contract change, even if only deploy parameters changed.
