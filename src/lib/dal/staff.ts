import { db } from "@/lib/db"
import {
  mapDisciplines,
  mapStaffRole,
  mapStaffStatus,
  toNumber,
  toISODate,
  toISODateTime,
  toPrismaStaffRole,
} from "./enum-mappers"
import type { Certification, AvailabilitySlot, StaffMember, SubRequest } from "@/lib/types"

// ── Mappers ──────────────────────────────────────────────────────────────────

type PrismaStaffMember = Awaited<ReturnType<typeof db.staffMember.findFirst<{
  include: { classes: true; subRequests: { include: { class: true } } }
}>>>

function mapStaffMember(row: NonNullable<PrismaStaffMember>): StaffMember {
  const certifications = (row.certifications as Certification[] | null) ?? []
  const availability = (row.availability as AvailabilitySlot[] | null) ?? []

  return {
    id: row.id,
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    phone: row.phone,
    role: mapStaffRole(row.role),
    disciplines: mapDisciplines(row.disciplines),
    status: mapStaffStatus(row.status),
    payRate: toNumber(row.payRate),
    payType: row.payType as "hourly" | "per-class",
    avatar: row.avatar ?? undefined,
    hireDate: toISODate(row.hireDate),
    certifications,
    classIds: row.classes.map((c) => c.id),
    weeklyHours: toNumber(row.weeklyHours),
    monthlyCompensation: toNumber(row.monthlyCompensation),
    availability,
  }
}

type PrismaSubRequest = Awaited<ReturnType<typeof db.subRequest.findFirst<{
  include: { class: true; originalInstructor: true }
}>>>

function mapSubRequest(row: NonNullable<PrismaSubRequest>): SubRequest {
  return {
    id: row.id,
    classId: row.classId,
    className: row.class.name,
    date: toISODate(row.date),
    time: row.time,
    originalInstructor: `${row.originalInstructor.firstName} ${row.originalInstructor.lastName}`,
    status: row.status as "open" | "covered" | "cancelled",
    coveredBy: row.coveredBy ?? undefined,
  }
}

// ── Shared includes ─────────────────────────────────────────────────────────

const staffInclude = {
  classes: true,
  subRequests: { include: { class: true } },
} as const

// ── Queries ──────────────────────────────────────────────────────────────────

export async function getStaffMembers(): Promise<StaffMember[]> {
  const rows = await db.staffMember.findMany({
    include: staffInclude,
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  })
  return rows.map(mapStaffMember)
}

export async function getStaffById(id: string): Promise<StaffMember | undefined> {
  const row = await db.staffMember.findUnique({
    where: { id },
    include: staffInclude,
  })
  return row ? mapStaffMember(row) : undefined
}

export async function getStaffByRole(role: StaffMember["role"]): Promise<StaffMember[]> {
  const prismaRole = toPrismaStaffRole(role)
  const rows = await db.staffMember.findMany({
    where: { role: prismaRole },
    include: staffInclude,
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  })
  return rows.map(mapStaffMember)
}

export async function getSubRequests(): Promise<SubRequest[]> {
  const rows = await db.subRequest.findMany({
    include: { class: true, originalInstructor: true },
    orderBy: { date: "desc" },
  })
  return rows.map(mapSubRequest)
}
