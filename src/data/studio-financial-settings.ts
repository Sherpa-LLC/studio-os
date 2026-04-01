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
