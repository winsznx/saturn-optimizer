# Threat Model

## Security objective

Saturn's v1 objective is narrower than "solve all Bitcoin DeFi risk." The actual goal
is to create a single vault entrypoint that is safer than asking users to manually hop
between protocols, while staying honest about what the vault can and cannot protect.

The repository is built around five safety assumptions:

1. The vault must only move funds to exact-principal strategies and adapters that have
   already been approved by governance.
2. A user should always be able to redeem idle liquidity without needing strategy code
   to execute.
3. If a strategy cannot free enough capital, the withdrawal must revert before user
   shares are burned or funds are transferred.
4. Admin and keeper operations must reject indirect, contract-mediated calls.
5. User-facing transactions must ship with post-conditions in Deny mode by default.

Those guarantees are what Saturn owns. Saturn does not remove upstream risks such as
sBTC bridge assumptions, Zest liquidity conditions, or StackingDAO cycle timing. The
point of this threat model is to show where the vault boundary ends and where
underlying protocol risk begins.

## Post-condition analysis by entrypoint

Stacks post-conditions are a client-side seatbelt. The contract cannot mutate them
after the transaction is signed, and wallets display them before broadcast. Saturn
expects every user-facing asset-moving transaction to be constructed in Deny mode.
Under Deny mode, any asset transfer that is not explicitly allowed by a post-condition
causes the transaction to abort.

That does not make post-conditions sufficient on their own. They do not verify who the
recipient is, and they cannot replace vault-side authorization or adapter allowlists.
They are one line of defense, not the only one.

### `deposit-sbtc`

Required post-condition:

- The user's principal may send at most the requested `sBTC` amount from
  `SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR` to complete the transaction.

What Deny mode enforces:

- No extra `sBTC`, STX, or share-token transfer can occur from the user principal
  beyond what was explicitly declared.

What Clarity still enforces:

- The vault must mint shares to the caller.
- The vault must receive the token transfer.
- The vault cannot redirect assets to an arbitrary adapter during deposit because
  `deposit-sbtc` only moves value into the vault.

### `deposit-stx`

Required post-condition:

- The user's principal may send at most the requested STX amount to the vault.

What Deny mode enforces:

- No extra STX or fungible token movement from the user account is allowed.

What Clarity still enforces:

- The vault must mint STX-domain shares.
- The transfer destination is the vault principal, not a user-supplied contract.

### `withdraw-sbtc`

Required post-condition:

- The vault principal may send at most the requested `sBTC` amount to the caller.

What Deny mode enforces:

- No additional `sBTC` or STX transfers from the user account or vault account are
  allowed unless explicitly declared in the signed transaction.

What Clarity still enforces:

- The caller must own the shares being redeemed.
- If managed liquidity must be recalled, the strategy can only call approved adapters.
- If not enough underlying is freed, the transaction reverts before the share burn and
  payout finalize.

### `withdraw-stx`

Required post-condition:

- The vault principal may send at most the requested STX amount to the caller.

What Deny mode enforces:

- No extra STX leaves the vault or the user's wallet beyond the declared transfer.

What Clarity still enforces:

- The caller must own the STX-domain shares.
- Strategy recall is bounded by the active allowlisted strategy and allowlisted
  adapters.
- `send-stx` runs under `as-contract`, so the contract can only spend vault-owned STX.

### `safe-withdraw-sbtc`

Required post-condition:

- The vault principal may send at most the requested `sBTC` amount to the caller.

What Deny mode enforces:

- The transaction may not route value through strategies or adapters because those
  flows are not listed.

What Clarity still enforces:

- Idle liquidity must be sufficient before the user can exit.
- Shares are burned only if the vault can complete the payout from idle balance alone.

### `safe-withdraw-stx`

Required post-condition:

- The vault principal may send at most the requested STX amount to the caller.

What Deny mode enforces:

- Any unexpected vault outflow outside the approved STX withdrawal aborts the
  transaction.

What Clarity still enforces:

- The call never executes strategy logic.
- The transfer is made from the vault's own STX balance, not from the caller.

### `rebalance`

`rebalance` is an operator transaction rather than a user transaction, but it still
moves assets. The operator should construct contract-principal post-conditions in
Deny mode so the only authorized outflows are the amounts intentionally deployed from
the vault.

Expected operator stance:

- Conservative strategy: allow the Saturn vault principal to move only the exact STX
  amount being deployed into the StackingDAO path.
- Balanced strategy: allow the Saturn vault principal to move only the exact STX and
  `sBTC` amounts being deployed into the approved Zest and BitFlow routes.

Known limitation:

- Post-conditions cannot prove the recipient contract. That is why the vault itself
  enforces exact strategy and adapter principal checks before any rebalance can run.

### `harvest`

The current MVP mock harvest does not move user-owned assets, but the production path
will. The correct operator policy is still Deny mode: only the explicitly expected
reward claim and vault return path should be permitted. No operator-owned assets should
move other than the transaction fee.

## Principal confusion and trait safety

Trait-typed integration is one of the biggest correctness traps in Clarity DeFi. A
contract can implement the same function surface as a legitimate adapter while doing
something completely different with the call. If the vault allowed a user to submit an
arbitrary contract principal that merely satisfied the adapter trait, Saturn would be
open to contract confusion.

Saturn avoids that by design:

