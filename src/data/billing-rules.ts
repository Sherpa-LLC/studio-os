import type { BillingOverride } from "@/lib/types"

// ── Billing configuration ─────────────────────────────────────────────────────

export interface BillingConfig {
  hourlyRate: number
  monthlyCapHours: number
  monthlyCapAmount: number
  registrationFee: number
  competitionFee: number
  costumeFeeRanges: {
    recreational: { min: number; max: number }
    competitive: { min: number; max: number }
  }
  lateFeePercent: number
  lateFeeGraceDays: number
  siblingDiscountPercent: number
  multiClassDiscountThreshold: number
  multiClassDiscountPercent: number
}

export const billingConfig: BillingConfig = {
  hourlyRate: 95,
  monthlyCapHours: 6,
  monthlyCapAmount: 570,
  registrationFee: 50,
  competitionFee: 250,
  costumeFeeRanges: {
    recreational: { min: 65, max: 85 },
    competitive: { min: 95, max: 150 },
  },
  lateFeePercent: 5,
  lateFeeGraceDays: 10,
  siblingDiscountPercent: 10,
  multiClassDiscountThreshold: 4,
  multiClassDiscountPercent: 5,
}

// ── Billing overrides (audit trail) ───────────────────────────────────────────

export const billingOverrides: BillingOverride[] = [
  {
    id: "bo-001",
    originalAmount: 150,
    newAmount: 120,
    reason: "Financial hardship - single parent family. Approved 20% reduction for Ballet IV Seniors.",
    createdBy: "Sarah Mitchell (Office Manager)",
    createdAt: "2026-01-08T14:30:00Z",
  },
  {
    id: "bo-002",
    originalAmount: 180,
    newAmount: 0,
    reason: "Competition rehearsal waived - student awarded merit scholarship for Spring 2026.",
    createdBy: "Jennifer Walsh (Studio Director)",
    createdAt: "2026-01-05T09:15:00Z",
  },
  {
    id: "bo-003",
    originalAmount: 85,
    newAmount: 42.5,
    reason: "Prorated first month - student enrolled mid-January. 50% of monthly rate.",
    createdBy: "Sarah Mitchell (Office Manager)",
    createdAt: "2026-01-16T11:00:00Z",
  },
  {
    id: "bo-004",
    originalAmount: 320,
    newAmount: 288,
    reason: "Sibling discount applied - 10% off for second child in Williams household.",
    createdBy: "System (Auto)",
    createdAt: "2026-02-01T00:00:00Z",
  },
  {
    id: "bo-005",
    originalAmount: 960,
    newAmount: 912,
    reason: "Multi-class discount - Garcia family has 8 classes across 3 students (5% discount).",
    createdBy: "System (Auto)",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "bo-006",
    originalAmount: 90,
    newAmount: 0,
    reason: "Refund for cancelled class session due to instructor illness on 2/12.",
    createdBy: "Sarah Mitchell (Office Manager)",
    createdAt: "2026-02-13T10:45:00Z",
  },
  {
    id: "bo-007",
    originalAmount: 100,
    newAmount: 75,
    reason: "Student returning after injury. Partial-month rate for first month back.",
    createdBy: "Jennifer Walsh (Studio Director)",
    createdAt: "2026-03-03T16:20:00Z",
  },
  {
    id: "bo-008",
    originalAmount: 75,
    newAmount: 0,
    reason: "Trial class - first class free for new Tiny Tots student (O'Brien household).",
    createdBy: "Sarah Mitchell (Office Manager)",
    createdAt: "2026-01-12T13:00:00Z",
  },
]

// ── Helper functions ──────────────────────────────────────────────────────────

export function getOverrideById(id: string): BillingOverride | undefined {
  return billingOverrides.find((o) => o.id === id)
}

export function calculateMonthlyTotal(classRates: number[]): number {
  const total = classRates.reduce((sum, rate) => sum + rate, 0)
  return Math.min(total, billingConfig.monthlyCapAmount)
}

export function calculateLateFee(invoiceTotal: number): number {
  return invoiceTotal * (billingConfig.lateFeePercent / 100)
}

export function calculateSiblingDiscount(tuition: number): number {
  return tuition * (billingConfig.siblingDiscountPercent / 100)
}
