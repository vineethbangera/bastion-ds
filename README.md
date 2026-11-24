# Bastion

Bastion is the design system for Sentinel, a security console. This repo is a pnpm monorepo, so each part of the system lives in its own folder and can be built and versioned on its own.

## Folders

| Folder | What it's for, and why it's separate |
|---|---|
| `tokens/` | Holds the raw design token JSON synced from Figma, kept apart from code so designers' exports never get mixed up with hand-written files. |
| `packages/tokens` | Turns the raw Figma tokens into CSS variables and JS values that apps can import, separate so any app can use the tokens without pulling in components. |
| `packages/ui` | Will hold the Bastion UI components, separate so it can depend on the tokens package while the tokens stay usable on their own. |
| `packages/eslint-config` | Shares one set of lint rules across every package, separate so the rules are defined once instead of copied into each package. |

## Getting started

```bash
pnpm install
```

## Quality checks

```bash
pnpm lint       # ESLint (incl. jsx-a11y and bastion/no-hardcoded-colors) and Stylelint
pnpm typecheck  # TypeScript, including stories and config files
pnpm test       # the colour rule's tests, then every Storybook story in Light and Dark, with axe
```

CI runs all three, then builds Storybook, on every pull request (`.github/workflows/ci.yml`).

Story tests run in headless Chromium. If it isn't installed: `pnpm --filter @bastion/ui exec playwright install chromium`.
