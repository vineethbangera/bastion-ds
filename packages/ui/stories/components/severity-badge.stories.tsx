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
