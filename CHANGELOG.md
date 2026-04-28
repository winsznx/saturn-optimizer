# Changelog

All notable changes to Saturn Optimizer are tracked here. This project follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and uses
[Conventional Commits](https://www.conventionalcommits.org/) at the commit level.

## Unreleased

### Added
- Network selection via `NEXT_PUBLIC_STACKS_NETWORK` (default `mainnet`)
- `NEXT_PUBLIC_SATURN_DEPLOYER` override for fork/staging deployments
- Deny-mode post-conditions on every user-facing vault entrypoint
- `callContract` helper that promise-wraps `openContractCall` so pages can
  `await` the user's signature and capture the resulting txid
- `ErrorBoundary`, `NetworkBadge`, `ConnectWalletPrompt`, and `PageTransition`
  primitives in `apps/web/src/components/`
- `docs/env-config.md`, `docs/post-conditions.md`, `docs/security-checklist.md`,
  and `docs/integrations/README.md`
- Vitest config and unit tests for format, hex, explorer, post-conditions,
  arrays, strings, numbers, url, guards, retry, debounce, errors, env,
  and clarity hook utils

### Fixed
- `sip010-ft-trait` typo in the contracts map (was `ip010-ft-trait`)
- Hiro mainnet API URL constant pointed at `api.mainnet.hiro.so` which does not
  resolve; now uses `api.hiro.so`
- Wallet session previously hard-coded `stxAddress.mainnet`; now respects the
  configured network
- Hooks no longer swallow read-call failures silently — they emit
  `console.warn` with a labelled prefix
- Deposit and safe-withdraw pages no longer claim success before the user
  signs; they capture the txid from the `onFinish` callback

### Removed
- Unused `lib/url/` module (consumers now use `lib/explorer.ts`)
- Duplicate `lib/constants/network.ts` and `lib/constants/asset-symbols.ts`
