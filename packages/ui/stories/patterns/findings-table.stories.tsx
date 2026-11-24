import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button, DataTable, Input } from "../../src"
import { findingColumns, findings, severities, type Finding } from "../fixtures"

// DataTable, SeverityBadge, Input and Button composed into the findings list
// Sentinel shows on its overview page. Filtering and severity sorting live
// in the app, not in DataTable.
function FindingsTable({ data }: { data: Finding[] }) {
  const [query, setQuery] = React.useState("")
  const rank = (row: Finding) => severities.indexOf(row.severity)
  const visible = data
    .filter((row) =>
      `${row.id} ${row.title} ${row.host}`.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => rank(a) - rank(b))

  return (
    <DataTable
      aria-label="Findings"
      columns={findingColumns}
      data={visible}
      getRowId={(row) => row.id}
      toolbar={
        <>
          <Input
            className="max-w-xs"
            placeholder="Filter by ID, finding or host"
            aria-label="Filter findings"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Button variant="outline" className="ml-auto">
            Export CSV
          </Button>
        </>
      }
      rowActions={(row) => (
        <Button variant="ghost" size="sm" aria-label={`Open ${row.id}`}>
          Open
        </Button>
      )}
      emptyState={
        <div className="flex flex-col items-center gap-2">
          No findings match “{query}”.
          <Button variant="outline" size="sm" onClick={() => setQuery("")}>
            Clear filter
          </Button>
        </div>
      }
    />
  )
}

const meta = {
  title: "Patterns/Findings table",
  component: FindingsTable,
  tags: ["!autodocs"],
  parameters: { layout: "padded" },
  args: { data: findings },
} satisfies Meta<typeof FindingsTable>

export default meta
type Story = StoryObj<typeof meta>

export const SortedBySeverity: Story = {
  args: { data: [...findings].reverse() },
}

export const NoMatches: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByRole("textbox"), "10.9.9.9")
  },
}
