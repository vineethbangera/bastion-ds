import type { Meta, StoryObj } from "@storybook/react-vite"

import { SeverityBadge } from "../../src"
import { severities } from "../fixtures"

const meta = {
  title: "Components/SeverityBadge",
  component: SeverityBadge,
  args: { severity: "critical" },
} satisfies Meta<typeof SeverityBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Critical: Story = {}
export const High: Story = { args: { severity: "high" } }
export const Medium: Story = { args: { severity: "medium" } }
export const Low: Story = { args: { severity: "low" } }
export const Info: Story = { args: { severity: "info" } }

export const AllSeverities: Story = {
  render: () => (
    <div className="flex gap-2">
      {severities.map((severity) => (
        <SeverityBadge key={severity} severity={severity} />
      ))}
    </div>
  ),
}

export const WithCount: Story = { args: { severity: "critical", count: 3 } }

// A findings summary: one badge per level, with how many of each.
export const Summary: Story = {
  render: () => (
    <div className="flex gap-2">
      <SeverityBadge severity="critical" count={3} />
      <SeverityBadge severity="high" count={12} />
      <SeverityBadge severity="medium" count={27} />
      <SeverityBadge severity="low" count={41} />
      <SeverityBadge severity="info" count={8} />
    </div>
  ),
}
