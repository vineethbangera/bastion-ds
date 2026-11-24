import * as React from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table"

type DataTableColumn<TData> = {
  id: string
  header: React.ReactNode
  cell: (row: TData) => React.ReactNode
}

type DataTableProps<TData> = Omit<React.ComponentProps<"table">, "children"> & {
  columns: DataTableColumn<TData>[]
  data: TData[]
  getRowId: (row: TData) => string
  toolbar?: React.ReactNode
  rowActions?: (row: TData) => React.ReactNode
  emptyState?: React.ReactNode
}

function DataTable<TData>({
  className,
  columns,
  data,
  getRowId,
  toolbar,
  rowActions,
  emptyState = "No results.",
  ...props
}: DataTableProps<TData>) {
  const columnCount = columns.length + (rowActions ? 1 : 0)

  return (
    <div data-slot="data-table" className="flex flex-col gap-3">
      {toolbar && (
        <div
          data-slot="data-table-toolbar"
          className="flex flex-wrap items-center gap-2"
        >
          {toolbar}
        </div>
      )}
      <div className="overflow-hidden rounded-lg border">
        <Table className={className} {...props}>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((column) => (
                <TableHead key={column.id}>{column.header}</TableHead>
              ))}
              {rowActions && (
                <TableHead className="w-0">
                  <span className="sr-only">Actions</span>
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  data-slot="data-table-empty"
                  colSpan={columnCount}
                  className="h-24 text-center whitespace-normal text-muted-foreground"
                >
                  {emptyState}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={getRowId(row)}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>{column.cell(row)}</TableCell>
                  ))}
                  {rowActions && (
                    <TableCell
                      data-slot="data-table-row-actions"
                      className="w-0 text-right"
                    >
                      {rowActions(row)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export { DataTable, type DataTableColumn, type DataTableProps }
