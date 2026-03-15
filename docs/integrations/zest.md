# Zest Integration Dossier

Status: MOCKED — pending upstream API review

## Pinned mainnet principals

- Primary borrow surface: `SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.pool-borrow`
- Reserve/accounting surface: `SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.pool-0-reserve`

## Functions Saturn plans to call

- `supply (lp <ft-mint-trait>) (pool-reserve principal) (asset <ft>) (amount uint) (owner principal)) -> (response bool uint)`
- `withdraw (pool-reserve principal) (asset <ft>) (oracle <oracle-trait>) (assets (list 100 { asset: <ft>, lp-token: <ft>, oracle: <oracle-trait> })) (amount uint) (current-balance uint) (owner principal)) -> (response uint uint)`
- Supporting read-onlys on the reserve surface:
  `get-reserve-state`
  `get-reserve-available-liquidity`
  `get-user-reserve-data`

## Why this integration fits Saturn

Zest is the lending leg of the balanced strategy. The live Saturn adapter will route
vault-owned `sBTC` into the pinned Zest pool, receive interest-bearing reserve
exposure, and later redeem underlying `sBTC` back to the vault during withdrawals,
safe-mode migrations, or rebalances. In the current grant MVP the adapter remains a
deterministic mock because the final reserve/oracle tuple for `sBTC` needs explicit
upstream review before any mainnet funds should rely on it. That is why the repo
already models the exact contract principals and public functions but intentionally
normalizes the upstream return surface into Saturn's smaller adapter trait.

## Assets and risks

| Asset | Contract / surface | Risk note |
| --- | --- | --- |
| `sBTC` | Zest reserve configured through `pool-borrow` and `pool-0-reserve` | Liquidity can be unavailable at the exact block a withdrawal is requested, so Saturn must keep an idle buffer and fail closed if Zest cannot free funds. |
| Interest-bearing reserve receipt | Zest a-token selected by the reserve state | Receipt accounting must match the reserve config exactly; a mismatched a-token or oracle should hard-fail the adapter. |
| Oracle price data | Oracle principal embedded in reserve state | Oracle drift can distort health checks and withdrawal assumptions, so Saturn will pin the oracle address in deployment metadata before live use. |

## Contact plan

- Confirm the final `sBTC` reserve, a-token, and oracle tuple with Zest maintainers before any testnet-to-mainnet transition.
- Open an upstream integration review issue or discussion referencing this dossier, the Saturn adapter contract, and the exact Zest principals above.
- Replace the local mock only after the reviewed surface is mirrored in Clarinet requirements and the simnet tests cover the real call signatures.
