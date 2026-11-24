# AGENTS.md: Bastion design system

Bastion is the design system for Sentinel, a fictional security console. This pnpm monorepo turns Figma variables into tokens and ships React components that use them. Apps install `@vineethbangera/tokens` and `@vineethbangera/ui` from GitHub Packages.

## Repo map

| Path | What it is | Who edits it |
|---|---|---|
| `tokens/tokens.json` | Tokens Studio export of the Figma variables | Designers, via Figma. **Never edit by hand.** |
| `packages/tokens` | Style Dictionary build: CSS variables, JS, SwiftUI, Compose | Engineers |
| `packages/ui/src` | React components (cva + Tailwind 4 + Radix) | Engineers |
| `packages/ui/stories` | Storybook: stories, Usage pages (MDX), patterns, foundations | Engineers |
| `packages/ui/figma/*.figma.ts` | Code Connect templates: Figma component → Bastion snippet (`figma.config.json`) | Engineers |
| `packages/eslint-config` | Shared ESLint and Stylelint rules, incl. `bastion/no-hardcoded-colors` | Engineers |
| `.changeset/` | Pending release notes | Every PR that changes a published package |

## Rules

### 1. Use Bastion components
- Build UI from what `packages/ui/src/index.ts` exports: `Button`, `Input`, `Card*`, `Dialog*`, `DataTable`, `Table*`, `SeverityBadge`.
- Before writing a new element, check whether a component or story pattern already does it (`stories/patterns/`).
- A new component needs: the component in `src/components/`, an export in `src/index.ts`, a `.stories.tsx`, a Usage `.mdx` with do/don't examples, and a Code Connect file if it exists in Figma.
- Prop names and values match the Figma component properties (`variant`, `size`, `severity`, `disabled`). Keep them in sync.

### 2. Semantic tokens only; never hard-code values
- Colours come from semantic tokens: Tailwind utilities (`bg-primary`, `text-muted-foreground`, `border-border`, `text-destructive-text`, `bg-severity-high/10`) or `var(--token)` in CSS.
- Never use hex, `rgb()`, `hsl()`, named colours, Tailwind palette classes (`text-red-500`), or arbitrary colours (`bg-[#ff0000]`). Lint fails on all of these and names the token to use.
- Never use primitives (`colors.red.600`). Only the theme layer is published.
- Spacing, radius and type come from the Tailwind scale (`gap-2`, `rounded-lg`, `text-sm`). Use an arbitrary value like `p-[13px]` only when the Figma component specifies it, and never for a colour.
- A colour you need doesn't exist? Don't invent one. Ask for a Figma variable; it arrives through `tokens/tokens.json`. Then add it to `@theme` in `packages/ui/src/styles.css` and, for text/surface/border roles, to `CANDIDATES` in the lint rule.
- The one allowed exception is commented with `eslint-disable-next-line bastion/no-hardcoded-colors -- <reason>` (Dialog's scrim). Don't add more without a reason a reviewer would accept.

### 3. Show severity with SeverityBadge
- Any severity (critical, high, medium, low, info) is rendered with `<SeverityBadge severity="..." />`, optionally with `count`.
- Never build a coloured dot, coloured text or a custom pill for severity. Colour alone fails colour-blind analysts; the badge always has an icon shape and a label.
- `severity-*` tokens are for severity only, never decoration, status or categories.
- Sort by severity, most serious first.

### 4. Accessibility
Every story is a test: axe runs in Light and Dark, and a violation fails `pnpm test`.
- Text contrast at least 4.5:1, icons and other meaningful graphics at least 3:1, in **both** themes.
- Every input has a visible `<label>` (Bastion has no Field component yet). Placeholders are not labels.
- Errors: `aria-invalid` on the input plus a text message linked with `aria-describedby`.
- Icon-only buttons need an `aria-label` naming the action. Row actions name the row: `aria-label={\`Open ${row.id}\`}`.
- A `Dialog` always has a `DialogTitle`, and a `DialogDescription` unless the title says everything. Destructive confirms name the action on the button ("Quarantine host"), not "OK".
- Navigation is a link (`variant="link"` or `asChild` with `<a>`), not a button.
- Toggle buttons set `aria-pressed`. Groups of controls get `role="group"` and an `aria-label`.
- Tables get an `aria-label`. Decorative icons get `aria-hidden="true"`.
- Don't remove focus styles. Everything works with the keyboard alone.

## Commands

Run from the repo root. `lint`, `typecheck` and `test` build the tokens first.

```bash
pnpm install
pnpm lint          # ESLint (jsx-a11y, hooks, storybook, bastion/no-hardcoded-colors) + Stylelint
pnpm typecheck     # tsc across every package
pnpm test          # lint-rule unit tests, then every story in Light and Dark with axe (headless Chromium)
pnpm build         # tokens + ui
pnpm --filter @vineethbangera/ui storybook   # Storybook on http://localhost:6016 (also serves the MCP server at /mcp)
pnpm changeset     # add a release note
```

If Chromium is missing: `pnpm --filter @vineethbangera/ui exec playwright install chromium`.

Before saying work is done: `pnpm lint && pnpm typecheck && pnpm test` all pass. CI runs the same checks and `main` requires them.

## Pull requests and releases
- Branch from `main`; never push to `main` (it's protected and requires the CI check).
- Fill in the PR template checklist: tokens used, stories added, accessibility checked, changeset added.
- Changeset bump: **patch** for fixes, **minor** for new optional props/components/tokens or visible value changes, **major** for renaming or removing tokens, props or variants. While on 0.x, a major goes to 1.0.0.
- `packages/ui` bundles token values into its stylesheet, so a token value change needs a changeset for **both** packages.
- Chromatic flags visual changes on every PR; a human accepts them. Don't accept them for someone.

## Where the docs live
- **Storybook** (source of truth for usage): `packages/ui/stories/`. Foundations (introduction, tokens), one Usage page per component, patterns. Published on every PR by Chromatic; `main` is at https://main--6b050df4b797492233581e7b.chromatic.com
- **Releasing, installing, semver:** `README.md`.
- **Changelogs:** `packages/*/CHANGELOG.md` and GitHub releases.
- **Figma:** the Bastion Library file, https://www.figma.com/design/Sl2vd4yh378lPS6Wul4JPc/Bastion-Library (components, and the variables behind `tokens/tokens.json`).

## Tools for agents
- **Storybook MCP** (`storybook-mcp`, project scope in `.mcp.json`): component docs, props and stories from the running Storybook. Start Storybook first. Use `docs-list` / `docs-show` before writing a component usage, and `stories-preview` to check what you built.
- **Figma MCP** (`figma-desktop`): design context, variables and screenshots from the open Figma file. Needs the Figma desktop app with the desktop MCP server enabled in Dev Mode.
- **Code Connect** (`packages/ui/figma/*.figma.ts`): maps Figma component properties to Bastion props, so Dev Mode and the Figma MCP return Bastion code, not generated markup. Check with `pnpm --filter @vineethbangera/ui figma:parse`. Publishing needs the Figma library on an Organization or Enterprise plan, so it isn't published yet.

## Don't
- Edit `tokens/tokens.json`, anything in `dist/`, or `storybook-static/` by hand.
- Disable a lint rule, an axe rule or a test to get green.
- Hard-code a value "just for now".
- Write tokens, secrets or `.npmrc` auth lines into files. Tokens come from the environment.
