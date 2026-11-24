import { SeverityBadge, type DataTableColumn, type Severity } from "../src"

export type Finding = {
  id: string
  title: string
  host: string
  severity: Severity
}

export const findings: Finding[] = [
  { id: "F-101", title: "Exposed admin panel", host: "10.0.4.12", severity: "critical" },
  { id: "F-102", title: "Outdated OpenSSL", host: "10.0.4.18", severity: "high" },
  { id: "F-103", title: "Weak TLS cipher suite", host: "10.0.7.2", severity: "medium" },
  { id: "F-104", title: "Verbose server banner", host: "10.0.7.9", severity: "low" },
  { id: "F-105", title: "New device on network", host: "10.0.9.1", severity: "info" },
]

export const findingColumns: DataTableColumn<Finding>[] = [
  { id: "id", header: "ID", cell: (row) => row.id },
  { id: "title", header: "Finding", cell: (row) => row.title },
  { id: "host", header: "Host", cell: (row) => row.host },
  {
    id: "severity",
    header: "Severity",
    cell: (row) => <SeverityBadge severity={row.severity} />,
  },
]

export const severities: Severity[] = ["critical", "high", "medium", "low", "info"]
