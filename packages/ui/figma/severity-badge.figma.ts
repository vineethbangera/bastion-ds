// url=https://www.figma.com/design/Sl2vd4yh378lPS6Wul4JPc/Bastion-Library?node-id=12725-873
// source=packages/ui/src/components/severity-badge.tsx
// component=SeverityBadge
//
// Figma property → Bastion prop
//   severity (5 values) → severity, same names
//   showCount + count   → count (a number); omitted when showCount is off
// The icon and label are fixed per severity in both Figma and code, so they
// aren't properties.
import figma from "figma"

const instance = figma.selectedInstance

const severity = instance.getEnum("severity", {
  critical: "critical",
  high: "high",
  medium: "medium",
  low: "low",
  info: "info",
})

const showCount = instance.getBoolean("showCount")
const count = instance.getString("count")
// count is a number prop; fall back to a string only if Figma holds non-digits.
const countProp = /^\d+$/.test(count) ? `count={${count}}` : `count="${count}"`

export default {
  example: figma.code`<SeverityBadge severity="${severity}"${showCount ? ` ${countProp}` : ""} />`,
  imports: ['import { SeverityBadge } from "@vineethbangera/ui"'],
  id: "bastion-severity-badge",
  metadata: { nestable: true },
}
