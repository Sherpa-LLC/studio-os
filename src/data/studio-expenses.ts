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
