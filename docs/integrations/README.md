# Saturn Integrations

Each upstream protocol Saturn touches has its own dossier covering pinned principals,
the exact functions the adapter calls, and the trust assumptions inherited from that
integration.

- [BitFlow](./bitflow.md) — STX/stSTX stable pool and rewards staking
- [StackingDAO](./stackingdao.md) — STX → stSTX liquid staking
- [Zest](./zest.md) — sBTC lending markets

The contracts under `contracts/adapters/` translate Saturn's small internal surface
(`deposit`, `withdraw`, `harvest`, `position`) into each protocol's exact ABI. They
are intentionally thin so that upstream changes are easy to mirror.
