# Changesets

Every pull request that changes a published package (`@vineethbangera/tokens` or `@vineethbangera/ui`) needs a changeset: a short Markdown file saying which packages changed, whether the change is a patch, minor or major, and one line for the changelog.

```bash
pnpm changeset
```

When the pull request merges to `main`, the Release workflow collects the changesets into a "Version Packages" pull request. Merging that publishes the new versions to GitHub Packages. See [Releasing](../README.md#releasing).
