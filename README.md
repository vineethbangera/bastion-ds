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

Story tests run in headless Chromium. If it isn't installed: `pnpm --filter @vineethbangera/ui exec playwright install chromium`.

## Releasing

`@vineethbangera/tokens` and `@vineethbangera/ui` are published to [GitHub Packages](https://github.com/vineethbangera?tab=packages&repo_name=bastion-ds), versioned with [Changesets](https://changesets.dev). `@bastion/eslint-config` is private and never published.

1. In a pull request that changes a published package, run `pnpm changeset`. Pick the packages, pick patch, minor or major, and write one line for the changelog. Commit the file it creates in `.changeset/`.
2. When the pull request merges to `main`, the Release workflow opens a "Version Packages" pull request (or updates the open one) that bumps the versions and writes `CHANGELOG.md`.
3. Merging "Version Packages" publishes the new versions, tags them and creates a GitHub release for each.

### The release token

The Release workflow opens the Version Packages pull request with `RELEASE_TOKEN`, a fine-grained personal access token, so that CI runs on it like any other pull request. Pull requests opened with the workflow's own `GITHUB_TOKEN` don't start workflows, so they'd never get the CI check that `main` requires. Publishing still uses `GITHUB_TOKEN`, because fine-grained tokens can't publish to GitHub Packages.

To create or rotate it:

1. Go to [github.com/settings/personal-access-tokens/new](https://github.com/settings/personal-access-tokens/new).
2. **Name:** `bastion-ds release`. **Expiration:** your choice. When it expires, the Release job fails until you replace it.
3. **Repository access:** Only select repositories → `bastion-ds`.
4. **Permissions** → Repository: **Contents** Read and write, **Pull requests** Read and write. Leave everything else as No access. Metadata Read-only is added automatically.
5. Generate it, then store it without it ever appearing in your shell history:

```bash
gh secret set RELEASE_TOKEN --repo vineethbangera/bastion-ds
```

### Which bump?

Versions follow [semantic versioning](https://semver.org): `major.minor.patch`.

| Bump | When | Examples here |
|---|---|---|
| Patch | Fixes. Nothing an app uses is added, removed or renamed. | The destructive Button's text moved to `destructive-text` to pass contrast. A token's value changes for a fix, not a redesign. |
| Minor | Something new that existing code doesn't have to use. | A new optional prop on `SeverityBadge`. A new component, variant or token. |
| Major | Something existing code relies on changes or goes away. | Renaming or removing a token (`--detructive-text` → `--destructive-text`) or a prop. Removing a Button variant. Changing what `severity` accepts. |

While a package is on `0.x`, Changesets still applies these rules, but a major bump moves `0.x` to `1.0.0`.

### Installing

GitHub Packages needs a token to install, even for public packages. Create a personal access token (classic) with the `read:packages` scope, then in the app:

```ini
# .npmrc
@vineethbangera:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

```bash
pnpm add @vineethbangera/ui
```

```tsx
import "@vineethbangera/ui/styles.css" // includes the token variables
import { Button, SeverityBadge } from "@vineethbangera/ui"
```
