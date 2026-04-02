import { db } from "@/lib/db"
import type { Automation, AutomationStep } from "@/lib/types"
import { toNumber } from "./enum-mappers"

function mapStep(s: any): AutomationStep {
  return { id: s.id, type: s.type.replace(/_/g, "-"), label: s.label, config: s.config as Record<string, string> }
}
function mapAutomation(a: any): Automation {
  return {
    id: a.id, name: a.name, description: a.description,
    trigger: a.trigger.replace(/_/g, "-"),
    steps: (a.steps || []).sort((x: any, y: any) => x.sortOrder - y.sortOrder).map(mapStep),
    status: a.status, createdAt: a.createdAt.toISOString(),
    runsCount: a.runsCount, successRate: toNumber(a.successRate),
  }
}

export async function getAutomations() {
  const rows = await db.automation.findMany({ include: { steps: true }, orderBy: { createdAt: "desc" } })
  return rows.map(mapAutomation)
}
export async function getAutomationById(id: string) {
  const row = await db.automation.findUnique({ where: { id }, include: { steps: true } })
  return row ? mapAutomation(row) : undefined
}
export async function getActiveAutomations() {
  const rows = await db.automation.findMany({ where: { status: "active" }, include: { steps: true } })
  return rows.map(mapAutomation)
}
