# Saturn Web App

## Purpose

The web app is the user-facing layer of Saturn. Its job is not only to let users click
deposit and withdraw; it is meant to make Stacks BTCFi feel like one coherent product
instead of a collection of isolated protocol dashboards.

For grant review, this folder remains a stub because the contract core, tests, and
security documentation are the highest-priority proof-of-work. The frontend plan is
still worth documenting clearly because a large part of Saturn's moat is user
experience: passive Bitcoin users want one safe, legible place to manage yield.

## Product thesis

The app is being designed for two audiences:

- retail users who want a simple "earn on my Bitcoin or STX" workflow without
  protocol-by-protocol management
- institutional or treasury-style users who want clearer state, stronger safety
  framing, and a more operational dashboard

That means the frontend should feel controlled and legible, not gamified. Every major
screen should answer three questions before asking for a signature:

1. What asset am I depositing or withdrawing?
2. What strategy or allocation currently governs my funds?
3. What protection exists if something goes wrong?

## Planned surfaces

### Vault dashboard

- total idle and managed balances by domain
- share balances and implied claim on vault assets
- current active strategy and protocol exposure
- pause state and emergency messaging

### Transaction flows

- wallet connection for Leather, Xverse, or compatible Stacks wallets
- deposit flows for `sBTC` and `STX`
- normal withdrawal flows
- safe-mode withdrawal flows when the protocol is paused or operating conservatively

### Strategy and monitoring surfaces

- current allocation view for conservative and balanced strategies
- APY placeholders and, later, live APY / TVL data from indexers
- harvest and rebalance status for operator transparency
- event-driven updates sourced from chainhooks or equivalent indexing infrastructure

## Security requirements for the app

The frontend must reflect Saturn's Stacks-native security model instead of hiding it.
That means:

- Deny-mode post-conditions for deposits and withdrawals by default
- explicit transaction previews before signature
- pause-state warnings that explain when normal withdrawals are blocked
- a visible safe-withdraw path when idle liquidity is available
- no user-supplied adapter or strategy principals anywhere in the UI

The goal is for the app to reinforce the vault's guarantees, not dilute them.

## Data sources

The intended data stack for the frontend is:

- on-chain vault read-only functions for balances, share supply, and approvals
- chainhooks for near-real-time deposit, withdrawal, and rebalance events
- Hiro API or other reviewed indexers for protocol context, APY estimates, and market state

The app should treat protocol analytics as advisory and the vault's own on-chain state
as authoritative.

## Phased delivery

### MVP for grant review

- repo-level documentation of the frontend plan
- wallet and transaction UX requirements
- explicit security requirements for post-conditions and pause handling

### Next build

- a transaction composer for `deposit-sbtc`, `deposit-stx`, `withdraw-sbtc`, and `withdraw-stx`
- live vault state panels
- chainhook-driven activity feed

### Production-facing version

- APY aggregation and strategy analytics
- operator transparency for harvest and rebalance actions
- richer portfolio views for both retail and treasury-style users

The intent is for the frontend to become the clearest expression of Saturn's moat:
one place to understand, enter, monitor, and safely exit Stacks-native Bitcoin yield.
