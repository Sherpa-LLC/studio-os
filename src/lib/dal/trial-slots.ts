import { db } from "@/lib/db"
import type { TrialSlot, Discipline } from "@/lib/types"
import { disciplineToFrontend } from "@/lib/dal/classes"

// ── Row → Frontend Mapper ────────────────────────────────────────────────────

type TrialSlotRow = Awaited<ReturnType<typeof db.trialSlot.findMany>>[number] & {
  class?: {
    name: string
    discipline: string
  }
}

function mapTrialSlotRow(row: TrialSlotRow): TrialSlot {
  return {
    id: row.id,
    classId: row.classId,
    className: row.class?.name ?? "",
    discipline: disciplineToFrontend[row.class?.discipline ?? ""] ?? (row.class?.discipline as Discipline),
    date: row.date.toISOString().split("T")[0],
    startTime: row.startTime,
    endTime: row.endTime,
    room: row.room,
    instructorName: row.instructorName,
    availableSpots: row.availableSpots,
    bookedCount: row.bookedCount,
  }
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function getTrialSlots(): Promise<TrialSlot[]> {
  const rows = await db.trialSlot.findMany({
    include: { class: { select: { name: true, discipline: true } } },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  })
  return rows.map(mapTrialSlotRow)
}

export async function getSlotsByDate(date: string): Promise<TrialSlot[]> {
  const targetDate = new Date(date)
  // Match the entire day
  const nextDate = new Date(targetDate)
  nextDate.setDate(nextDate.getDate() + 1)

  const rows = await db.trialSlot.findMany({
    where: {
      date: { gte: targetDate, lt: nextDate },
    },
    include: { class: { select: { name: true, discipline: true } } },
    orderBy: { startTime: "asc" },
  })
  return rows.map(mapTrialSlotRow)
}

export async function getAvailableSlots(): Promise<TrialSlot[]> {
  const rows = await db.trialSlot.findMany({
    where: { availableSpots: { gt: 0 } },
    include: { class: { select: { name: true, discipline: true } } },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  })
  return rows.map(mapTrialSlotRow)
}
