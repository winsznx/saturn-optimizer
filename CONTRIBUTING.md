# Contributing

## Local workflow

See [`docs/development.md`](docs/development.md) for the full local setup.
Quick start:

1. Install dependencies with `npm install`
2. Validate contracts with `clarinet check`
3. Run tests with `npm test`

## Project conventions

## Development Workflow

1.  **Fork & Clone**: Fork the repository and clone it locally.
2.  **Branching**: Create a feature branch for your changes: `git checkout -b feat/your-feature`.
3.  **Code**: Implement your changes following the [project conventions](#project-conventions).
4.  **Test**: Ensure all tests pass: `npm test`.
5.  **Lint**: Check for linting errors in the web app: `npm run lint -w apps/web`.
6.  **Commit**: Commit your changes using [conventional commits](#commit-standards).

## Commit Standards

We use [Conventional Commits](https://www.conventionalcommits.org/) for automated changelog generation and versioning.

Format: `<type>(<scope>): <description>`

Common types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries

## Pull requests

- **Small PRs**: Prefer small, focused PRs over monolithic changes.
- **Documentation**: Update relevant documentation in `docs/` or README.
- **Verification**: Include the exact commands used for verification (e.g., `npm test`, `clarinet check`).
- **Description**: Clearly describe the impact of the change on the vault's security posture or user experience.

## Post-condition policy

Any new user-facing contract call must ship in `PostConditionMode.Deny` with an
explicit post-condition list — see
[`docs/post-conditions.md`](docs/post-conditions.md). PRs that introduce a write
call without a post-condition will be blocked.

## Type safety

- `npx tsc --noEmit -p apps/web` must be clean before opening a PR.
- New utilities should ship with a unit test under `apps/web/tests/`.
