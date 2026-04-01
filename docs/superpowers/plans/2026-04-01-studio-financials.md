# Studio Financials Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Finance → Studio Financials page with four tabs (Overview, Revenue, Expenses, Class Analysis) that replaces the flat $231/class overhead with real itemized expenses and owner-chosen allocation methods.

**Architecture:** New data files define expense/revenue categories with 12 months of mock data. A new allocation engine computes per-class overhead from real expenses using the owner's chosen method (equal/hours/revenue/custom). The page is a single route with tab-based sub-navigation, following the existing Dashboard page pattern.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, recharts, shadcn/ui components, TypeScript strict mode.

**Spec:** `docs/superpowers/specs/2026-04-01-studio-financials-design.md`

---

## File Map

### New Files

| File | Responsibility |
|------|---------------|
| `src/lib/types.ts` (modify) | Add `FinancialCategory`, `FinancialLineItem`, `MonthlyFinancialEntry`, `AllocationMethod`, `StudioFinancialSettings` types |
| `src/data/studio-expenses.ts` | Expense categories, line items, 12 months of mock monthly entries |
| `src/data/studio-revenue.ts` | Revenue categories, line items, 12 months of mock monthly entries |
| `src/data/studio-financial-settings.ts` | Default allocation settings |
| `src/data/class-profitability.ts` (modify) | Replace hardcoded overhead with allocation engine |
| `src/components/layout/app-sidebar.tsx` (modify) | Add "Studio Financials" nav item under Finance |
| `src/app/(admin)/studio-financials/page.tsx` | Main page with tab shell and Overview tab |
| `src/components/studio-financials/revenue-tab.tsx` | Revenue category management tab |
| `src/components/studio-financials/expenses-tab.tsx` | Expense category management tab |
| `src/components/studio-financials/class-analysis-tab.tsx` | Class profitability table with allocation toggle |

---

### Task 1: Add New Types to types.ts

**Files:**
- Modify: `src/lib/types.ts:609` (after ClassFinancials interface)

- [ ] **Step 1: Add financial types after the ClassFinancials interface**

Append after line 609 in `src/lib/types.ts`:

```typescript
// ── Studio Financials ───────────────────────────────────────────────────────

export interface FinancialCategory {
  id: string
  name: string
  type: "expense" | "revenue"
  sortOrder: number
}

export interface FinancialLineItem {
  id: string
  categoryId: string
  name: string
  defaultMonthlyAmount: number
  isAutoCalculated?: boolean
}

export interface MonthlyFinancialEntry {
  lineItemId: string
  month: string // "2026-01" format
  amount: number
}

export type AllocationMethod = "equal" | "hours" | "revenue" | "custom"

export interface StudioFinancialSettings {
  allocationMethod: AllocationMethod
  customWeights?: Record<string, number> // classId → weight percentage
}
```

- [ ] **Step 2: Verify the build passes**

Run: `cd /Users/dylanwilcox/Projects/studio-os && npx next build --no-lint 2>&1 | tail -5`
Expected: Build succeeds (or `next dev` already running shows no type errors)

- [ ] **Step 3: Commit**

```bash
git add src/lib/types.ts
git commit -m "feat(financials): add types for studio financial categories, line items, and allocation settings"
```

---

### Task 2: Create Expense Data

**Files:**
- Create: `src/data/studio-expenses.ts`

- [ ] **Step 1: Create studio-expenses.ts with categories, line items, and 12 months of mock data**

Create `src/data/studio-expenses.ts`:

```typescript
import type { FinancialCategory, FinancialLineItem, MonthlyFinancialEntry } from "@/lib/types"

// ── Categories ──────────────────────────────────────────────────────────────

export const expenseCategories: FinancialCategory[] = [
  { id: "exp-cat-facility", name: "Facility", type: "expense", sortOrder: 1 },
  { id: "exp-cat-utilities", name: "Utilities", type: "expense", sortOrder: 2 },
  { id: "exp-cat-insurance", name: "Insurance", type: "expense", sortOrder: 3 },
  { id: "exp-cat-admin", name: "Administrative", type: "expense", sortOrder: 4 },
  { id: "exp-cat-marketing", name: "Marketing", type: "expense", sortOrder: 5 },
]

// ── Line Items ──────────────────────────────────────────────────────────────

export const expenseLineItems: FinancialLineItem[] = [
  // Facility
  { id: "exp-rent", categoryId: "exp-cat-facility", name: "Rent / Mortgage", defaultMonthlyAmount: 4500 },
  { id: "exp-property-tax", categoryId: "exp-cat-facility", name: "Property Tax", defaultMonthlyAmount: 380 },
  { id: "exp-maintenance", categoryId: "exp-cat-facility", name: "Maintenance & Repairs", defaultMonthlyAmount: 250 },
  // Utilities
  { id: "exp-electric", categoryId: "exp-cat-utilities", name: "Electric", defaultMonthlyAmount: 420 },
  { id: "exp-water", categoryId: "exp-cat-utilities", name: "Water", defaultMonthlyAmount: 85 },
  { id: "exp-gas", categoryId: "exp-cat-utilities", name: "Gas", defaultMonthlyAmount: 150 },
  { id: "exp-internet", categoryId: "exp-cat-utilities", name: "Internet / Phone", defaultMonthlyAmount: 165 },
  // Insurance
  { id: "exp-property-ins", categoryId: "exp-cat-insurance", name: "Property Insurance", defaultMonthlyAmount: 450 },
  { id: "exp-liability-ins", categoryId: "exp-cat-insurance", name: "Liability Insurance", defaultMonthlyAmount: 350 },
  { id: "exp-workers-comp", categoryId: "exp-cat-insurance", name: "Workers' Compensation", defaultMonthlyAmount: 400 },
  // Administrative
  { id: "exp-accounting", categoryId: "exp-cat-admin", name: "Accounting / Bookkeeping", defaultMonthlyAmount: 300 },
  { id: "exp-software", categoryId: "exp-cat-admin", name: "Software Subscriptions", defaultMonthlyAmount: 280 },
  { id: "exp-music", categoryId: "exp-cat-admin", name: "Music Licensing", defaultMonthlyAmount: 50 },
  { id: "exp-cleaning", categoryId: "exp-cat-admin", name: "Cleaning Service", defaultMonthlyAmount: 600 },
  // Marketing
  { id: "exp-advertising", categoryId: "exp-cat-marketing", name: "Advertising", defaultMonthlyAmount: 500 },
  { id: "exp-website", categoryId: "exp-cat-marketing", name: "Website Hosting", defaultMonthlyAmount: 30 },
]

// ── Monthly Entries (Apr 2025 – Mar 2026) ───────────────────────────────────

const MONTHS = [
  "2025-04", "2025-05", "2025-06", "2025-07", "2025-08", "2025-09",
  "2025-10", "2025-11", "2025-12", "2026-01", "2026-02", "2026-03",
]

// Seasonal multipliers: higher utilities in winter, lower in summer
const SEASONAL_MULTIPLIER: Record<string, Record<string, number>> = {
  "exp-electric": {
    "2025-04": 0.9, "2025-05": 0.85, "2025-06": 1.1, "2025-07": 1.15,
    "2025-08": 1.1, "2025-09": 0.95, "2025-10": 0.9, "2025-11": 1.0,
    "2025-12": 1.15, "2026-01": 1.2, "2026-02": 1.15, "2026-03": 1.0,
  },
  "exp-gas": {
    "2025-04": 0.7, "2025-05": 0.5, "2025-06": 0.3, "2025-07": 0.3,
    "2025-08": 0.3, "2025-09": 0.5, "2025-10": 0.8, "2025-11": 1.1,
    "2025-12": 1.4, "2026-01": 1.5, "2026-02": 1.4, "2026-03": 1.1,
  },
  "exp-water": {
    "2025-04": 0.9, "2025-05": 0.95, "2025-06": 0.8, "2025-07": 0.75,
    "2025-08": 0.85, "2025-09": 1.0, "2025-10": 1.0, "2025-11": 1.0,
    "2025-12": 0.9, "2026-01": 1.0, "2026-02": 1.0, "2026-03": 1.05,
  },
  "exp-maintenance": {
    "2025-04": 1.3, "2025-05": 1.0, "2025-06": 0.8, "2025-07": 0.6,
    "2025-08": 1.5, "2025-09": 1.0, "2025-10": 0.8, "2025-11": 0.7,
    "2025-12": 0.5, "2026-01": 0.6, "2026-02": 0.8, "2026-03": 1.2,
  },
}

function generateMonthlyEntries(): MonthlyFinancialEntry[] {
  const entries: MonthlyFinancialEntry[] = []
  for (const item of expenseLineItems) {
    for (const month of MONTHS) {
      const multiplier = SEASONAL_MULTIPLIER[item.id]?.[month] ?? 1.0
      entries.push({
        lineItemId: item.id,
        month,
        amount: Math.round(item.defaultMonthlyAmount * multiplier),
      })
    }
  }
  return entries
}

export const expenseEntries: MonthlyFinancialEntry[] = generateMonthlyEntries()

// ── Helpers ─────────────────────────────────────────────────────────────────

export function getExpenseTotalForMonth(month: string): number {
  return expenseEntries
    .filter((e) => e.month === month)
    .reduce((sum, e) => sum + e.amount, 0)
}

export function getExpensesByCategory(month: string): { category: FinancialCategory; items: { item: FinancialLineItem; amount: number }[] }[] {
  return expenseCategories
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((cat) => {
      const catItems = expenseLineItems.filter((li) => li.categoryId === cat.id)
      return {
        category: cat,
        items: catItems.map((item) => {
          const entry = expenseEntries.find((e) => e.lineItemId === item.id && e.month === month)
          return { item, amount: entry?.amount ?? item.defaultMonthlyAmount }
        }),
      }
    })
}
```

- [ ] **Step 2: Verify build**

Run: `cd /Users/dylanwilcox/Projects/studio-os && npx tsc --noEmit 2>&1 | tail -5`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add src/data/studio-expenses.ts
git commit -m "feat(financials): add expense categories, line items, and 12 months of mock data with seasonal variation"
```

---

### Task 3: Create Revenue Data

**Files:**
- Create: `src/data/studio-revenue.ts`

- [ ] **Step 1: Create studio-revenue.ts with categories, line items, and 12 months of mock data**

Create `src/data/studio-revenue.ts`:

```typescript
import type { FinancialCategory, FinancialLineItem, MonthlyFinancialEntry } from "@/lib/types"
import { classFinancials } from "./class-profitability"

// ── Categories ──────────────────────────────────────────────────────────────

export const revenueCategories: FinancialCategory[] = [
  { id: "rev-cat-tuition", name: "Tuition", type: "revenue", sortOrder: 1 },
  { id: "rev-cat-fees", name: "Fees", type: "revenue", sortOrder: 2 },
  { id: "rev-cat-services", name: "Services", type: "revenue", sortOrder: 3 },
  { id: "rev-cat-merchandise", name: "Merchandise", type: "revenue", sortOrder: 4 },
]

// ── Line Items ──────────────────────────────────────────────────────────────

// Tuition is auto-calculated from class data
const tuitionMonthly = classFinancials.reduce((sum, f) => sum + f.monthlyRevenue, 0)

