# Saturn Optimizer Spec

## Product scope

Saturn Optimizer is a Clarinet-first Stacks vault MVP that routes `sBTC` and `STX`
through explicit strategies and exact-principal adapters. The current repository is
not trying to masquerade as a fully live optimizer. It is a grant-deliverable MVP
whose goals are: make the vault design auditable, make the integration boundaries
explicit, and show that the team understands Stacks-native safety controls such as
post-conditions, trait hardening, and `as-contract`.

The product is intentionally split into two accounting domains:

- The `sBTC` domain, where users deposit bridged Bitcoin exposure and receive the
  `vault-shares-sbtc` SIP-010 token as their share receipt.
- The `STX` domain, where users deposit native STX and receive the
  `vault-shares-stx` SIP-010 token as their share receipt.

`stSTX` is not a user deposit asset in v1. It is a strategy-held receipt asset inside
the STX domain and is only visible through managed balance reporting.

## Asset model

### Native BTC to sBTC

Saturn does not accept native BTC directly. The Bitcoin-side bridge flow sits outside
the vault and is treated as an explicit dependency. A user who wants Bitcoin exposure
inside Saturn must first bridge into `sBTC`, then call `deposit-sbtc` on the Saturn
vault. For the purposes of this MVP, the relevant mainnet reference is the sBTC v1
contract principal `SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR`.

That assumption matters because Saturn inherits three external truths from sBTC:

1. `sBTC` is the Stacks-side representation of bridged BTC.
2. The 1:1 peg depends on the signer set and the Bitcoin UTXO that backs the bridge.
3. Saturn can verify SIP-010 balances on Stacks, but it cannot independently prove
   signer honesty or the BTC backing state from inside Clarity.

In other words, Saturn can protect users against vault misuse, unauthorized strategy
selection, and unexpected contract-side transfers. It cannot remove the bridge trust
assumption that underlies the asset itself.

### Vault asset flow

The full `sBTC` flow is:

1. BTC is bridged to `sBTC` outside Saturn.
2. The user calls `deposit-sbtc`.
3. The vault receives `sBTC` under its own principal and mints `vault-shares-sbtc`
   to the user.
4. A keeper or admin later calls `rebalance`.
5. The active strategy sends idle `sBTC` into an approved adapter.
6. The adapter interacts with the pinned upstream protocol.
7. Withdrawals either use idle balance immediately or ask the strategy to free assets
   before the vault burns shares and returns `sBTC`.

The full `STX` flow is:

1. The user calls `deposit-stx`.
2. The vault receives STX directly and mints `vault-shares-stx`.
3. A strategy may deploy STX into BitFlow or StackingDAO through an approved adapter.
4. If StackingDAO is used, the strategy-held receipt asset becomes `stSTX`.
5. On exit, the vault either uses idle STX or calls the strategy to free STX
   equivalents before completing the withdrawal.

## Share accounting and domain math

The key design rule is that Saturn never mixes accounting domains. The `sBTC` share
token only tracks `sBTC`-denominated assets. The `STX` share token only tracks
`STX`-denominated assets, including the STX-equivalent value of any `stSTX` held by a
strategy.

The intended live formulas are:

```text
sbtc_total_assets = idle_sbtc + managed_sbtc
stx_total_assets = idle_stx + managed_stx + ststx_marked_to_stx

satbtc_price = sbtc_total_assets / total_sbtc_shares
satstx_price = stx_total_assets / total_stx_shares
```

For live integrations, new share minting should follow the usual vault formula:

```text
minted_shares = deposit_amount * total_shares / total_assets_before_deposit
```

with the bootstrap case:

```text
if total_shares == 0 then minted_shares = deposit_amount
```

The current MVP deliberately keeps issuance and redemption at par. In code, deposits
mint 1:1 shares and withdrawals redeem 1:1 units because the strategies are mocked,
the adapters return deterministic values, and harvest does not yet modify net asset
value. That simplification is acceptable for grant review because it makes the safety
boundaries easy to verify while keeping the economic formula visible in this spec for
the next milestone.

