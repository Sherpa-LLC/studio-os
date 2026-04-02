import { db } from "@/lib/db"
import {
  mapDisciplines,
  mapDiscipline,
  toNumber,
  toPrismaDiscipline,
} from "./enum-mappers"
import type { Discipline, Instructor } from "@/lib/types"

// ── Mappers ──────────────────────────────────────────────────────────────────

type PrismaInstructor = Awaited<ReturnType<typeof db.staffMember.findFirst>>

function mapInstructor(row: NonNullable<PrismaInstructor>): Instructor {
  return {
    id: row.id,
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    phone: row.phone,
    specialties: mapDisciplines(row.disciplines),
    payRate: toNumber(row.payRate),
    payType: row.payType as "hourly" | "per-class",
    avatar: row.avatar ?? undefined,
  }
}

// ── Queries ──────────────────────────────────────────────────────────────────

export async function getInstructors(): Promise<Instructor[]> {
  const rows = await db.staffMember.findMany({
    where: { role: "instructor" },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  })
  return rows.map(mapInstructor)
}

export async function getInstructorById(id: string): Promise<Instructor | undefined> {
  const row = await db.staffMember.findFirst({
    where: { id, role: "instructor" },
  })
  return row ? mapInstructor(row) : undefined
}

export async function getInstructorsByDiscipline(
  discipline: Discipline,
): Promise<Instructor[]> {
  const prismaDiscipline = toPrismaDiscipline(discipline)
  const rows = await db.staffMember.findMany({
    where: {
      role: "instructor",
      disciplines: { has: prismaDiscipline },
    },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  })
  return rows.map(mapInstructor)
}

export async function getInstructorName(id: string): Promise<string> {
  // Try direct ID lookup first, then mapped ID
  let row = await db.staffMember.findUnique({
    where: { id },
    select: { firstName: true, lastName: true },
  })
  if (!row && id.startsWith("inst-")) {
    // Try staff-XXX format (inst-001 -> staff-001)
    const num = id.replace("inst-", "")
    row = await db.staffMember.findUnique({
      where: { id: `staff-${num}` },
      select: { firstName: true, lastName: true },
    })
    if (!row) {
      // Try staff-inst-XXX format
      row = await db.staffMember.findUnique({
        where: { id: `staff-${id}` },
        select: { firstName: true, lastName: true },
      })
    }
  }
  return row ? `${row.firstName} ${row.lastName}` : "Unknown"
}