export const revenueLineItems: FinancialLineItem[] = [
  // Tuition (auto-calculated)
  { id: "rev-tuition", categoryId: "rev-cat-tuition", name: "Tuition", defaultMonthlyAmount: tuitionMonthly, isAutoCalculated: true },
  // Fees
  { id: "rev-registration", categoryId: "rev-cat-fees", name: "Registration Fees", defaultMonthlyAmount: 1800 },
  { id: "rev-costume", categoryId: "rev-cat-fees", name: "Costume Fees", defaultMonthlyAmount: 800 },
  { id: "rev-competition-entry", categoryId: "rev-cat-fees", name: "Competition Entry Fees", defaultMonthlyAmount: 600 },
  // Services
  { id: "rev-private-lessons", categoryId: "rev-cat-services", name: "Private Lessons", defaultMonthlyAmount: 960 },
  { id: "rev-studio-rental", categoryId: "rev-cat-services", name: "Studio Rental Income", defaultMonthlyAmount: 400 },
  // Merchandise
  { id: "rev-merchandise", categoryId: "rev-cat-merchandise", name: "Merchandise Sales", defaultMonthlyAmount: 350 },
]

// ── Monthly Entries (Apr 2025 – Mar 2026) ───────────────────────────────────

const MONTHS = [
  "2025-04", "2025-05", "2025-06", "2025-07", "2025-08", "2025-09",
  "2025-10", "2025-11", "2025-12", "2026-01", "2026-02", "2026-03",
]

// Seasonal patterns for revenue
const REVENUE_SEASONAL: Record<string, Record<string, number>> = {
  "rev-tuition": {
    "2025-04": 1.0, "2025-05": 1.0, "2025-06": 0.6, "2025-07": 0.5,
    "2025-08": 0.7, "2025-09": 1.1, "2025-10": 1.05, "2025-11": 1.0,
    "2025-12": 0.8, "2026-01": 1.0, "2026-02": 1.0, "2026-03": 1.0,
  },
  "rev-registration": {
    "2025-04": 0.3, "2025-05": 0.2, "2025-06": 0.5, "2025-07": 1.0,
    "2025-08": 3.0, "2025-09": 2.5, "2025-10": 0.5, "2025-11": 0.3,
    "2025-12": 0.2, "2026-01": 1.5, "2026-02": 0.4, "2026-03": 0.3,
  },
  "rev-costume": {
    "2025-04": 0.3, "2025-05": 0.2, "2025-06": 0.1, "2025-07": 0.1,
    "2025-08": 0.5, "2025-09": 2.0, "2025-10": 3.0, "2025-11": 1.5,
    "2025-12": 0.5, "2026-01": 0.3, "2026-02": 1.0, "2026-03": 2.5,
  },
  "rev-competition-entry": {
    "2025-04": 1.5, "2025-05": 0.5, "2025-06": 0.0, "2025-07": 0.0,
    "2025-08": 0.3, "2025-09": 0.5, "2025-10": 1.0, "2025-11": 1.5,
    "2025-12": 0.8, "2026-01": 1.5, "2026-02": 2.0, "2026-03": 2.5,
  },
  "rev-private-lessons": {
    "2025-04": 1.0, "2025-05": 1.0, "2025-06": 0.7, "2025-07": 0.5,
    "2025-08": 0.8, "2025-09": 1.1, "2025-10": 1.0, "2025-11": 1.0,
    "2025-12": 0.8, "2026-01": 1.0, "2026-02": 1.1, "2026-03": 1.1,
  },
  "rev-merchandise": {
    "2025-04": 0.8, "2025-05": 0.5, "2025-06": 0.3, "2025-07": 0.3,
    "2025-08": 1.5, "2025-09": 2.0, "2025-10": 1.0, "2025-11": 0.8,
    "2025-12": 1.5, "2026-01": 0.6, "2026-02": 0.8, "2026-03": 1.0,
  },
}

function generateMonthlyEntries(): MonthlyFinancialEntry[] {
  const entries: MonthlyFinancialEntry[] = []
  for (const item of revenueLineItems) {
    for (const month of MONTHS) {
      const multiplier = REVENUE_SEASONAL[item.id]?.[month] ?? 1.0
      entries.push({
        lineItemId: item.id,
        month,
        amount: Math.round(item.defaultMonthlyAmount * multiplier),
      })
    }
  }
  return entries
}

export const revenueEntries: MonthlyFinancialEntry[] = generateMonthlyEntries()

// ── Helpers ─────────────────────────────────────────────────────────────────

export function getRevenueTotalForMonth(month: string): number {
  return revenueEntries
    .filter((e) => e.month === month)
    .reduce((sum, e) => sum + e.amount, 0)
}

export function getRevenueByCategory(month: string): { category: FinancialCategory; items: { item: FinancialLineItem; amount: number }[] }[] {
  return revenueCategories
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((cat) => {
      const catItems = revenueLineItems.filter((li) => li.categoryId === cat.id)
      return {
        category: cat,
        items: catItems.map((item) => {
          const entry = revenueEntries.find((e) => e.lineItemId === item.id && e.month === month)
          return { item, amount: entry?.amount ?? item.defaultMonthlyAmount }
        }),
      }
    })
}
```

- [ ] **Step 2: Verify build**

Run: `cd /Users/dylanwilcox/Projects/studio-os && npx tsc --noEmit 2>&1 | tail -5`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add src/data/studio-revenue.ts
git commit -m "feat(financials): add revenue categories, line items, and 12 months of mock data with seasonal variation"
```

---

### Task 4: Create Financial Settings and Allocation Engine

**Files:**
- Create: `src/data/studio-financial-settings.ts`
- Modify: `src/data/class-profitability.ts`

- [ ] **Step 1: Create studio-financial-settings.ts**

Create `src/data/studio-financial-settings.ts`:

