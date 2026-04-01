# Studio Financials — Design Spec

**Date:** 2026-04-01
**Status:** Draft
**Location:** Finance → Studio Financials (new nav item alongside Billing)

## Problem

Studio OS has class-level P&L, but overhead is a flat $231/class derived from a magic number ($18,500 / ~80 classes). Studio owners can't see what makes up that overhead, can't track real expenses, and can't get a studio-wide financial picture. Without real cost data flowing into class profitability, the "should we keep this class?" question can't be answered with confidence.

## Solution

A new **Studio Financials** page under Finance with four tabs:

1. **Overview** — Studio-wide monthly P&L with KPI cards, bar chart, and revenue/expense breakdowns
2. **Revenue** — Manage custom revenue categories and monthly amounts
3. **Expenses** — Manage custom expense categories and monthly amounts
4. **Class Analysis** — Per-class profitability table powered by real overhead, with owner-chosen allocation method

Real expenses replace the hardcoded $18,500 overhead. Revenue expands beyond tuition to capture all income streams. The owner chooses how overhead is distributed across classes (equal, by hours, by revenue, or custom weights).

## Tab Designs

### Overview Tab

**Date range controls:** Quick-select buttons for 12 months, 6 months, and a custom range picker. Default view is 12 months.

**KPI cards (top row, 4 cards):**
- Total Revenue (with % change vs prior period)
- Total Expenses (with % change vs prior period)
- Net Margin (dollar amount + margin percentage)
- Classes Below Breakeven (count out of total active)

**Monthly P&L chart:** Grouped bar chart showing revenue (indigo) and expenses (red) for each month in the selected range. Provides an at-a-glance trend view — seasonal dips, growth, and expense spikes are immediately visible.

**Revenue & Expense breakdown (side by side):** Two cards showing the itemized breakdown for the most recent month within the selected date range. Revenue card lists each revenue stream with its dollar amount and a total. Expense card does the same for expense categories.

### Revenue Tab

Follows the same layout pattern as Expenses (described below). Custom categories with sensible defaults:

**Default revenue categories:**
- **Tuition** — Tuition (auto-calculated from class enrollment data, shown but not manually editable)
- **Fees** — Registration Fees, Costume Fees, Competition Entry Fees
- **Services** — Private Lessons, Studio Rental Income
- **Merchandise** — Merchandise Sales

Owners can add custom categories and line items. Each line item has a name and a monthly dollar amount. Inline editing — amounts are editable directly in the list.

### Expenses Tab

Expense line items grouped by category. Each item shows its name, frequency label ("Monthly"), editable dollar amount, and a three-dot menu for rename/move/delete.

**Default expense categories and items:**
- **Facility** — Rent/Mortgage, Property Tax, Maintenance & Repairs
- **Utilities** — Electric, Water, Gas, Internet/Phone
- **Insurance** — Property Insurance, Liability Insurance, Workers' Compensation
- **Administrative** — Accounting/Bookkeeping, Software Subscriptions, Music Licensing, Cleaning Service
- **Marketing** — Advertising, Website Hosting

**"+ Add Category" button** at the top creates new groups or new items within existing groups.

**Instructor pay is excluded** from manual expense entry — it's auto-calculated from class schedules and pay rates. A note at the bottom shows the instructor pay total and the combined overhead figure (manual expenses + instructor pay) so the owner has the full picture.

**Running total** at the bottom shows total monthly expenses (excluding instructor pay) with item and category counts.

### Class Analysis Tab

**Allocation method toggle** (top right): Equal | Hours | Revenue | Custom. Selecting a method recalculates all overhead allocations instantly.

- **Equal** — total overhead / number of active classes
- **Hours** — proportional to weekly class hours (a 1.25 hr/wk class absorbs more than a 0.75 hr/wk class)
- **Revenue** — proportional to monthly tuition revenue
- **Custom** — owner manually sets a percentage weight per class via an inline input in the table's Overhead column. Weights must sum to 100%; a validation message appears if they don't.

