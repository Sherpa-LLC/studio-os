import { db } from "@/lib/db"
import { mapLeadStage, mapLeadSource, mapDiscipline, toISODate } from "./enum-mappers"
import type { Lead } from "@/lib/types"

function mapLead(l: any): Lead {
  return {
    id: l.id, firstName: l.firstName, lastName: l.lastName,
    email: l.email, phone: l.phone, childName: l.childName, childAge: l.childAge,
    interestDiscipline: mapDiscipline(l.interestDiscipline),
    source: mapLeadSource(l.source) as any,
    stage: mapLeadStage(l.stage),
    notes: l.notes, createdAt: toISODate(l.createdAt),
    lastContactedAt: l.lastContactedAt ? toISODate(l.lastContactedAt) : undefined,
    assignedTo: l.assignedTo ?? undefined,
  }
}

export async function getLeads() {
  const rows = await db.lead.findMany({ orderBy: { createdAt: "desc" } })
  return rows.map(mapLead)
}
export async function getLeadById(id: string) {
  const row = await db.lead.findUnique({ where: { id } })
  return row ? mapLead(row) : undefined
}
export async function getLeadsByStage(stage: string) {
  const dbStage = stage === "new" ? "new_lead" : stage.replace(/-/g, "_")
  const rows = await db.lead.findMany({ where: { stage: dbStage as any }, orderBy: { createdAt: "desc" } })
  return rows.map(mapLead)
}
export async function searchLeads(query: string) {
  const rows = await db.lead.findMany({
    where: { OR: [
      { firstName: { contains: query, mode: "insensitive" } },
      { lastName: { contains: query, mode: "insensitive" } },
      { email: { contains: query, mode: "insensitive" } },
    ]},
    orderBy: { createdAt: "desc" },
  })
  return rows.map(mapLead)
}
