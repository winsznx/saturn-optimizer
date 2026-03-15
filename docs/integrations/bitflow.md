# BitFlow Integration Dossier

Status: MOCKED — pending upstream API review

## Pinned mainnet principals

- Stable pool: `SPQC38PW542EQJ5M11CR25P7BS1CA6QT4TBXGB3M.stableswap-stx-ststx-v-1-2`
- Rewards contract: `SPQC38PW542EQJ5M11CR25P7BS1CA6QT4TBXGB3M.earn-stx-ststx-v-1-2`

## Functions Saturn plans to call

- `add-liquidity (y-token <sip-010-trait>) (lp-token <lp-trait>) (x-amount-added uint) (y-amount-added uint) (min-lp-amount uint)) -> (response uint (string-ascii 33))`
- `withdraw-liquidity (y-token <sip-010-trait>) (lp-token <lp-trait>) (lp-amount uint) (min-x-amount uint) (min-y-amount uint)) -> (response {withdrawal-x-balance: uint, withdrawal-y-balance: uint} (string-ascii 47))`
- `stake-lp-tokens (y-token <sip-010-trait>) (lp-token <sip-010-trait>) (cycles uint) (amount uint)) -> (response bool (string-ascii 30))`
- `claim-all-staking-rewards (y-token <sip-010-trait>) (lp-token <sip-010-trait>)) -> (response {x-token-reward: uint} (string-ascii 27))`
- `unstake-all-lp-tokens (y-token <sip-010-trait>) (lp-token <sip-010-trait>)) -> (response uint (string-ascii 32))`

## Why this integration fits Saturn

BitFlow is the yield-maximizing leg of the balanced strategy. For the STX domain, the
intended live path is: vault STX plus vault-held `stSTX` are added to the BitFlow
stable pool, the LP token is staked in the BitFlow rewards contract, and later the
adapter unwinds both the LP position and the rewards back into the vault. That gives
Saturn a concrete on-chain venue for a higher-yield STX strategy without making the
vault itself care about LP math. The current MVP keeps the integration mocked because
BitFlow's published mainnet surface is centered on the `STX/stSTX` pair, while the
future Saturn `sBTC` leg still needs an explicit upstream review and a pinned Bitcoin
pool contract before we should route real value through it.

## Assets and risks

| Asset | Contract / surface | Risk note |
| --- | --- | --- |
| `STX` | `stableswap-stx-ststx-v-1-2.add-liquidity` | LP entry can slip if pool conditions move, so Saturn must use conservative minimum outputs and fail closed. |
| `stSTX` | paired with STX in the BitFlow stable pool | The strategy inherits both BitFlow pool risk and StackingDAO conversion risk at the same time. |
| LP token / reward claim | `earn-stx-ststx-v-1-2.stake-lp-tokens`, `claim-all-staking-rewards`, `unstake-all-lp-tokens` | Reward accounting is multi-step and depends on cycle bookkeeping, so test coverage has to prove the unstake and claim path before mainnet use. |
| Future Bitcoin route | pending sBTC-compatible pool review | The current adapter keeps the `sBTC` leg mocked until BitFlow publishes a pinned mainnet surface that matches Saturn's allowlist and post-condition model. |

## Contact plan

- Confirm the preferred `STX/stSTX` pool and reward contract pairing with BitFlow maintainers before live integration.
- Open or link a public integration review thread covering the exact principals above, plus the open question around a future `sBTC` pool.
- Replace the mock only after Clarinet requirements pin the deployed contracts and the adapter tests exercise add-liquidity, unstake, and reward-claim flows against the real ABI.
