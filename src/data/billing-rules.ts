import type { BillingOverride } from "@/lib/types"

// ── Billing configuration ─────────────────────────────────────────────────────

export interface BillingConfig {
  hourlyRate: number
  monthlyCapEnabled: boolean
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
}

export const billingConfig: BillingConfig = {
  hourlyRate: 95,
  monthlyCapEnabled: true,
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
    originalAmount: 95,
    newAmount: 0,
    reason: "Referral credit — Rodriguez family referred by Anderson household.",
    createdBy: "Sarah Mitchell (Office Manager)",
    createdAt: "2026-02-01T10:30:00Z",
  },
  {
    id: "bo-005",
    originalAmount: 570,
    newAmount: 475,
    reason: "Competitive team travel hardship — reduced monthly cap for February during competition season.",
    createdBy: "Jennifer Walsh (Studio Director)",
    createdAt: "2026-02-03T09:00:00Z",
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
  if (billingConfig.monthlyCapEnabled) {
    return Math.min(total, billingConfig.monthlyCapAmount)
  }
  return total
}

export function calculateLateFee(invoiceTotal: number): number {
  return invoiceTotal * (billingConfig.lateFeePercent / 100)
}
