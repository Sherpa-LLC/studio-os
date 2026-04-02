import { db } from "@/lib/db"
import { toNumber, toISODate } from "./enum-mappers"

export async function getRolloverConfig() {
  const row = await db.rolloverConfig.findFirst({ orderBy: { createdAt: "desc" } })
  if (!row) return null
  return {
    sourceSeasonId: row.sourceSeasonId, sourceSeasonName: row.sourceSeasonName,
    targetSeasonName: row.targetSeasonName, rolloverDate: toISODate(row.rolloverDate),
    registrationFee: toNumber(row.registrationFee), notificationDate: toISODate(row.notificationDate),
    currentStep: row.currentStep,
  }
}

export async function getRolloverResponses() {
  const rows = await db.rolloverHouseholdResponse.findMany()
  return rows.map(r => ({
    householdId: r.householdId, householdName: r.householdName,
    status: r.status.replace(/_/g, "-"),
    currentClasses: r.currentClasses, suggestedClasses: r.suggestedClasses,
    requestedChanges: r.requestedChanges ?? undefined, reason: r.reason ?? undefined,
  }))
}

export { ageUpFlags, rolloverSummary } from "@/data/rollover"
