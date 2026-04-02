import { db } from "@/lib/db"
import { toNumber } from "./enum-mappers"

export async function getBillingConfig() {
  const config = await db.billingConfig.findFirst({ where: { isActive: true } })
  if (!config) return null
  return {
    hourlyRate: toNumber(config.hourlyRate),
    monthlyCap: toNumber(config.monthlyCap),
    registrationFee: toNumber(config.registrationFee),
    lateFee: toNumber(config.lateFee),
    lateFeeGraceDays: config.lateFeeGraceDays,
    siblingDiscount: toNumber(config.siblingDiscount),
    trialFee: toNumber(config.trialFee),
  }
}

export async function getBillingOverrides() {
  const rows = await db.billingOverride.findMany({ orderBy: { createdAt: "desc" } })
  return rows.map(o => ({
    id: o.id,
    originalAmount: toNumber(o.originalAmount),
    newAmount: toNumber(o.newAmount),
    reason: o.reason,
    createdBy: o.createdBy,
    createdAt: o.createdAt.toISOString(),
  }))
}

export async function calculateMonthlyTotal(classRates: number[]) {
  const config = await getBillingConfig()
  const cap = config?.monthlyCap ?? 380
  const total = classRates.reduce((sum, rate) => sum + rate, 0)
  return Math.min(total, cap)
}
