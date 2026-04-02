import { db } from "@/lib/db"
import type { BillingOverride } from "@/lib/types"

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Convert a Prisma Decimal to a plain number for the frontend. */
function dec(value: unknown): number {
  if (value == null) return 0
  return Number(value)
}

// ── Billing Config types (frontend-facing) ───────────────────────────────────

export interface BillingConfigView {
  id: string
  hourlyRate: number
  monthlyCap: number
  registrationFee: number
  lateFee: number
  lateFeeGraceDays: number
  siblingDiscount: number
  trialFee: number
}

// ── BillingConfig queries ────────────────────────────────────────────────────

/**
 * Fetch the single active billing configuration row.
 * Throws if no active config exists — the system cannot operate without one.
 */
export async function getActiveBillingConfig(): Promise<BillingConfigView> {
  const row = await db.billingConfig.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  })

  if (!row) {
    throw new Error(
      "No active BillingConfig found. Seed the database with a default row."
    )
  }

  return {
    id: row.id,
    hourlyRate: dec(row.hourlyRate),
    monthlyCap: dec(row.monthlyCap),
    registrationFee: dec(row.registrationFee),
    lateFee: dec(row.lateFee),
    lateFeeGraceDays: row.lateFeeGraceDays,
    siblingDiscount: dec(row.siblingDiscount),
    trialFee: dec(row.trialFee),
  }
}

// ── BillingOverride queries ──────────────────────────────────────────────────

function mapOverride(row: {
  id: string
  originalAmount: unknown
  newAmount: unknown
  reason: string
  createdBy: string
  createdAt: Date
}): BillingOverride {
  return {
    id: row.id,
    originalAmount: dec(row.originalAmount),
    newAmount: dec(row.newAmount),
    reason: row.reason,
    createdBy: row.createdBy,
    createdAt: row.createdAt.toISOString(),
  }
}

/** Fetch all overrides for a specific line item, newest first. */
export async function getOverridesByLineItem(
  lineItemId: string
): Promise<BillingOverride[]> {
  const rows = await db.billingOverride.findMany({
    where: { lineItemId },
    orderBy: { createdAt: "desc" },
  })
  return rows.map(mapOverride)
}

/** Fetch a single override by ID. */
export async function getOverrideById(
  id: string
): Promise<BillingOverride | null> {
  const row = await db.billingOverride.findUnique({ where: { id } })
  return row ? mapOverride(row) : null
}

/** Fetch all overrides across all line items, newest first. */
export async function getAllOverrides(): Promise<BillingOverride[]> {
  const rows = await db.billingOverride.findMany({
    orderBy: { createdAt: "desc" },
  })
  return rows.map(mapOverride)
}

// ── Billing calculation (application logic) ───────��──────────────────────────

/**
 * Calculate the monthly total for a household given an array of class rates.
 * Applies the monthly cap ($380) from the active BillingConfig.
 *
 * This is application logic, not a pure DB query — it reads config then computes.
 */
export async function calculateMonthlyTotal(
  classRates: number[]
): Promise<number> {
  const config = await getActiveBillingConfig()
  const rawTotal = classRates.reduce((sum, rate) => sum + rate, 0)

  if (rawTotal > config.monthlyCap) {
    return config.monthlyCap
  }

  return rawTotal
}

/**
 * Calculate the late fee for a given invoice total.
 * Uses the flat late fee amount from BillingConfig ($25 by default).
 */
export async function calculateLateFee(
  _invoiceTotal: number
): Promise<number> {
  const config = await getActiveBillingConfig()
  return config.lateFee
}
