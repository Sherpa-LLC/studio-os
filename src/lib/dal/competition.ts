import { db } from "@/lib/db"
import { mapDiscipline, mapAgeGroup, toNumber } from "./enum-mappers"
import type { CompetitionTeam } from "@/lib/types"

function mapTeam(t: any): CompetitionTeam {
  return {
    id: t.id, name: t.name,
    disciplines: t.disciplines.map(mapDiscipline),
    ageGroup: mapAgeGroup(t.ageGroup),
    headCoach: t.headCoach, season: t.season, studentCount: t.studentCount,
    roster: (t.roster || []).map((m: any) => ({
      studentId: m.studentId, studentName: m.student?.firstName + " " + m.student?.lastName,
      age: 0, parentName: "",
      feeStatus: m.feeStatus, waiverStatus: m.waiverStatus.replace(/_/g, "-"),
      teamFee: toNumber(m.teamFee), competitionFees: toNumber(m.competitionFees),
      costumeFees: toNumber(m.costumeFees), totalOwed: toNumber(m.totalOwed), totalPaid: toNumber(m.totalPaid),
    })),
    competitions: (t.competitions || []).map((e: any) => ({
      id: e.id, name: e.name, date: e.date.toISOString().split("T")[0],
      location: e.location, entryDeadline: e.entryDeadline.toISOString().split("T")[0],
      status: e.status, entryFees: toNumber(e.entryFees),
      travelCost: toNumber(e.travelCost), hotelCost: toNumber(e.hotelCost),
      routines: e.routines, logistics: e.logistics ?? undefined,
    })),
    financials: t.financials as any,
    messages: (t.messages as any[]) || [],
  }
}

export async function getTeams() {
  const rows = await db.competitionTeam.findMany({
    include: { roster: { include: { student: true } }, competitions: true },
  })
  return rows.map(mapTeam)
}
export async function getTeamById(id: string) {
  const row = await db.competitionTeam.findUnique({
    where: { id },
    include: { roster: { include: { student: true } }, competitions: true },
  })
  return row ? mapTeam(row) : undefined
}