- Public user entrypoints never accept a strategy or adapter principal.
- The vault hard-codes the set of supported strategies and adapters for v1.
- Governance can only approve principals that match that known set.
- `set-active-strategy` requires the strategy to be both supported and approved.
- `required-adapters-approved` blocks execution if the selected strategy depends on an
  adapter that is not explicitly approved.

This means the trait is used for compatibility and testability, not for user-selected
dynamic dispatch. That distinction matters. The trait says "what interface the vault
expects." The allowlist says "which exact contract is trusted to satisfy it."

## Authorization model: `tx-sender` and `contract-caller`

Stacks authorization bugs often come from relying on `tx-sender` alone in a multi-call
environment. Saturn's approach is intentionally conservative.

### Public user functions

`deposit-sbtc`, `deposit-stx`, `withdraw-sbtc`, `withdraw-stx`,
`safe-withdraw-sbtc`, and `safe-withdraw-stx` are public because they are user
actions. They do not rely on privileged authentication. Instead, they rely on:

- share ownership,
- vault-held balances,
- strategy allowlists,
- pause state,
- and deterministic recipient selection (`recipient = tx-sender` for withdrawals).

### Admin-only functions

`set-keeper`, `set-strategy-approved`, `set-adapter-approved`, and
`set-active-strategy` are protected by `assert-admin`, which requires both
`tx-sender` and `contract-caller` to equal the stored admin principal. That blocks a
malicious intermediary contract from borrowing the admin's `tx-sender` while becoming
the immediate caller.

### Operator-only functions

`rebalance` and `harvest` use `assert-operator`, which requires:

- `tx-sender == contract-caller`, and
- the caller must be either the stored admin or the stored keeper.

That direct-call rule is deliberate. It means keeper automation must call the vault
directly, not through an arbitrary helper contract.

## `as-contract` analysis

There is one `as-contract` path in the local codebase: `send-stx` inside
`saturn-vault.clar`.

Why it exists:

- STX withdrawals must spend STX held by the vault principal, not STX held by the
  external caller.

What changes inside the `as-contract` block:

- `tx-sender` becomes the vault contract principal for the duration of the expression.
- `contract-caller` also becomes the vault contract principal inside that context.

Why that is safe here:

- The outer withdrawal functions already determine `recipient = tx-sender` from the
  user call before entering `as-contract`.
- The withdrawal path checks pause status, nonzero amount, and available liquidity
  before it attempts the transfer.
- For normal withdrawals, the vault also verifies that strategy recall has produced
  enough idle funds before the payout proceeds.
- The vault never uses `as-contract` to call an arbitrary user-supplied contract.

In short, `as-contract` is used to spend vault-owned STX and only after the rest of
the withdrawal invariants have passed.

## Emergency exit and failure handling

### Normal paused-state exit

If the protocol is paused but the vault still responds on-chain, the intended user
runbook is:

1. Query `get-user-position` and `get-vault-balances`.
2. If idle liquidity exists, call `safe-withdraw-sbtc` or `safe-withdraw-stx`.
3. Sign the transaction with Deny-mode post-conditions that only allow the expected
   payout from the vault principal.
4. Verify the withdrawal succeeded and the corresponding share balance decreased.

### If the vault is paused and both the vault and strategy are unresponsive

This is the most important limitation to state plainly: v1 does not yet include a
trustless user-triggered escape hatch for managed funds when both the vault logic and
the active strategy path are unavailable.

The practical recovery process is therefore operational rather than purely autonomous:

1. Do not transfer or sell the share tokens. They remain the user's claim ticket.
2. Query public state and incident communication to determine how much value is still
   idle versus managed.
3. Verify which strategy was active and which adapter principals were approved at the
   time of failure.
4. Wait for the admin or incident-response operator to either unwind adapters
   off-chain through the documented runbook or publish a migration / recovery contract.
5. Redeem through the recovery path once the operator has returned funds to a responsive
   vault or migration contract.

This is not the end-state security model Saturn wants. It is the honest v1 position.
That limitation is acceptable for the grant MVP because:

- the system scope is deliberately narrow,
- the repository already exposes the adapter and strategy principal set,
- idle funds remain user-exitable through safe mode,
- and the governance upgrade path below is specifically designed to remove this weak
  point in later milestones.

## Why the v1 admin model is acceptable for MVP

The current admin model is owner-gated and has no timelock. That is not the desired
long-term governance design, but it is acceptable for this grant-stage MVP for four
reasons:

1. The contract surface is small and explicit. There is no proxy upgrade system and no
   open-ended plugin registry.
2. Strategy and adapter principals are exact and enumerable.
3. The pause function exists to stop new risk quickly if an issue is found.
4. The repo is optimized for auditability right now: `clarinet check`, tests, and
   explicit dossiers matter more at this stage than complex governance.

## Governance upgrade path

The governance path after MVP is concrete:

1. Replace the single admin principal with a multisig-controlled admin.
2. Move strategy and adapter approval changes behind a timelock.
3. Publish a registry contract so approved protocol principals are recorded on-chain in
   a more transparent, event-friendly format.
4. Add user-visible proposal metadata and incident notices to the web app.
5. Transition from multisig control to DAO-ratified policy once the protocol has real
   TVL and audited live integrations.

The point is not that v1 governance is perfect. The point is that it is intentionally
simple, easy to review, and paired with a clear path toward stronger operational
controls as Saturn moves from grant MVP to real asset deployment.
