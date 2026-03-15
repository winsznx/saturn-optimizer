# StackingDAO Integration Dossier

Status: MOCKED — pending upstream API review

## Pinned mainnet principals

- Core protocol entrypoint: `SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.stacking-dao-core-v1`
- Reserve contract: `SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.reserve-v1`
- Liquid staking token: `SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.ststx-token`

## Functions Saturn plans to call

- `deposit (reserve-contract <reserve-trait>) (stx-amount uint) (referrer (optional principal))) -> (response uint uint)`
- `init-withdraw (reserve-contract <reserve-trait>) (ststx-amount uint)) -> (response uint uint)`
- `withdraw (reserve-contract <reserve-trait>) (nft-id uint)) -> (response uint uint)`
- `get-stx-per-ststx (reserve-contract <reserve-trait>)) -> (response uint uint)`
- Supporting reserve calls:
  `lock-stx-for-withdrawal`
  `request-stx-for-withdrawal`
  `get-total-stx`

## Why this integration fits Saturn

StackingDAO is the conservative STX leg of Saturn. When users deposit `STX`, the
vault can hand those funds to the StackingDAO core contract, which moves principal
into the reserve contract and mints `stSTX` back to the vault as the strategy-held
receipt asset. That makes StackingDAO the clearest way to model a conservative
`STX -> stSTX` flow inside a Stacks-native yield vault. The grant MVP keeps this
path mocked because the real protocol is cycle-based and withdrawals are two-step:
the adapter must open a withdrawal request with `init-withdraw`, wait for the unlock
window, and then call `withdraw` against the withdrawal NFT. Saturn's mocked adapter
keeps the accounting interface simple while the dossiers and comments pin the exact
live surfaces.

## Live asset-flow model

The intended conservative flow is:

1. Saturn holds user-deposited STX in the vault.
2. The active conservative strategy deploys a reviewed amount of STX through the
   `stacking-dao-core-v1.deposit` entrypoint, referencing the pinned `reserve-v1`
   contract.
3. StackingDAO returns `stSTX` to the strategy-controlled Saturn position as the
   liquid receipt asset.
4. Saturn treats that `stSTX` balance as managed STX-domain exposure, not as a new
   user deposit asset.
5. When liquidity must be recalled, the strategy initiates withdrawal of `stSTX`
   rather than assuming immediate redemption into STX.
6. Once the protocol unlock window is satisfied, Saturn completes the withdrawal and
   returns the resulting STX to vault idle liquidity.

The important design detail is that Saturn's user-facing share accounting remains STX
denominated throughout this process. Users do not receive `stSTX` directly from the
vault. They hold STX-domain Saturn shares, while the strategy deals with the protocol
receipt asset under the hood.

## Withdrawal receipt lifecycle

This is the protocol-specific behavior that matters most for correctness.

### Step 1: initiate withdrawal

The live adapter will call:

- `init-withdraw (reserve-contract <reserve-trait>) (ststx-amount uint)) -> (response uint uint)`

That call does not return STX directly. It returns a withdrawal identifier tied to
the protocol's withdrawal queue. Saturn must treat that response as a state
transition, not as settled liquidity.

### Step 2: track pending maturity

After `init-withdraw`, the strategy has an in-flight withdrawal claim. The protocol is
still holding the redeemable STX until the unlock conditions are met. Saturn should
therefore distinguish between:

- idle STX already available for payout,
- managed `stSTX` still deployed in the strategy,
- and pending withdrawal claims that are on the path back to idle STX but are not yet
  redeemable.

The grant MVP intentionally keeps this pending state mocked because the current vault
surface focuses on safe custody and allowlist discipline first. The dossier still
documents the lifecycle now so the next milestone can add receipt-aware accounting
without redesigning the strategy model from scratch.

### Step 3: complete withdrawal

Once the unlock condition is met, the live adapter will call:

- `withdraw (reserve-contract <reserve-trait>) (nft-id uint)) -> (response uint uint)`

At that point the strategy receives settled STX back from StackingDAO. Only then
should Saturn count the recalled amount as idle liquidity available for user exit.

### Why Saturn does not flatten this into a single mock forever

It would be easier to pretend that `stSTX` is instantly redeemable, but that would
hide one of the most important protocol-specific risks in the conservative strategy.
The point of the Saturn architecture is not only to standardize adapters. It is to
standardize them honestly. StackingDAO's withdrawal queue and receipt model are real,
so the production adapter has to expose that reality to Saturn's accounting and
operator tooling.

## Assets and risks

| Asset | Contract / surface | Risk note |
| --- | --- | --- |
| `STX` | `stacking-dao-core-v1.deposit` via `reserve-v1` | Deposits are straightforward but depend on the reserve contract preserving enough liquid STX outside active stacking. |
| `stSTX` | `ststx-token` minted by protocol | The mark-to-STX conversion changes over time, so Saturn must use `get-stx-per-ststx` instead of assuming 1:1 redemption forever. |
| Withdrawal NFT | `stacking-dao-core-v1.init-withdraw` / `withdraw` | Exit is not synchronous; timing risk exists between initiation and final claim after the unlock condition is met. |

## Saturn implementation notes

- Status today: the adapter is mocked and returns deterministic amounts so the vault
  can demonstrate authorization, accounting isolation, and pause behavior.
- Status for live-compatible integration: Saturn will need receipt-aware tests, a
  storage model for pending withdrawals, and explicit handling of `get-stx-per-ststx`
  so the STX domain reflects current protocol conversion rather than stale notional
  balances.
- Non-goal for MVP: exposing StackingDAO internals directly to Saturn end users. The
  user should see a conservative STX strategy with clear liquidity expectations, not a
  raw list of protocol receipts.

## Contact plan

- Confirm the intended reserve contract and withdrawal NFT lifecycle with the StackingDAO team before wiring the live adapter.
- Open or link a public integration review thread with the pinned principals above, the Saturn conservative strategy, and the expected withdrawal-state machine.
- Replace the mock after the full deposit/init-withdraw/withdraw path is mirrored in Clarinet requirements and covered by cycle-aware tests.
