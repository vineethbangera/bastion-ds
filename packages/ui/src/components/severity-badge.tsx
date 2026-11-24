import * as React from "react"
import { cva } from "class-variance-authority"
import {
  CircleAlertIcon,
  CircleArrowDownIcon,
  InfoIcon,
  OctagonAlertIcon,
  TriangleAlertIcon,
  type LucideIcon,
} from "lucide-react"

import { cn } from "../lib/utils"

type Severity = "critical" | "high" | "medium" | "low" | "info"

// Each level has its own icon shape and label, so severity still reads
// without colour (colour-blind users, greyscale screenshots, printouts).
const severityContent: Record<Severity, { icon: LucideIcon; label: string }> = {
  critical: { icon: OctagonAlertIcon, label: "Critical" },
  high: { icon: TriangleAlertIcon, label: "High" },
  medium: { icon: CircleAlertIcon, label: "Medium" },
  low: { icon: CircleArrowDownIcon, label: "Low" },
  info: { icon: InfoIcon, label: "Info" },
}

const severityBadgeVariants = cva(
  "inline-flex h-5 w-fit shrink-0 items-center gap-1 rounded-4xl border px-2 py-0.5 text-xs font-medium whitespace-nowrap text-foreground [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      severity: {
        critical:
          "border-severity-critical/30 bg-severity-critical/10 [&>svg]:text-severity-critical",
        high: "border-severity-high/30 bg-severity-high/10 [&>svg]:text-severity-high",
        medium:
          "border-severity-medium/30 bg-severity-medium/10 [&>svg]:text-severity-medium",
        low: "border-severity-low/30 bg-severity-low/10 [&>svg]:text-severity-low",
        info: "border-severity-info/30 bg-severity-info/10 [&>svg]:text-severity-info",
      },
    },
  }
)

function SeverityBadge({
  className,
  severity,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & { severity: Severity }) {
  const { icon: Icon, label } = severityContent[severity]

  return (
    <span
      data-slot="severity-badge"
      data-severity={severity}
      className={cn(severityBadgeVariants({ severity }), className)}
      {...props}
    >
      <Icon aria-hidden="true" />
      {label}
    </span>
  )
}

export { SeverityBadge, severityBadgeVariants, type Severity }
