# Contributing

## Local workflow

1. Install dependencies with `npm install`
2. Validate contracts with `clarinet check`
3. Run tests with `npm test`

## Project conventions

- Keep contract changes paired with tests
- Preserve the Clarinet-first layout and update `Clarinet.toml` when adding contracts
- Document security-sensitive behavior in `docs/threat-model.md` when it changes
- Prefer explicit allowlists and Stacks-native safety features over overly generic abstractions

## Pull requests

- Describe the user-visible or reviewer-visible effect
- Note any changes to admin flows, pause behavior, or external protocol assumptions
- Include the exact commands used for verification