```typescript
import type { AllocationMethod, StudioFinancialSettings } from "@/lib/types"
import type { ClassFinancials } from "@/lib/types"
import { getExpenseTotalForMonth } from "./studio-expenses"

export const defaultSettings: StudioFinancialSettings = {
  allocationMethod: "hours",
}

/**
 * Calculate per-class overhead allocation based on the chosen method.
 * Returns a map of classId → allocated overhead amount for the given month.
 */
export function allocateOverhead(
  classes: ClassFinancials[],
  month: string,
  method: AllocationMethod,
  customWeights?: Record<string, number>,
): Record<string, number> {
  const totalOverhead = getExpenseTotalForMonth(month)
  const allocation: Record<string, number> = {}

  switch (method) {
    case "equal": {
      const perClass = totalOverhead / classes.length
      for (const c of classes) {
        allocation[c.classId] = Math.round(perClass)
      }
      break
    }
    case "hours": {
      const totalHours = classes.reduce((sum, c) => sum + c.hoursPerWeek, 0)
      for (const c of classes) {
        allocation[c.classId] = Math.round((c.hoursPerWeek / totalHours) * totalOverhead)
      }
      break
    }
    case "revenue": {
      const totalRevenue = classes.reduce((sum, c) => sum + c.monthlyRevenue, 0)
      for (const c of classes) {
        allocation[c.classId] = Math.round((c.monthlyRevenue / totalRevenue) * totalOverhead)
      }
      break
    }
    case "custom": {
      if (!customWeights) {
        // Fall back to equal if no weights provided
        const perClass = totalOverhead / classes.length
        for (const c of classes) {
          allocation[c.classId] = Math.round(perClass)
        }
      } else {
        const totalWeight = Object.values(customWeights).reduce((sum, w) => sum + w, 0)
        for (const c of classes) {
          const weight = customWeights[c.classId] ?? 0
          allocation[c.classId] = Math.round((weight / totalWeight) * totalOverhead)
        }
      }
      break
    }
  }

  return allocation
}

/**
 * Recompute ClassFinancials entries with real overhead from the allocation engine.
 */
export function computeClassFinancialsWithRealOverhead(
  classes: ClassFinancials[],
  month: string,
  method: AllocationMethod,
  customWeights?: Record<string, number>,
): ClassFinancials[] {
  const overheadMap = allocateOverhead(classes, month, method, customWeights)

  return classes.map((c) => {
    const overhead = overheadMap[c.classId] ?? 0
    const margin = c.monthlyRevenue - c.monthlyInstructorCost - overhead
    const marginPct = c.monthlyRevenue > 0 ? (margin / c.monthlyRevenue) * 100 : 0
    const breakeven = c.monthlyRate > 0 ? Math.ceil((c.monthlyInstructorCost + overhead) / c.monthlyRate) : 0

    return {
      ...c,
      monthlyOverhead: overhead,
      monthlyMargin: margin,
      marginPercent: marginPct,
      breakeven,
    }
  })
}
```

- [ ] **Step 2: Export the overhead constant from class-profitability.ts**

In `src/data/class-profitability.ts`, change line 4 from:

```typescript
const MONTHLY_OVERHEAD_PER_CLASS = 231
```

to:

```typescript
export const MONTHLY_OVERHEAD_PER_CLASS = 231
```

This allows the allocation engine to reference the old default, and keeps backward compatibility for existing consumers.

- [ ] **Step 3: Verify build**

Run: `cd /Users/dylanwilcox/Projects/studio-os && npx tsc --noEmit 2>&1 | tail -5`
Expected: No type errors

- [ ] **Step 4: Commit**

```bash
git add src/data/studio-financial-settings.ts src/data/class-profitability.ts
git commit -m "feat(financials): add allocation engine with equal/hours/revenue/custom methods and real overhead computation"
```

---

### Task 5: Add Studio Financials to Sidebar Navigation

**Files:**
- Modify: `src/components/layout/app-sidebar.tsx:113-123`

- [ ] **Step 1: Add the nav item**

In `src/components/layout/app-sidebar.tsx`, find the Finance section (lines 113-123):

```typescript
  {
    label: "Finance",
    items: [
      {
        title: "Billing",
        href: "/billing",
        icon: CreditCard,
        roles: ["admin"],
      },
    ],
  },
```

Replace with:

```typescript
  {
    label: "Finance",
    items: [
      {
        title: "Billing",
        href: "/billing",
        icon: CreditCard,
        roles: ["admin"],
      },
      {
        title: "Studio Financials",
        href: "/studio-financials",
        icon: TrendingUp,
        roles: ["admin"],
      },
    ],
  },
```

Note: `TrendingUp` is already imported at line 14.

- [ ] **Step 2: Verify the sidebar renders**

Run the dev server if not already running: `cd /Users/dylanwilcox/Projects/studio-os && npm run dev`

Navigate to `http://localhost:3000/dashboard` and verify "Studio Financials" appears under Finance in the sidebar. The link will 404 since the page doesn't exist yet — that's expected.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/app-sidebar.tsx
git commit -m "feat(financials): add Studio Financials link to sidebar navigation under Finance"
```

---

### Task 6: Create Main Page Shell with Overview Tab

**Files:**
- Create: `src/app/(admin)/studio-financials/page.tsx`

- [ ] **Step 1: Create the page with tab shell and Overview tab content**

Create `src/app/(admin)/studio-financials/page.tsx`:

```typescript
"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/dashboard/stat-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingDown, AlertTriangle, Percent } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts"
import { formatCurrency } from "@/lib/format"
import { classFinancials } from "@/data/class-profitability"
import { getExpenseTotalForMonth, getExpensesByCategory } from "@/data/studio-expenses"
import { getRevenueTotalForMonth, getRevenueByCategory } from "@/data/studio-revenue"
import { computeClassFinancialsWithRealOverhead, defaultSettings } from "@/data/studio-financial-settings"
import { RevenueTab } from "@/components/studio-financials/revenue-tab"
import { ExpensesTab } from "@/components/studio-financials/expenses-tab"
import { ClassAnalysisTab } from "@/components/studio-financials/class-analysis-tab"
import type { AllocationMethod } from "@/lib/types"

