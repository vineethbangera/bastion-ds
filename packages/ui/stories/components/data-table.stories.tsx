import type { Meta, StoryObj } from "@storybook/react-vite"
import { DownloadIcon } from "lucide-react"

import { Button, DataTable, Input } from "../../src"
import { findingColumns, findings, type Finding } from "../fixtures"

const meta = {
  title: "Components/DataTable",
  component: DataTable<Finding>,
  parameters: { layout: "padded" },
  args: {
    "aria-label": "Findings",
    columns: findingColumns,
    data: findings,
    getRowId: (row) => row.id,
  },
} satisfies Meta<typeof DataTable<Finding>>

export default meta
type Story = StoryObj<typeof meta>

const toolbar = (
  <>
    <Input className="max-w-xs" placeholder="Filter findings" aria-label="Filter findings" />
    <Button variant="outline" className="ml-auto">
      <DownloadIcon data-icon="inline-start" />
      Export
    </Button>
  </>
)

const rowActions = (row: Finding) => (
  <Button variant="ghost" size="sm" aria-label={`Open ${row.id}`}>
    Open
  </Button>
)

export const Default: Story = {}
export const WithToolbar: Story = { args: { toolbar } }
export const WithRowActions: Story = { args: { rowActions } }
export const Empty: Story = { args: { data: [] } }
export const CustomEmptyState: Story = {
  args: {
    data: [],
    toolbar,
    emptyState: "No findings match this filter. Clear the filter to see all 128 findings.",
  },
}
export const AllSlots: Story = { args: { toolbar, rowActions } }
