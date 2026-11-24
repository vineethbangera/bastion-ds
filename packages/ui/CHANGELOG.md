# @vineethbangera/ui

## 0.3.0

### Minor Changes

- [#10](https://github.com/vineethbangera/bastion-ds/pull/10) [`b8b1d14`](https://github.com/vineethbangera/bastion-ds/commit/b8b1d14c3420a4f9cecdea3f3aaeb9179064b815) Thanks [@vineethbangera](https://github.com/vineethbangera)! - Severity colours now run red, orange, yellow, green, blue in both themes. `severity-medium` was a near-invisible grey and is now yellow (Light `#a65f00`, Dark `#ffdf20`). `severity-high` moves from amber to orange (Light `#f54900`, Dark `#ff8904`) so it stays distinct from medium. In Light, `severity-low` darkens to `#008236`, so its icon passes 3:1 contrast. No tokens were renamed or removed. `@vineethbangera/ui` is released too because its stylesheet includes the token values.

## 0.2.0

### Minor Changes

- [#6](https://github.com/vineethbangera/bastion-ds/pull/6) [`0130911`](https://github.com/vineethbangera/bastion-ds/commit/01309111a91964f53efb946a370e2017fb07c27b) Thanks [@vineethbangera](https://github.com/vineethbangera)! - `SeverityBadge` takes an optional `count` prop that shows how many findings have that severity, for summaries such as "Critical 3". Existing badges are unchanged.
