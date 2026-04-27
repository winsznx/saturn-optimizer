# Environment Configuration

The web app (`apps/web`) reads two `NEXT_PUBLIC_*` variables at build/start time. All
defaults target Saturn's mainnet deployment so a fresh checkout connects to the live
contracts without extra setup.

## `NEXT_PUBLIC_STACKS_NETWORK`

| Value     | Effect                                                  |
| --------- | ------------------------------------------------------- |
| `mainnet` | Hiro mainnet API + mainnet sBTC token (default)         |
| `testnet` | Hiro testnet API + the testnet sBTC token principal     |

When the variable is absent or set to anything other than `testnet`, the app falls
back to mainnet. The same value is used to:

- choose the API host (`https://api.hiro.so` vs `https://api.testnet.hiro.so`)
- pick the right session address (`profile.stxAddress.mainnet` vs `.testnet`)
- pin the sBTC token contract used in post-conditions

## `NEXT_PUBLIC_SATURN_DEPLOYER`

The principal that owns the deployed `saturn-vault`, `saturn-token-v2`,
`saturn-governance`, and `saturn-metrics` contracts. Defaults to the canonical
mainnet deployer:

```
SP31DP8F8CF2GXSZBHHHK5J6Y061744E1TNFGYWYV
```

Override this when running against a fork, a private deployment, or a staging
account. The value is read once at module import and is **not** hot-reloaded.

## Local override

Create `apps/web/.env.local` with the variables you want to override:

```
NEXT_PUBLIC_STACKS_NETWORK=testnet
NEXT_PUBLIC_SATURN_DEPLOYER=ST1...
```

Then `npm --prefix apps/web run dev` — Next.js will pick up the changes on the next
build.
