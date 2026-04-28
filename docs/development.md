# Local development

This guide assumes Node 20 (`.nvmrc`) and a working `clarinet` install.

## One-time setup

```bash
nvm use
npm install        # installs root + workspace dependencies
clarinet check     # validates contracts under contracts/
```

## Daily workflow

| Task                      | Command                                         |
| ------------------------- | ----------------------------------------------- |
| Run the web dashboard     | `npm --prefix apps/web run dev`                 |
| Type-check the web app    | `npx tsc --noEmit -p apps/web`                  |
| Run web unit tests        | `npx vitest run apps/web/tests`                 |
| Run web tests in watch    | `npx vitest apps/web/tests`                     |
| Validate Clarity contracts| `clarinet check`                                |
| Run vault Vitest suite    | `npm test`                                      |
| Build for production      | `npm --prefix apps/web run build`               |

## Environment

Copy `apps/web/.env.example` to `apps/web/.env.local` and edit the values you
need. The defaults already point at mainnet — see
[`docs/env-config.md`](./env-config.md) for the full list.

## Running against testnet

```
NEXT_PUBLIC_STACKS_NETWORK=testnet npm --prefix apps/web run dev
```

The web app pins the testnet sBTC token principal automatically; you only need
to supply a testnet `NEXT_PUBLIC_SATURN_DEPLOYER` if you have a separate
testnet deployment.