const MONTHS = [
  "2025-04", "2025-05", "2025-06", "2025-07", "2025-08", "2025-09",
  "2025-10", "2025-11", "2025-12", "2026-01", "2026-02", "2026-03",
]

const MONTH_LABELS: Record<string, string> = {
  "2025-04": "Apr", "2025-05": "May", "2025-06": "Jun", "2025-07": "Jul",
  "2025-08": "Aug", "2025-09": "Sep", "2025-10": "Oct", "2025-11": "Nov",
  "2025-12": "Dec", "2026-01": "Jan", "2026-02": "Feb", "2026-03": "Mar",
}

type DateRange = "12" | "6" | "custom"

export default function StudioFinancialsPage() {
  const [dateRange, setDateRange] = useState<DateRange>("12")
  const [allocationMethod, setAllocationMethod] = useState<AllocationMethod>(defaultSettings.allocationMethod)

  const visibleMonths = dateRange === "6" ? MONTHS.slice(6) : MONTHS
  const currentMonth = "2026-03"

  // Monthly P&L chart data
  const chartData = visibleMonths.map((month) => ({
    month: MONTH_LABELS[month],
    revenue: getRevenueTotalForMonth(month),
    expenses: getExpenseTotalForMonth(month) + classFinancials.reduce((sum, f) => sum + f.monthlyInstructorCost, 0),
  }))

  // KPI calculations for selected range
  const totalRevenue = visibleMonths.reduce((sum, m) => sum + getRevenueTotalForMonth(m), 0)
  const totalInstructorPay = classFinancials.reduce((sum, f) => sum + f.monthlyInstructorCost, 0) * visibleMonths.length
  const totalExpenses = visibleMonths.reduce((sum, m) => sum + getExpenseTotalForMonth(m), 0) + totalInstructorPay
  const netMargin = totalRevenue - totalExpenses
  const marginPercent = totalRevenue > 0 ? (netMargin / totalRevenue) * 100 : 0

  // Recompute class financials with real overhead
  const adjustedFinancials = useMemo(
    () => computeClassFinancialsWithRealOverhead(classFinancials, currentMonth, allocationMethod),
    [allocationMethod],
  )
  const belowBreakeven = adjustedFinancials.filter((f) => f.monthlyMargin < 0).length

  // Current month breakdowns
  const currentRevenueByCategory = getRevenueByCategory(currentMonth)
  const currentExpensesByCategory = getExpensesByCategory(currentMonth)
  const currentMonthRevenue = getRevenueTotalForMonth(currentMonth)
  const currentMonthExpenses = getExpenseTotalForMonth(currentMonth)

  return (
    <>
      <Header title="Studio Financials" />
      <div className="flex-1 p-6 space-y-6">
        <PageHeader
          title="Studio Financials"
          description="Complete financial picture for Premiere Dance Studio"
        />

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="class-analysis">Class Analysis</TabsTrigger>
          </TabsList>

          {/* ── Overview Tab ──────────────────────────────────────────────── */}
          <TabsContent value="overview" className="space-y-6 mt-4">
            {/* Date range controls */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing: <span className="font-medium text-foreground">{dateRange === "6" ? "Oct 2025" : "Apr 2025"} — Mar 2026</span>
              </p>
              <div className="flex gap-1">
                <Button
                  variant={dateRange === "12" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDateRange("12")}
                >
                  12 Months
                </Button>
                <Button
                  variant={dateRange === "6" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDateRange("6")}
                >
                  6 Months
                </Button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Revenue"
                value={formatCurrency(totalRevenue)}
                trend={8.2}
                trendLabel="vs prior period"
                icon={DollarSign}
              />
              <StatCard
                title="Total Expenses"
                value={formatCurrency(totalExpenses)}
                trend={3.1}
                trendLabel="vs prior period"
                icon={TrendingDown}
                invertTrend
              />
              <StatCard
                title="Net Margin"
                value={formatCurrency(netMargin)}
                subtitle={`${marginPercent.toFixed(1)}% margin`}
                trend={12.4}
                trendLabel="vs prior period"
                icon={Percent}
              />
              <StatCard
                title="Classes Below Breakeven"
                value={belowBreakeven.toString()}
                subtitle={`of ${adjustedFinancials.length} active classes`}
                trend={-1}
                trendLabel="vs prior period"
                icon={AlertTriangle}
                invertTrend
              />
            </div>

            {/* Monthly P&L Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Monthly P&L</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ left: 10, right: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" fontSize={12} />
                      <YAxis fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{ fontSize: 12 }}
                      />
                      <Legend />
                      <Bar dataKey="revenue" name="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} opacity={0.7} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Revenue & Expense Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Revenue Breakdown (Mar 2026)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentRevenueByCategory.flatMap(({ items }) =>
                      items.map(({ item, amount }) => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{item.name}</span>
                          <span className="font-medium">{formatCurrency(amount)}</span>
                        </div>
                      ))
                    )}
                    <div className="border-t pt-3 flex items-center justify-between text-sm font-bold">
                      <span>Total</span>
                      <span className="text-emerald-600">{formatCurrency(currentMonthRevenue)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Expense Breakdown (Mar 2026)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentExpensesByCategory.map(({ category, items }) => {
                      const catTotal = items.reduce((sum, { amount }) => sum + amount, 0)
                      return (
                        <div key={category.id} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{category.name}</span>
                          <span className="font-medium">{formatCurrency(catTotal)}</span>
                        </div>
                      )
                    })}
                    <div className="border-t pt-3 flex items-center justify-between text-sm font-bold">
                      <span>Total</span>
                      <span className="text-red-600">{formatCurrency(currentMonthExpenses)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── Revenue Tab ───────────────────────────────────────────────── */}
          <TabsContent value="revenue" className="mt-4">
            <RevenueTab currentMonth={currentMonth} />
          </TabsContent>

          {/* ── Expenses Tab ──────────────────────────────────────────────── */}
          <TabsContent value="expenses" className="mt-4">
            <ExpensesTab currentMonth={currentMonth} />
          </TabsContent>

          {/* ── Class Analysis Tab ────────────────────────────────────────── */}
          <TabsContent value="class-analysis" className="mt-4">
            <ClassAnalysisTab
              allocationMethod={allocationMethod}
              onAllocationMethodChange={setAllocationMethod}
              currentMonth={currentMonth}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Create placeholder components so the page compiles**

Create `src/components/studio-financials/revenue-tab.tsx`:

```typescript
"use client"

export function RevenueTab({ currentMonth }: { currentMonth: string }) {
  return <div className="text-sm text-muted-foreground">Revenue tab — coming in next task</div>
}
```

Create `src/components/studio-financials/expenses-tab.tsx`:

```typescript
"use client"

export function ExpensesTab({ currentMonth }: { currentMonth: string }) {
  return <div className="text-sm text-muted-foreground">Expenses tab — coming in next task</div>
}
```

Create `src/components/studio-financials/class-analysis-tab.tsx`:

```typescript
"use client"

import type { AllocationMethod } from "@/lib/types"

interface ClassAnalysisTabProps {
  allocationMethod: AllocationMethod
  onAllocationMethodChange: (method: AllocationMethod) => void
  currentMonth: string
}

export function ClassAnalysisTab({ allocationMethod, onAllocationMethodChange, currentMonth }: ClassAnalysisTabProps) {
  return <div className="text-sm text-muted-foreground">Class Analysis tab — coming in next task</div>
}
```

- [ ] **Step 3: Verify the page renders**

Navigate to `http://localhost:3000/studio-financials`. Verify:
- Page loads with header "Studio Financials"
- Four tabs visible: Overview, Revenue, Expenses, Class Analysis
- Overview tab shows KPI cards, monthly P&L chart, and revenue/expense breakdowns
- Date range toggle switches between 12 and 6 months

- [ ] **Step 4: Commit**

```bash
git add src/app/\(admin\)/studio-financials/page.tsx src/components/studio-financials/
git commit -m "feat(financials): add Studio Financials page with tab shell and Overview tab"
```

---

### Task 7: Build Expenses Tab

**Files:**
- Modify: `src/components/studio-financials/expenses-tab.tsx` (replace placeholder)

- [ ] **Step 1: Implement the full Expenses tab**

Replace `src/components/studio-financials/expenses-tab.tsx` with:

```typescript
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { formatCurrency } from "@/lib/format"
import { expenseCategories, expenseLineItems, getExpensesByCategory, getExpenseTotalForMonth } from "@/data/studio-expenses"
import { classFinancials } from "@/data/class-profitability"

interface ExpensesTabProps {
  currentMonth: string
}

export function ExpensesTab({ currentMonth }: ExpensesTabProps) {
  const categorizedExpenses = getExpensesByCategory(currentMonth)
  const totalExpenses = getExpenseTotalForMonth(currentMonth)
  const totalInstructorPay = classFinancials.reduce((sum, f) => sum + f.monthlyInstructorCost, 0)
  const itemCount = expenseLineItems.length
  const categoryCount = expenseCategories.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Monthly Expenses</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Enter your average monthly costs. These flow into overhead allocation for class profitability.
          </p>
        </div>
        <Button size="sm">
          <Plus className="size-4 mr-1.5" />
          Add Category
        </Button>
      </div>

      {/* Category groups */}
      {categorizedExpenses.map(({ category, items }) => (
        <div key={category.id}>
          <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-2.5 pb-1.5 border-b">
            {category.name}
          </div>
          <div className="space-y-2">
            {items.map(({ item, amount }) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-card border rounded-lg px-4 py-3"
              >
                <span className="text-sm">{item.name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground w-14 text-right">Monthly</span>
                  <div className="bg-muted border rounded-md px-3 py-1.5 w-28 text-right text-sm font-medium tabular-nums">
                    {formatCurrency(amount)}
                  </div>
                  <button className="text-muted-foreground hover:text-foreground text-lg leading-none">
                    ⋮
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Total footer */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
            Total Monthly Expenses (excl. instructor pay)
          </p>
          <p className="text-xs text-emerald-700 mt-0.5">
            {itemCount} items across {categoryCount} categories
          </p>
        </div>
        <p className="text-2xl font-bold text-emerald-800 tabular-nums">
          {formatCurrency(totalExpenses)}
        </p>
      </div>

      {/* Instructor pay note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800">
        <strong>Note:</strong> Instructor pay ({formatCurrency(totalInstructorPay)}/mo) is calculated
        automatically from class schedules and pay rates — it&apos;s not entered here. Total overhead
        including instructor pay: <strong>{formatCurrency(totalExpenses + totalInstructorPay)}/mo</strong>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify the tab renders**

Navigate to `http://localhost:3000/studio-financials`, click the "Expenses" tab. Verify:
- Expense categories display grouped (Facility, Utilities, Insurance, Administrative, Marketing)
- Each line item shows name, "Monthly" label, and dollar amount
- Running total at the bottom
- Instructor pay note at the bottom

- [ ] **Step 3: Commit**

```bash
git add src/components/studio-financials/expenses-tab.tsx
git commit -m "feat(financials): implement Expenses tab with grouped categories and running total"
```

---

### Task 8: Build Revenue Tab

**Files:**
- Modify: `src/components/studio-financials/revenue-tab.tsx` (replace placeholder)

- [ ] **Step 1: Implement the full Revenue tab**

Replace `src/components/studio-financials/revenue-tab.tsx` with:

```typescript
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { formatCurrency } from "@/lib/format"
import { revenueCategories, revenueLineItems, getRevenueByCategory, getRevenueTotalForMonth } from "@/data/studio-revenue"

interface RevenueTabProps {
  currentMonth: string
}

export function RevenueTab({ currentMonth }: RevenueTabProps) {
  const categorizedRevenue = getRevenueByCategory(currentMonth)
  const totalRevenue = getRevenueTotalForMonth(currentMonth)
  const itemCount = revenueLineItems.length
  const categoryCount = revenueCategories.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Monthly Revenue</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track all income streams. Tuition is auto-calculated from class enrollment data.
          </p>
        </div>
        <Button size="sm">
          <Plus className="size-4 mr-1.5" />
          Add Category
        </Button>
      </div>

      {/* Category groups */}
      {categorizedRevenue.map(({ category, items }) => (
        <div key={category.id}>
          <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-2.5 pb-1.5 border-b">
            {category.name}
          </div>
          <div className="space-y-2">
            {items.map(({ item, amount }) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-card border rounded-lg px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{item.name}</span>
                  {item.isAutoCalculated && (
                    <Badge variant="secondary" className="text-[10px]">Auto</Badge>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground w-14 text-right">Monthly</span>
                  <div className="bg-muted border rounded-md px-3 py-1.5 w-28 text-right text-sm font-medium tabular-nums">
                    {formatCurrency(amount)}
                  </div>
                  {!item.isAutoCalculated && (
                    <button className="text-muted-foreground hover:text-foreground text-lg leading-none">
                      ⋮
                    </button>
                  )}
                  {item.isAutoCalculated && <div className="w-4" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Total footer */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
            Total Monthly Revenue
          </p>
          <p className="text-xs text-emerald-700 mt-0.5">
            {itemCount} items across {categoryCount} categories
          </p>
        </div>
        <p className="text-2xl font-bold text-emerald-800 tabular-nums">
          {formatCurrency(totalRevenue)}
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify the tab renders**

Navigate to `http://localhost:3000/studio-financials`, click the "Revenue" tab. Verify:
- Revenue categories display grouped (Tuition, Fees, Services, Merchandise)
- Tuition item shows "Auto" badge and no three-dot menu
- Running total at the bottom

- [ ] **Step 3: Commit**

```bash
git add src/components/studio-financials/revenue-tab.tsx
git commit -m "feat(financials): implement Revenue tab with auto-calculated tuition and grouped categories"
```

---

### Task 9: Build Class Analysis Tab

**Files:**
- Modify: `src/components/studio-financials/class-analysis-tab.tsx` (replace placeholder)

- [ ] **Step 1: Implement the full Class Analysis tab**

Replace `src/components/studio-financials/class-analysis-tab.tsx` with:

```typescript
"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowUpDown, Percent, TrendingUp, AlertTriangle, Award } from "lucide-react"
import { formatCurrency } from "@/lib/format"
import { cn } from "@/lib/utils"
import { classFinancials } from "@/data/class-profitability"
import { computeClassFinancialsWithRealOverhead } from "@/data/studio-financial-settings"
import { getExpenseTotalForMonth } from "@/data/studio-expenses"
import type { AllocationMethod, ClassFinancials } from "@/lib/types"

interface ClassAnalysisTabProps {
  allocationMethod: AllocationMethod
  onAllocationMethodChange: (method: AllocationMethod) => void
  currentMonth: string
}

const METHODS: { value: AllocationMethod; label: string }[] = [
  { value: "equal", label: "Equal" },
  { value: "hours", label: "Hours" },
  { value: "revenue", label: "Revenue" },
  { value: "custom", label: "Custom" },
]

const METHOD_DESCRIPTIONS: Record<AllocationMethod, string> = {
  equal: "overhead is split equally across all active classes, regardless of size or hours.",
  hours: "overhead is distributed proportionally by weekly class hours. Classes using more studio time absorb more overhead.",
  revenue: "overhead is distributed proportionally by monthly tuition revenue. Higher-revenue classes absorb more overhead.",
  custom: "overhead is distributed by manually assigned weights per class.",
}

type SortField = "className" | "enrolledStudents" | "monthlyRevenue" | "monthlyInstructorCost" | "monthlyOverhead" | "monthlyMargin" | "marginPercent" | "breakeven"

export function ClassAnalysisTab({ allocationMethod, onAllocationMethodChange, currentMonth }: ClassAnalysisTabProps) {
  const [sortField, setSortField] = useState<SortField>("marginPercent")
  const [sortAsc, setSortAsc] = useState(false)

  const totalOverhead = getExpenseTotalForMonth(currentMonth)

  const adjustedFinancials = useMemo(
    () => computeClassFinancialsWithRealOverhead(classFinancials, currentMonth, allocationMethod),
    [allocationMethod, currentMonth],
  )

  const sorted = useMemo(() => {
    return [...adjustedFinancials].sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      return sortAsc ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number)
    })
  }, [adjustedFinancials, sortField, sortAsc])

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortField(field)
      setSortAsc(false)
    }
  }

  function getSortIcon(field: SortField) {
    if (sortField !== field) return null
    return <ArrowUpDown className="size-3 ml-1 inline" />
  }

  // KPIs
  const avgMargin = adjustedFinancials.reduce((sum, f) => sum + f.marginPercent, 0) / adjustedFinancials.length
  const profitable = adjustedFinancials.filter((f) => f.monthlyMargin > 0).length
  const belowBreakeven = adjustedFinancials.filter((f) => f.monthlyMargin < 0).length
  const bestMargin = adjustedFinancials.reduce((best, f) => f.marginPercent > best.marginPercent ? f : best, adjustedFinancials[0])

  return (
    <div className="space-y-6">
      {/* Header + allocation toggle */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold">Class Profitability</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Overhead of <span className="font-medium text-foreground">{formatCurrency(totalOverhead)}/mo</span> distributed across {adjustedFinancials.length} active classes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Allocate by:</span>
          <div className="flex rounded-lg border overflow-hidden">
            {METHODS.map((m) => (
              <button
                key={m.value}
                onClick={() => onAllocationMethodChange(m.value)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium transition-colors",
                  allocationMethod === m.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-accent text-muted-foreground"
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Avg Margin</p>
            <p className="text-xl font-bold mt-1 tabular-nums">{avgMargin.toFixed(1)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Profitable</p>
            <p className="text-xl font-bold mt-1 text-emerald-600">{profitable} <span className="text-sm font-normal text-muted-foreground">of {adjustedFinancials.length}</span></p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Below Breakeven</p>
            <p className="text-xl font-bold mt-1 text-red-600">{belowBreakeven}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Best Margin</p>
            <p className="text-xl font-bold mt-1">{bestMargin.marginPercent.toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Class table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("className")}>
                  Class {getSortIcon("className")}
                </TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead className="text-right cursor-pointer select-none" onClick={() => toggleSort("monthlyRevenue")}>
                  Revenue {getSortIcon("monthlyRevenue")}
                </TableHead>
                <TableHead className="text-right cursor-pointer select-none" onClick={() => toggleSort("monthlyInstructorCost")}>
                  Instr. Pay {getSortIcon("monthlyInstructorCost")}
                </TableHead>
                <TableHead className="text-right cursor-pointer select-none" onClick={() => toggleSort("monthlyOverhead")}>
                  Overhead {getSortIcon("monthlyOverhead")}
                </TableHead>
                <TableHead className="text-right cursor-pointer select-none" onClick={() => toggleSort("monthlyMargin")}>
                  Net Margin {getSortIcon("monthlyMargin")}
                </TableHead>
                <TableHead className="text-right cursor-pointer select-none" onClick={() => toggleSort("marginPercent")}>
                  Margin % {getSortIcon("marginPercent")}
                </TableHead>
                <TableHead className="text-right cursor-pointer select-none" onClick={() => toggleSort("breakeven")}>
                  Breakeven {getSortIcon("breakeven")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((f) => {
                const isNegative = f.monthlyMargin < 0
                const marginColor = f.marginPercent > 30
                  ? "text-emerald-600"
                  : f.marginPercent >= 0
                    ? "text-amber-600"
                    : "text-red-600"
                const studentsNeeded = isNegative ? f.breakeven - f.enrolledStudents : 0

                return (
                  <TableRow
                    key={f.classId}
                    className={cn(isNegative && "bg-red-50 hover:bg-red-100")}
                  >
                    <TableCell>
                      <div className="font-medium">{f.className}</div>
                      <div className="text-xs text-muted-foreground">
                        {f.enrolledStudents} students · {f.hoursPerWeek} hrs/wk
                        {isNegative && <span className="text-red-600 font-medium"> · needs {studentsNeeded} more</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{f.instructorName}</TableCell>
                    <TableCell className="text-right text-sm">{formatCurrency(f.monthlyRevenue)}</TableCell>
                    <TableCell className="text-right text-sm">{formatCurrency(f.monthlyInstructorCost)}</TableCell>
                    <TableCell className="text-right text-sm">{formatCurrency(f.monthlyOverhead)}</TableCell>
                    <TableCell className={cn("text-right text-sm font-medium", marginColor)}>
                      {formatCurrency(f.monthlyMargin)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs tabular-nums",
                          f.marginPercent > 30
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : f.marginPercent >= 0
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-red-50 text-red-700 border-red-200"
                        )}
                      >
                        {f.marginPercent.toFixed(1)}%
                      </Badge>
                    </TableCell>
                    <TableCell className={cn("text-right text-sm", isNegative && "text-red-600 font-semibold")}>
                      {f.breakeven}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Allocation explanation */}
      <div className="bg-violet-50 border border-violet-200 rounded-lg px-4 py-3 text-sm text-violet-800">
        <strong>Allocation method: {allocationMethod.charAt(0).toUpperCase() + allocationMethod.slice(1)}</strong> — {METHOD_DESCRIPTIONS[allocationMethod]}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify the tab renders and allocation toggle works**

Navigate to `http://localhost:3000/studio-financials`, click the "Class Analysis" tab. Verify:
- KPI cards show aggregate stats
- Table shows all classes sorted by margin %
- Below-breakeven rows have red background with "needs X more" hint
- Clicking allocation method buttons (Equal/Hours/Revenue/Custom) recalculates the overhead column and all dependent values
- Column headers are sortable

- [ ] **Step 3: Commit**

```bash
git add src/components/studio-financials/class-analysis-tab.tsx
git commit -m "feat(financials): implement Class Analysis tab with sortable table and allocation method toggle"
```

---

### Task 10: Final Verification and Cleanup

**Files:**
- All files from tasks 1-9

- [ ] **Step 1: Full build check**

Run: `cd /Users/dylanwilcox/Projects/studio-os && npx next build 2>&1 | tail -20`
Expected: Build succeeds with no errors

- [ ] **Step 2: Verify all four tabs work end-to-end**

Navigate to `http://localhost:3000/studio-financials` and check:
1. **Overview** — KPI cards, P&L chart, revenue/expense breakdowns all display correctly. Date range toggle works.
2. **Revenue** — All revenue categories display with amounts. Tuition shows "Auto" badge.
3. **Expenses** — All expense categories display grouped. Running total is correct. Instructor pay note shows.
4. **Class Analysis** — Table renders with all classes. Allocation toggle changes overhead values. Below-breakeven rows are highlighted red. Sorting works on all columns.

- [ ] **Step 3: Verify sidebar navigation**

Click "Studio Financials" in the sidebar. Verify it navigates to the page and shows as active.

- [ ] **Step 4: Commit any final fixes**

If any fixes were needed:
```bash
git add -A
git commit -m "fix(financials): address build issues and polish Studio Financials page"
```
