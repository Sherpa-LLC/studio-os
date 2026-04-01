import type { SavedSegment } from "@/lib/types"

export const savedSegments: SavedSegment[] = [
  {
    id: "seg-001",
    name: "Summer Camp Alumni",
    rules: [
      { field: "tags", operator: "contains", value: "summer-camp-2025" },
      { field: "enrollmentStatus", operator: "not_equals", value: "active" },
    ],
    contactCount: 67,
    createdAt: "2026-01-10",
  },
  {
    id: "seg-002",
    name: "Competition Team Parents",
    rules: [
      { field: "tags", operator: "contains", value: "competition-team" },
      { field: "householdStatus", operator: "equals", value: "active" },
    ],
    contactCount: 42,
    createdAt: "2025-09-15",
  },
  {
    id: "seg-003",
    name: "Overdue Accounts",
    rules: [
      { field: "balance", operator: "gt", value: "0" },
      { field: "invoiceStatus", operator: "equals", value: "overdue" },
    ],
    contactCount: 8,
    createdAt: "2026-02-01",
  },
  {
    id: "seg-004",
    name: "Inactive 60+ Days",
    rules: [
      { field: "lastAttendance", operator: "lt", value: "60-days-ago" },
      { field: "enrollmentStatus", operator: "equals", value: "active" },
    ],
    contactCount: 15,
    createdAt: "2026-01-20",
  },
  {
    id: "seg-005",
    name: "New Leads This Month",
    rules: [
      { field: "type", operator: "equals", value: "lead" },
      { field: "createdAt", operator: "gte", value: "this-month" },
    ],
    contactCount: 23,
    createdAt: "2026-03-01",
  },
]
