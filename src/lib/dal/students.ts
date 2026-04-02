import { db } from "@/lib/db"
import {
  computeAge,
  mapEnrollmentStatus,
  mapGender,
  toISODate,
} from "./enum-mappers"
import type { Student } from "@/lib/types"

// ── Mappers ──────────────────────────────────────────────────────────────────

type PrismaStudent = Awaited<
  ReturnType<typeof db.student.findFirst<{
    include: { enrollments: true }
  }>>
>

function mapStudent(row: NonNullable<PrismaStudent>): Student {
  const measurements = row.measurements as Student["measurements"] | null
  return {
    id: row.id,
    householdId: row.householdId,
    firstName: row.firstName,
    lastName: row.lastName,
    dateOfBirth: toISODate(row.dateOfBirth),
    age: computeAge(row.dateOfBirth),
    gender: mapGender(row.gender),
    medicalNotes: row.medicalNotes ?? undefined,
    enrollmentStatus: mapEnrollmentStatus(row.enrollmentStatus),
    enrolledClassIds: row.enrollments.map((e) => e.classId),
    measurements: measurements ?? undefined,
  }
}

// ── Shared include ──────────────────────────────────────────────────────────

const studentInclude = { enrollments: true } as const

// ── Queries ──────────────────────────────────────────────────────────────────

export async function getStudents(): Promise<Student[]> {
  const rows = await db.student.findMany({
    include: studentInclude,
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  })
  return rows.map(mapStudent)
}

export async function getStudentById(id: string): Promise<Student | undefined> {
  const row = await db.student.findUnique({
    where: { id },
    include: studentInclude,
  })
  return row ? mapStudent(row) : undefined
}

export async function getStudentsByHousehold(householdId: string): Promise<Student[]> {
  const rows = await db.student.findMany({
    where: { householdId },
    include: studentInclude,
    orderBy: { dateOfBirth: "asc" },
  })
  return rows.map(mapStudent)
}

export async function getStudentsByClass(classId: string): Promise<Student[]> {
  const rows = await db.student.findMany({
    where: {
      enrollments: { some: { classId } },
    },
    include: studentInclude,
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  })
  return rows.map(mapStudent)
}

export async function getActiveStudents(): Promise<Student[]> {
  const rows = await db.student.findMany({
    where: { enrollmentStatus: "active" },
    include: studentInclude,
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  })
  return rows.map(mapStudent)
}

export async function searchStudents(query: string): Promise<Student[]> {
  const q = query.toLowerCase()
  const rows = await db.student.findMany({
    where: {
      OR: [
        { firstName: { contains: q, mode: "insensitive" } },
        { lastName: { contains: q, mode: "insensitive" } },
      ],
    },
    include: studentInclude,
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  })
  return rows.map(mapStudent)
}
