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
