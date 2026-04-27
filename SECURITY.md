# Security Policy

Saturn Optimizer is an MVP and has not yet received an external audit. The contracts and docs in this repository are intended to make review straightforward and to surface the Stacks-specific security controls we intend to ship.

## Reporting

Please report vulnerabilities privately to the project maintainer before opening a public issue. Include:

- the affected contract or script
- a minimal proof of concept
- expected impact and prerequisites

## MVP controls

- `sBTC` and `STX` are accounted for separately
- deposits and standard withdrawals halt when the pause module is active
- safe-mode withdrawals only use idle liquidity and do not execute strategy code
- strategy and adapter contracts are explicit and allowlisted
- the vault never accepts arbitrary strategy or adapter trait references from public callers
- user transactions are intended to ship with Deny-mode post-conditions by default

## Known limitations

- strategy and adapter contracts are grant-MVP skeletons, not production integrations
- upstream contract principals in the integration dossiers remain placeholders until pinned against verified protocol deployments
- the frontend and keeper are currently documented stubs
## Reporting a vulnerability

Please email the maintainers privately rather than opening a public issue. Include
a proof-of-concept transaction id or a minimal Clarinet/Vitest test case where
possible.
