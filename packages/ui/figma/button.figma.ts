// url=https://www.figma.com/design/Sl2vd4yh378lPS6Wul4JPc/Bastion-Library?node-id=9892-5454
// source=packages/ui/src/components/button.tsx
// component=Button
//
// Figma property → Bastion prop
//   variant (6 values)         → variant, same names
//   size (8 values)            → size, same names
//   label                      → children
//   state=disabled             → disabled
//   state=invalid              → aria-invalid
//   showIconStart, showIconEnd → icon children, resolved from the Icon Placeholder layers
// Not mapped, because Bastion's Button has no equivalent:
//   state=hover/focus/active (interaction states, not props), state=loading (no
//   loading prop), showKbd (no Kbd component).
import figma from "figma"

const instance = figma.selectedInstance

const label = instance.getString("label")

const variant = instance.getEnum("variant", {
  default: "default",
  secondary: "secondary",
  outline: "outline",
  ghost: "ghost",
  link: "link",
  destructive: "destructive",
})

const size = instance.getEnum("size", {
  xs: "xs",
  sm: "sm",
  default: "default",
  lg: "lg",
  "icon-xs": "icon-xs",
  "icon-sm": "icon-sm",
  icon: "icon",
  "icon-lg": "icon-lg",
})

const state = instance.getEnum("state", {
  active: "enabled",
  disabled: "disabled",
  enabled: "enabled",
  focus: "enabled",
  hover: "enabled",
  invalid: "invalid",
  loading: "enabled",
})

const isIconOnly = typeof size === "string" && size.startsWith("icon")

// The start icon is the first "Icon Placeholder" layer; the end icon is a
// later one, shown only when showIconEnd is on.
const placeholders = instance.findLayers((layer) => layer.name === "Icon Placeholder")
const startLayer = instance.getBoolean("showIconStart") ? placeholders[0] : undefined
const endLayer = instance.getBoolean("showIconEnd") ? placeholders[placeholders.length - 1] : undefined
let iconStart
if (startLayer && startLayer.type === "INSTANCE") {
  iconStart = startLayer.executeTemplate().example
}
let iconEnd
if (endLayer && endLayer.type === "INSTANCE" && endLayer !== startLayer) {
  iconEnd = endLayer.executeTemplate().example
}

export default {
  example: figma.code`<Button${variant === "default" ? "" : ` variant="${variant}"`}${size === "default" ? "" : ` size="${size}"`}${state === "disabled" ? " disabled" : ""}${state === "invalid" ? " aria-invalid" : ""}${isIconOnly ? ` aria-label="${label}"` : ""}>
  ${iconStart ? figma.code`${iconStart}` : ""}${isIconOnly ? "" : label}${iconEnd ? figma.code`${iconEnd}` : ""}
</Button>`,
  imports: ['import { Button } from "@vineethbangera/ui"'],
  id: "bastion-button",
  metadata: { nestable: true },
}
