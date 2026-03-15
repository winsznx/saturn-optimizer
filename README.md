# Saturn Optimizer

Saturn Optimizer is a Clarinet-first Stacks BTCFi vault MVP built for grant review. The repo focuses on a secure vault core, explicit threat modeling, mockable protocol integrations, and a reviewer-friendly local workflow.

## Why Saturn

Saturn is building the management layer for Stacks BTCFi. Today a user has to decide
whether to lend on Zest, liquid stake through StackingDAO, or provide liquidity on
BitFlow, then monitor those positions manually. Saturn's product thesis is that most
Bitcoin holders do not want protocol-by-protocol operations; they want a single,
auditable interface that can route capital with clear risk controls.

That is the wedge this repo is trying to make obvious:

- one vault entrypoint instead of fragmented protocol UX
- one security model instead of multiple unaudited user flows
- one share token per accounting domain instead of ad hoc position tracking
- one operator and monitoring surface for rebalancing, harvest, and incident response

## Why Stacks Now

Saturn only makes sense on a stack where Bitcoin-denominated assets, readable smart
contracts, and native user protections all meet in one place. The project is designed
around three Stacks-specific tailwinds:

- `sBTC` creates a Bitcoin-native asset base that can actually move through DeFi on Stacks
- Clarity makes the vault and strategy logic directly reviewable
- Nakamoto-era Stacks finality strengthens the case for Bitcoin-aligned settlement

The repo therefore leans into Stacks-native primitives rather than generic DeFi
patterns: post-conditions, exact-principal trait hardening, Clarinet-first testing,
and explicit `as-contract` usage for vault-owned asset flows.

## What ships in this MVP

- A non-custodial vault skeleton for `sBTC` and `STX`
- Separate share accounting domains with SIP-010 share tokens
- An emergency pause module and safe-mode withdrawal paths
- Strategy and adapter contracts that are mockable and allowlist-aware
- Clarinet + Vitest tests, CI, and grant-review docs

## Quickstart

1. Install dependencies with `npm install`
2. Run `clarinet check`
3. Run `npm test`

## Security Properties

- Users can always redeem idle liquidity with `safe-withdraw-sbtc` and `safe-withdraw-stx` without triggering strategy code.
- No strategy or adapter outside the vault's exact-principal allowlists can receive vault-managed assets.
- Admin and keeper operations require direct calls, so a malicious intermediary contract cannot impersonate the operator through `tx-sender` alone.
- STX withdrawals are executed in the vault's own context with `as-contract`, which means the contract only spends STX it already owns.
- If a strategy fails to free enough assets, the withdrawal reverts before share burn and before any user payout, so partial failures do not strand users in a half-withdrawn state.

## Product Direction

The MVP in this repo is the secure contract core, not the full end-state product. The
intended Saturn roadmap is:

1. Aggregation: surface yield opportunities and protocol state in one place.
2. Vault automation: accept deposits, issue shares, and route capital through approved strategies.
3. Harvest and compounding: automate reward collection, swapping, and reinvestment.
4. Risk engine: move from static operator policy toward data-informed allocation and exit rules.

This matters for grant review because the moat is not just "another vault." The moat
is the combination of Stacks-native safety, protocol integration discipline, and a
single product surface for passive Bitcoin yield.

## Review Guide

- `contracts/` contains the vault, share token, governance, strategy, adapter, and mock contracts
- `tests/` contains Vitest suites powered by the Clarinet SDK simnet
- `docs/` contains the specification, architecture, threat model, milestones, and integration dossiers
- `scripts/keeper/` and `chainhooks/` contain MVP stubs for automation

Key reviewer docs:

- [docs/spec.md](docs/spec.md) for the asset model, share accounting, and integration assumptions
- [docs/threat-model.md](docs/threat-model.md) for post-conditions, authorization, `as-contract`, and emergency handling
- [docs/milestones.md](docs/milestones.md) for acceptance criteria, evidence, and delivery schedule
- [docs/integrations/zest.md](docs/integrations/zest.md), [docs/integrations/stackingdao.md](docs/integrations/stackingdao.md), and [docs/integrations/bitflow.md](docs/integrations/bitflow.md) for pinned protocol surfaces

See [docs/threat-model.md](docs/threat-model.md) and [SECURITY.md](SECURITY.md) for the full security posture.
