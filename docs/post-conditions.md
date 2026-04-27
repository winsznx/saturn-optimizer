# Post-Condition Policy

Saturn ships every user-facing transaction in **Deny** mode with explicit
post-conditions. Deny mode is enforced by the wallet UI and by Stacks itself: any
asset movement that is not declared in the post-condition list aborts the transaction
before block inclusion.

This document maps each entrypoint in `useVault` to the post-conditions the web app
attaches before signing.

## Deposits — exact-amount, user principal

The user knows the deposit amount up front, so we declare it precisely.

| Entrypoint     | Post-condition                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------ |
| `deposit-sbtc` | `Pc.principal(user).willSendEq(amount).ft(SBTC_TOKEN_PRINCIPAL, "sbtc")`                         |
| `deposit-stx`  | `Pc.principal(user).willSendEq(amount).ustx()`                                                   |

Any extra outbound transfer from the user (a second token, a hidden STX dust amount)
fails the transaction.

## Withdrawals — vault-side, lower-bound

The exact amount returned depends on the share-to-asset rate at execution time. The
frontend can read the rate before signing, but a small drift between read and
inclusion is normal. We declare the vault as a sender of the asset and require **at
least one base unit** to move:

| Entrypoint            | Post-condition                                                                  |
| --------------------- | ------------------------------------------------------------------------------- |
| `withdraw-sbtc`       | `Pc.principal(VAULT).willSendGte(1).ft(SBTC_TOKEN_PRINCIPAL, "sbtc")`           |
| `withdraw-stx`        | `Pc.principal(VAULT).willSendGte(1).ustx()`                                     |
| `safe-withdraw-sbtc`  | same as `withdraw-sbtc`                                                         |
| `safe-withdraw-stx`   | same as `withdraw-stx`                                                          |

The lower-bound condition prevents a zero-payout race and still blocks any
unexpected secondary transfer (for example, an attempted drain of share tokens to a
third party).

## What this does **not** protect against

- bridge-level sBTC failures: post-conditions cannot evaluate signer honesty
- approved upstream protocols misbehaving (Zest, BitFlow, StackingDAO)
- governance-approved strategies that are themselves malicious

The Clarity contracts cover those via allowlists and the emergency-pause module.
Post-conditions are the *client-side* layer of that defense.

## Source

- Helpers: `apps/web/src/lib/post-conditions.ts`
- Wired into: `apps/web/src/lib/hooks/use-vault.ts`
