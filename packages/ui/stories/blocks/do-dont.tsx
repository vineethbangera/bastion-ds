import type * as React from "react"
import { CheckIcon, XIcon } from "lucide-react"

// Side-by-side guidance for the Usage pages. Each panel says Do or Don't in
// words as well as colour, the same rule SeverityBadge follows.
export function DoDont({ children }: { children: React.ReactNode }) {
  // Inline margin: Storybook's docs styles reset Tailwind margins on divs.
  return (
    <div className="grid gap-4 sm:grid-cols-2" style={{ margin: "24px 0" }}>
      {children}
    </div>
  )
}

function Panel({
  kind,
  caption,
  children,
}: {
  kind: "do" | "dont"
  caption: string
  children: React.ReactNode
}) {
  const isDo = kind === "do"
  return (
    <figure className="m-0 flex flex-col overflow-hidden rounded-lg border">
      <div className="flex min-h-32 flex-1 items-center justify-center gap-2 bg-background p-6 text-foreground">
        {children}
      </div>
      <figcaption
        className="flex gap-2 border-t-2 p-3 text-sm"
        style={{ borderTopColor: isDo ? "var(--success)" : "var(--destructive)" }}
      >
        {isDo ? (
          <CheckIcon aria-hidden className="size-4 shrink-0" style={{ color: "var(--success)" }} />
        ) : (
          <XIcon aria-hidden className="size-4 shrink-0" style={{ color: "var(--destructive)" }} />
        )}
        <span>
          <strong>{isDo ? "Do" : "Don't"}</strong>: {caption}
        </span>
      </figcaption>
    </figure>
  )
}

export const Do = (props: { caption: string; children: React.ReactNode }) => (
  <Panel kind="do" {...props} />
)
export const Dont = (props: { caption: string; children: React.ReactNode }) => (
  <Panel kind="dont" {...props} />
)
