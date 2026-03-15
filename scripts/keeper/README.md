# Keeper scripts

The keeper layer is Saturn's operational control plane. The contracts define what is
allowed. The keeper decides when Saturn should actually use those permissions. For
grant review, the scripts in this folder remain lightweight stubs, but the operating
policy they represent is part of the protocol design and should be evaluated as such.

## Scope of the keeper

- `run-harvest.ts` is the operator entrypoint for `harvest`
- `rebalance.ts` is the operator entrypoint for `rebalance`

The keeper is not meant to be a privileged bypass around the vault. It must live
within the same guardrails the contracts enforce:

- calls go directly to `saturn-vault`
- the signer must satisfy the vault's operator authentication
- the keeper must respect pause state and allowlist state
- all asset-moving transactions should include Deny-mode post-conditions

## What should trigger action

The keeper should act on a small number of explicit triggers, not on vague "yield is
probably better elsewhere" heuristics.

### Rebalance triggers

- idle balances exceed the operating threshold Saturn wants to deploy
- a strategy change has been approved on-chain and the new route is now active
- an adapter has been disabled, which may require leaving assets idle or redirecting
  future deployment
- an upstream protocol condition makes the current allocation no longer acceptable

### Harvest triggers

- a reward position has matured and is now claimable
- a protocol-specific cycle transition makes the claim path available
- a manual operator review approves harvest after checking expected outputs and slippage

In all cases, the keeper should prefer no action over ambiguous action. Saturn's
automation is meant to reduce operator toil, not to widen protocol risk.

## Required pre-flight checks

Before signing any transaction, the keeper should read and validate:

1. vault pause state,
2. active strategy,
3. strategy approval status,
4. required adapter approval status,
5. current idle and managed balances,
6. any protocol-specific incident flags maintained by operations,
7. the exact asset movement the transaction is expected to perform.

If any of those checks fail, the keeper should abort and emit a structured log rather
than trying to "best effort" the action.

## Transaction policy

The minimum safe policy for production keeper calls is:

- build the transaction directly against the vault principal,
- generate Deny-mode post-conditions that constrain expected vault outflows,
- avoid moving operator-owned assets other than fees,
- record the intended action, inputs, and expected results before broadcast,
- verify the resulting on-chain state after confirmation.

For Saturn, post-conditions are not just a frontend concern. They are also part of
operator discipline. A rebalance transaction should authorize only the intended
deployment amount. A harvest transaction should authorize only the expected claim and
return path.

## What the keeper must refuse to do

- call the vault through an intermediary contract
- submit `rebalance` or `harvest` while the vault is paused
- proceed if a required adapter is no longer approved
- rely on off-chain analytics when they conflict with authoritative on-chain state
- assume that asynchronous protocol exits, such as StackingDAO withdrawals, are
  immediately redeemable

## Monitoring inputs

The intended monitoring inputs for the keeper are:

- vault read-only functions for balances, pause state, and active strategy
- chainhook events for deposits, withdrawals, and rebalance activity
- protocol-specific health information gathered from reviewed public surfaces

Chainhooks are especially useful because they make the operator loop event-driven
instead of poll-driven. Even so, the keeper should treat any external signal as a cue
to re-check on-chain state, not as authority on its own.

## Production hardening still to come

Before wiring these scripts to a real network, Saturn still needs:

- pinned environment configuration for vault and upstream principals
- signer management and secret handling outside the repo
- structured logs and alerting for failed or refused actions
- chainhook or indexer integration for trigger delivery
- dry-run support that prints intended post-conditions before submission

The point of this folder in the grant MVP is to show that Saturn's automation story is
constrained, reviewable, and compatible with the vault's security model rather than an
afterthought bolted onto the contracts.