For the STX domain specifically, `stSTX` must eventually be marked back to STX using
StackingDAO's `get-stx-per-ststx` conversion surface rather than assuming `1 stSTX =
1 STX` forever. The MVP stores `managed-ststx` separately so the accounting model is
already shaped for that upgrade.

## Formal invariants

The grant reviewers should be able to read the code and this document together and
understand which properties Saturn intends to preserve at all times. The following
invariants are the core of the vault model.

### Invariant 1: accounting domains never mix

The `sBTC` domain and the `STX` domain are intentionally separate accounting systems.
An `sBTC` deposit can only mint `vault-shares-sbtc`. An `STX` deposit can only mint
`vault-shares-stx`. A withdrawal in one domain must not consume balances or shares
from the other domain.

Practically, that means:

- `idle-sbtc`, `managed-sbtc`, and `total-sbtc-shares` govern only `sBTC` positions.
- `idle-stx`, `managed-stx`, `managed-ststx`, and `total-stx-shares` govern only STX
  positions.
- No strategy is allowed to satisfy an `sBTC` redemption with STX-domain assets or an
  `STX` redemption with `sBTC`-domain assets.

This matters because mixed-domain accounting is one of the easiest ways for a
yield-aggregator vault to misprice shares or silently leak value between users.

### Invariant 2: user exits are liquidity-gated before share burn

The vault must never burn a user's shares unless it can actually complete the payout.
Normal withdrawals therefore follow a strict sequence:

1. determine whether idle liquidity is sufficient,
2. recall assets from the strategy if required,
3. re-check liquidity using the amount actually freed,
4. burn shares,
5. transfer assets to the user.

Because Clarity transactions are atomic, any failure before the final payout causes
the entire transaction to revert. This invariant is more important than raw
throughput. Saturn would rather fail a withdrawal cleanly than partially unwind state
and leave the user with fewer shares but no assets.

### Invariant 3: idle liquidity is always the first line of redemption

Idle balances are the safest redeemable funds in the system because they do not depend
on strategy execution or upstream protocol responsiveness. Saturn therefore treats
idle liquidity as the first withdrawal source and exposes explicit safe-mode exits for
that path.

In production terms, this means:

- the vault should satisfy withdrawals from `idle-sbtc` or `idle-stx` before asking a
  strategy to free assets,
- pause mode stops new risk-taking but does not intentionally strand users if idle
  liquidity exists,
- and any future keeper policy should preserve a meaningful idle buffer rather than
  chasing full utilization at all times.

### Invariant 4: exact-principal policy overrides trait compatibility

Trait conformance is not sufficient to authorize asset movement. A contract may
present the right function surface and still be the wrong recipient. Saturn therefore
uses traits for interface shape and allowlists for trust.

The invariant is:

- only the known Saturn strategy principals may be activated,
- only the known Saturn adapter principals may be approved,
- and public users never get to inject a principal into a path that moves capital.

This is the main control that prevents contract confusion in a trait-oriented design.

### Invariant 5: paused mode is a risk brake, not a custody trap

Saturn's pause mechanism exists to stop new exposure and operator actions while still
preserving the cleanest possible recovery path for users. In the current MVP:

- deposits are blocked while paused,
- normal withdrawals that may require strategy execution are blocked while paused,
- safe withdrawals from idle balances remain available.

The protocol should therefore be judged on whether pause state narrows behavior
without unnecessarily confiscating agency from depositors.

### Invariant 6: share pricing must remain explainable

Even though the MVP uses par-value minting and redemption, the long-term share-pricing
model is already constrained by a simple rule: each domain's price per share must be
derivable from assets visible in that domain.

For `sBTC`, the intended net asset value is:

```text
idle_sbtc + managed_sbtc
```

For STX, the intended net asset value is:

```text
idle_stx + managed_stx + ststx_marked_to_stx
```

If Saturn later adds fees, harvest accrual, or richer strategy positions, those
extensions still need to preserve that explainability. Hidden liabilities or
cross-domain offsets would weaken the core product promise that users can understand
what backs their share token.

## Strategy and adapter model

Saturn uses traits for modularity, but the vault never accepts arbitrary strategy or
adapter principals from public callers. That is an intentional defense against trait
confusion. A contract that happens to satisfy the same trait surface is still rejected
unless its principal exactly matches an allowlisted address.

The current strategy set is:

- `conservative-strategy`, which models an STX -> `stSTX` route through
  StackingDAO.
- `balanced-strategy`, which models split `sBTC` deployment across Zest and BitFlow
  and can also deploy STX through BitFlow.

The adapter layer exists to normalize different upstream ABIs into a smaller Saturn
trait. That is why the Zest, StackingDAO, and BitFlow adapters return simple
amount-based responses in the MVP even though the real upstream contracts use
different combinations of `bool`, `uint`, tuples, and NFT-based withdrawal state.

## Rebalance and harvest behavior

`rebalance` only runs when the vault is not paused, the active strategy is approved,
and every required adapter for that strategy is also approved. The operator path is
fail-closed. If an adapter is removed from the allowlist, or a strategy requires an
adapter that is no longer approved, the rebalance transaction aborts before any state
is mutated.

`harvest` follows the same rule. In the MVP it is a structural hook rather than a live
value-accrual routine, but the authorization and pause boundaries already match the
production design.

The off-chain operator policy that sits around these calls is equally important. A
keeper should not call `rebalance` just because a timer elapsed. It should check:

- vault pause state,
- current idle and managed balances,
- whether the active strategy still has all required adapters approved,
- and whether any upstream integration has been marked as degraded by operations.

That policy is documented in `scripts/keeper/README.md` because Saturn's moat is not
only its contracts. It is the combination of on-chain controls and an operational
surface that behaves conservatively when uncertainty is high.

## Edge case behavior

### If a strategy returns fewer assets than expected

The withdrawal functions are written so that strategy-freeing is not enough on its own
to complete a payout. After the strategy returns a release tuple, the vault updates its
managed and idle counters using the amount actually freed, then runs an explicit
liquidity check before burning shares or sending funds to the user.

That means the behavior is:

1. Ask strategy to free assets.
2. Record the actual `sbtc-freed` or `stx-freed` value.
3. Re-check idle liquidity.
4. Only burn shares and pay the user if enough idle liquidity now exists.

If the strategy under-delivers, the transaction reverts before user payout. Because
Clarity transactions are atomic, the user does not end up with burned shares and no
assets.

### If one adapter is paused or deliberately disabled during rebalance

Saturn handles this in two layers:

- Governance layer: the admin can set the adapter approval flag to `false`.
- Runtime layer: the strategy will not execute unless all required adapters remain
  approved.

So if BitFlow or Zest is paused, the expected response is to remove that adapter from
the allowlist and either keep assets idle or switch to a strategy whose dependencies
are still approved. If an upstream adapter reverts unexpectedly, the entire rebalance
call reverts and the idle balances remain untouched.

For the conservative STX path, there is an additional protocol-specific edge case:
StackingDAO withdrawals are asynchronous. A future live adapter will need to separate
"withdrawal requested" from "withdrawal completed" rather than pretending that every
recall can settle in one transaction. That is why this repository documents the
withdrawal-receipt lifecycle explicitly in the StackingDAO dossier instead of hiding
that complexity behind a generic adapter abstraction.

### If the vault itself is paused

Normal deposit and normal withdrawal entrypoints are blocked. Safe-mode withdrawals
remain available for idle liquidity because they do not require any strategy code to
run. This is a deliberate separation between "stop new risk" and "trap users."

## Deployment and compatibility assumptions

For live integration work Saturn will pin upstream contracts through verified mainnet
principals and, where possible, Clarinet requirements. The primary principals already
documented in this repository are:

- Zest: `SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.pool-borrow`
- StackingDAO: `SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.stacking-dao-core-v1`
- BitFlow: `SPQC38PW542EQJ5M11CR25P7BS1CA6QT4TBXGB3M.stableswap-stx-ststx-v-1-2`

Those principals appear in the adapter comments and the integration dossiers because
the grant reviewers should be able to verify that Saturn is integrating against real
deployed surfaces rather than aspirational protocol names.
