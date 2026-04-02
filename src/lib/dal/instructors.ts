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
  const row = await db.staffMember.findFirst({
    where: { id, role: "instructor" },
    select: { firstName: true, lastName: true },
  })
  return row ? `${row.firstName} ${row.lastName}` : "Unknown"
}
