import { db } from "@/lib/db"
import { mapDisciplineToFrontend } from "./enum-mappers"
import type { Recital, Routine } from "@/lib/types"

function mapRoutine(r: any): Routine {
  return {
    id: r.id, recitalId: r.recitalId, name: r.name,
    classId: r.classId, className: r.class?.name ?? "",
    discipline: mapDisciplineToFrontend(r.discipline),
    costume: r.costume as any,
    lineupPosition: r.lineupPosition, estimatedDuration: r.estimatedDuration,
    studentCount: r.studentCount,
  }
}
function mapRecital(r: any): Recital {
  return {
    id: r.id, name: r.name, date: r.date.toISOString().split("T")[0],
    venue: r.venue, theme: r.theme ?? undefined, description: r.description ?? undefined,
    status: r.status.replace(/_/g, "-"),
    routines: (r.routines || []).map(mapRoutine),
  }
}

export async function getRecitals() {
  const rows = await db.recital.findMany({ include: { routines: { include: { class: true } } }, orderBy: { date: "desc" } })
  return rows.map(mapRecital)
}
export async function getRecitalById(id: string) {
  const row = await db.recital.findUnique({ where: { id }, include: { routines: { include: { class: true } } } })
  return row ? mapRecital(row) : undefined
}

export { COSTUME_SUPPLIERS } from "@/data/recitals"
export { measurements } from "@/data/recitals"
export { getCostumeFinancials } from "@/data/recitals"
