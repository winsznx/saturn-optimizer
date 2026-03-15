# Milestones

Saturn is scoped as a three-milestone build so reviewers can evaluate the project with
clear evidence at each checkpoint. Every milestone below includes the exact artifact to
ship, what proof should exist in the repo or on-chain, the week-by-week breakdown, and
the success / failure conditions that determine whether Saturn moves to the next stage.

## Milestone 1: Core vault and security baseline

### Deliverable

Milestone 1 is the secure foundation. The deliverable is a public Clarinet-first
repository that contains:

- the Saturn vault,
- the SIP-010 share tokens for the `sBTC` and `STX` domains,
- the emergency pause module,
- the strategy and adapter traits,
- mock adapters and strategies,
- the threat model, spec, and integration dossiers,
- CI that runs `clarinet check` and the Vitest suite.

This milestone is about proving that the project is real, testable, and structured for
security review before any live capital is routed into external protocols.

### Verifiable evidence

- `clarinet check` passes with zero `check_checker` warnings.
- The Vitest suite passes and covers deposits, withdrawals, safe-mode exits, allowlist
  enforcement, strategy routing, and invariants.
- The public repo contains the security and integration documentation reviewers asked
  for.
- The GitHub workflow shows the project can be checked from a clean clone.

### Week-by-week breakdown

Week 1:
Finalize the Clarinet workspace, traits, share-token deployment model, and repository
layout. Write the vault skeleton, emergency pause module, and the initial tests for
plain deposit / withdraw behavior.

Week 2:
Finish share-token mint and burn authorization, add the allowlist model for strategies
and adapters, and wire the safe withdrawal path. Document the asset model and the sBTC
trust assumptions.

Week 3:
Add strategy mocks, adapter mocks, and explicit tests for paused behavior, operator
authorization, and the `as-contract` withdrawal path. Eliminate all `check_checker`
warnings so the codebase is ready for external review.

Week 4:
Polish the README, threat model, and integration dossiers. Lock CI, rerun the full
test suite, and prepare the grant evidence bundle.

### Success criteria

- Zero `check_checker` warnings remain.
- All tests pass.
- The vault supports both `sBTC` and `STX` deposits with separate share accounting.
- Safe-mode withdrawals work from idle liquidity without strategy execution.
- Reviewer-facing docs explain the security model in concrete Stacks-native terms.

### Failure criteria

- Any unresolved warning remains in `clarinet check`.
- User funds can only exit through strategy execution.
- Strategy or adapter principals can still be user-supplied or dynamically injected.
- The repository cannot be evaluated from code and docs alone.

## Milestone 2: Integration hardening and testnet readiness

### Deliverable

Milestone 2 moves Saturn from mocked integration boundaries to pinned external
surfaces. The deliverable is not "everything live on mainnet." The deliverable is a
testnet-ready integration layer that uses verified contract IDs, known ABIs, and
protocol-reviewed assumptions for Zest, StackingDAO, and BitFlow.

The primary mainnet principals Saturn is targeting are:

- Zest:
  `SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.pool-borrow`
  with reserve support from
  `SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.pool-0-reserve`
- StackingDAO:
  `SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.stacking-dao-core-v1`
  with
  `SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.reserve-v1`
  and
  `SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.ststx-token`
- BitFlow:
  `SPQC38PW542EQJ5M11CR25P7BS1CA6QT4TBXGB3M.stableswap-stx-ststx-v-1-2`
  and
  `SPQC38PW542EQJ5M11CR25P7BS1CA6QT4TBXGB3M.earn-stx-ststx-v-1-2`

### Verifiable evidence

- The adapter files and integration dossiers reference the pinned mainnet principals
  above and the exact public functions Saturn will call.
- Clarinet requirements or deployment metadata are updated to mirror the chosen
  upstream interfaces.
- Adapter tests cover the reviewed call signatures and failure modes.
- A testnet deployment note exists showing which surfaces are still mocked and which
  have been replaced with live-compatible logic.

### Week-by-week breakdown

Week 5:
Verify and pin the Zest reserve, a-token, and oracle tuple for the intended `sBTC`
route. Replace the purely local Zest comments with ABI-backed integration notes and
extend tests around lending liquidity recall.

Week 6:
Implement the live-compatible StackingDAO flow around `deposit`, `init-withdraw`,
`withdraw`, and `get-stx-per-ststx`. Model cycle-aware tests so the STX domain can
accurately convert `stSTX` back into STX equivalents.

Week 7:
Harden the BitFlow STX / `stSTX` path, especially the LP add-liquidity, stake,
unstake, and reward-claim sequence. Keep the Bitcoin-side BitFlow route mocked unless
an explicit reviewed `sBTC` pool is published and pinned.

Week 8:
Run the full integration test matrix on testnet-style settings, document unresolved
operational assumptions, and freeze the testnet candidate release.

### Success criteria

- Every adapter references real, verified mainnet principals.
- The public docs explain exactly which contract calls Saturn makes.
- The integration tests fail closed when an upstream dependency is paused or mis-pinned.
- The STX domain can account for `stSTX` via a protocol-backed conversion surface
  rather than a fixed 1:1 assumption.

### Failure criteria

- Any adapter still depends on guessed mainnet contract IDs.
- The repo cannot show which exact upstream function signatures Saturn intends to call.
- External dependencies remain hidden behind vague "future integration" language.
- The team cannot produce a testnet-ready integration surface without widening the
  trust model.

## Milestone 3: Automation, indexing, and user interface

### Deliverable

Milestone 3 turns the reviewed contracts into an operable product. The deliverable is
a keeper and interface layer that can monitor the vault, trigger harvest / rebalance
operations under a defined policy, and expose user actions through a frontend that uses
Stacks post-conditions in Deny mode by default.

This milestone includes:

- keeper scripts that can call `rebalance` and `harvest`,
- chainhook configurations for deposits, withdrawals, and rebalance events,
- a web interface for wallet connection and vault actions,
- environment-specific settings for devnet and testnet.

### Verifiable evidence

- Keeper logs or dry-run transcripts show the operator path executing against the
  reviewed contracts.
- Chainhook JSON files are wired to vault events with documented payloads.
- The web app includes deposit / withdrawal transaction builders with post-conditions.
- A demo deployment or walkthrough shows the full user path from connect wallet to
  redeem shares.

### Week-by-week breakdown

Week 9:
Turn the keeper scripts from stubs into operational code that reads vault balances,
active strategy state, and pause status before dispatching any transaction.

Week 10:
Wire chainhooks and indexer-facing metadata so deposits, withdrawals, and rebalance
events can be surfaced in the app and in monitoring dashboards.

Week 11:
Build the wallet-connected frontend flow around `deposit-sbtc`, `deposit-stx`,
`withdraw-sbtc`, `withdraw-stx`, and safe-mode withdrawals. Post-conditions should be
displayed and generated in Deny mode by default.

Week 12:
End-to-end hardening, demo polish, and public test instructions. Publish the evidence
bundle for the grant reviewers and any community testers.

### Success criteria

- The keeper does not bypass the vault's direct-call operator restrictions.
- The frontend emits Deny-mode post-conditions for user asset-moving transactions.
- Users can see enough state to understand idle balances, managed balances, and pause
  status before signing.
- The repo contains both contract evidence and operational evidence.

### Failure criteria

- Keeper automation requires privileged shortcuts that the on-chain auth model does not
  allow.
- The frontend omits post-conditions or hides the security assumptions from users.
- Monitoring is too weak to distinguish idle liquidity from managed liquidity.
- Reviewers still need private explanations to understand how Saturn behaves in
  production-like conditions.