**Summary cards (4 cards):** Average Margin %, Profitable class count, Below Breakeven count, Best Margin %.

**Class profitability table** sorted by margin % (best to worst):

| Column | Description |
|--------|-------------|
| Class | Name + student count + hours/wk |
| Instructor | Instructor name |
| Revenue | Monthly tuition revenue |
| Instr. Pay | Monthly instructor cost |
| Overhead | Allocated overhead for this class (varies by method) |
| Net Margin | Revenue - Instructor Pay - Overhead |
| Margin % | Net Margin / Revenue as percentage |
| Breakeven | Minimum students needed to cover costs |

**Below-breakeven classes** get a red background with a "needs X more students" hint showing the enrollment gap.

**Clickable rows** navigate to the existing class detail page, which shows the deeper P&L breakdown and what-if enrollment slider (already built).

**Allocation explanation banner** at the bottom describes the current method and its effect in plain language.

## Data Model

All new types go in `src/lib/types.ts` (per project convention).

### New Types

```typescript
interface FinancialCategory {
  id: string
  name: string                        // e.g. "Facility", "Utilities"
  type: "expense" | "revenue"
  sortOrder: number
}

interface FinancialLineItem {
  id: string
  categoryId: string
  name: string                        // e.g. "Rent / Mortgage", "Electric"
  defaultMonthlyAmount: number
  isAutoCalculated?: boolean          // true for tuition, instructor pay
}

interface MonthlyFinancialEntry {
  lineItemId: string
  month: string                       // "2026-01" format
  amount: number
}

type AllocationMethod = "equal" | "hours" | "revenue" | "custom"

interface StudioFinancialSettings {
  allocationMethod: AllocationMethod
  customWeights?: Record<string, number>  // classId → weight (for "custom" method)
}
```

### New Data Files

- `src/data/studio-expenses.ts` — default expense categories, line items, and 12 months of mock monthly entries
- `src/data/studio-revenue.ts` — default revenue categories, line items, and 12 months of mock monthly entries
- `src/data/studio-financial-settings.ts` — default allocation settings

### Mock Data

12 months of data: **Apr 2025 – Mar 2026**. Realistic seasonal variation:
- Higher utility costs in winter months (Dec–Feb)
- Revenue dip in June/July (summer break) and December (holidays)
- Registration fee spikes in August/September (new season enrollment)
- Costume fee spikes in March/April (recital season)

### Integration with Existing Code

**`src/data/class-profitability.ts` upgrade:**
The hardcoded `MONTHLY_OVERHEAD_PER_CLASS = 231` is replaced by a function that:
1. Sums all expense line items for a given month
2. Applies the owner's chosen allocation method
3. Returns per-class overhead amounts

The `ClassFinancials` interface stays unchanged — it already has `monthlyOverhead`, `monthlyMargin`, `marginPercent`, and `breakeven` fields. Only the values change.

**Dashboard profitability tab + class detail P&L:** Both consume `ClassFinancials` data. They'll automatically reflect real overhead with no UI changes needed.

**Sidebar navigation:** "Studio Financials" is added under the Finance section alongside the existing "Billing" link. Admin role only.

## Route Structure

```
src/app/(admin)/studio-financials/
  page.tsx          — main page with tab navigation
  overview.tsx      — Overview tab component
  revenue.tsx       — Revenue tab component
  expenses.tsx      — Expenses tab component
  class-analysis.tsx — Class Analysis tab component
```

Tab state managed via URL search params (`?tab=overview|revenue|expenses|class-analysis`) so tabs are bookmarkable and shareable.

## Out of Scope

- Real database persistence (this is mock data, per project phase)
- API routes or server actions
- Multi-studio support
- Historical expense editing (month-by-month entry is a future enhancement — for now, amounts represent monthly averages)
- Export/download of financial reports
- Integration with external accounting software
