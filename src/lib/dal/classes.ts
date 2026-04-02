import { db } from "@/lib/db"
import { Prisma } from "@/generated/prisma/client"
import type {
  Class,
  AgeGroup,
  DayOfWeek,
  Discipline,
} from "@/lib/types"
import {
  Discipline as PrismaDiscipline,
  AgeGroup as PrismaAgeGroup,
  Room as PrismaRoom,
  DayOfWeek as PrismaDayOfWeek,
  ClassStatus as PrismaClassStatus,
} from "@/generated/prisma/enums"

// ── Enum Mappers: Prisma → Frontend ──────────────────────────────────────────

const disciplineToFrontend: Record<string, Discipline> = {
  [PrismaDiscipline.ballet]: "ballet",
  [PrismaDiscipline.jazz]: "jazz",
  [PrismaDiscipline.tap]: "tap",
  [PrismaDiscipline.contemporary]: "contemporary",
  [PrismaDiscipline.hip_hop]: "hip-hop",
  [PrismaDiscipline.lyrical]: "lyrical",
  [PrismaDiscipline.acro]: "acro",
  [PrismaDiscipline.musical_theatre]: "musical-theatre",
  [PrismaDiscipline.pointe]: "pointe",
}

const disciplineFromFrontend: Record<Discipline, string> = {
  "ballet": PrismaDiscipline.ballet,
  "jazz": PrismaDiscipline.jazz,
  "tap": PrismaDiscipline.tap,
  "contemporary": PrismaDiscipline.contemporary,
  "hip-hop": PrismaDiscipline.hip_hop,
  "lyrical": PrismaDiscipline.lyrical,
  "acro": PrismaDiscipline.acro,
  "musical-theatre": PrismaDiscipline.musical_theatre,
  "pointe": PrismaDiscipline.pointe,
}

const ageGroupToFrontend: Record<string, AgeGroup> = {
  [PrismaAgeGroup.tiny_tots]: "tiny-tots",
  [PrismaAgeGroup.minis]: "minis",
  [PrismaAgeGroup.juniors]: "juniors",
  [PrismaAgeGroup.teens]: "teens",
  [PrismaAgeGroup.seniors]: "seniors",
  [PrismaAgeGroup.adults]: "adults",
}

const ageGroupFromFrontend: Record<AgeGroup, string> = {
  "tiny-tots": PrismaAgeGroup.tiny_tots,
  "minis": PrismaAgeGroup.minis,
  "juniors": PrismaAgeGroup.juniors,
  "teens": PrismaAgeGroup.teens,
  "seniors": PrismaAgeGroup.seniors,
  "adults": PrismaAgeGroup.adults,
}

const roomToFrontend: Record<string, Class["schedule"]["room"]> = {
  [PrismaRoom.studio_a]: "Studio A",
  [PrismaRoom.studio_b]: "Studio B",
  [PrismaRoom.studio_c]: "Studio C",
  [PrismaRoom.studio_d]: "Studio D",
}

const roomFromFrontend: Record<string, string> = {
  "Studio A": PrismaRoom.studio_a,
  "Studio B": PrismaRoom.studio_b,
  "Studio C": PrismaRoom.studio_c,
  "Studio D": PrismaRoom.studio_d,
}

// Re-export mappers so server actions can reuse them
export {
  disciplineToFrontend,
  disciplineFromFrontend,
  ageGroupToFrontend,
  ageGroupFromFrontend,
  roomToFrontend,
  roomFromFrontend,
}

// ── Row → Frontend Mapper ────────────────────────────────────────────────────

type ClassRow = Awaited<ReturnType<typeof queryClasses>>[number]

function mapClassRow(row: ClassRow): Class {
  const schedule = row.schedules[0]
  return {
    id: row.id,
    name: row.name,
    discipline: disciplineToFrontend[row.discipline] ?? (row.discipline as Discipline),
    ageGroup: ageGroupToFrontend[row.ageGroup] ?? (row.ageGroup as AgeGroup),
    description: row.description,
    instructorId: row.instructorId,
    seasonId: row.seasonId,
    schedule: schedule
      ? {
          day: schedule.day as DayOfWeek,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          room: roomToFrontend[schedule.room] ?? (schedule.room as Class["schedule"]["room"]),
        }
      : { day: "monday", startTime: "00:00", endTime: "00:00", room: "Studio A" },
    capacity: row.capacity,
    enrolledCount: row._count?.enrollments ?? 0,
    waitlistCount: row._waitlistCount ?? 0,
    monthlyRate: Number(row.monthlyRate),
    ageRange: { min: row.ageRangeMin, max: row.ageRangeMax },
    status: row.status as Class["status"],
  }
}

// ── Prisma Query (shared include/select) ─────────────────────────────────────

async function queryClasses(where?: Prisma.ClassWhereInput) {
  const rows = await db.class.findMany({
    where,
    include: {
      schedules: true,
      instructor: { select: { firstName: true, lastName: true } },
      _count: { select: { enrollments: true } },
    },
    orderBy: { name: "asc" },
  })

  // Compute waitlist counts in a second pass (Prisma can't filter _count inline on related status)
  const classIds = rows.map((r) => r.id)
  const waitlistCounts = await db.enrollment.groupBy({
    by: ["classId"],
    where: { classId: { in: classIds }, status: "waitlisted" },
    _count: true,
  })
  const waitlistMap = new Map(waitlistCounts.map((w) => [w.classId, w._count]))

  return rows.map((r) => ({
    ...r,
    _waitlistCount: waitlistMap.get(r.id) ?? 0,
  }))
}

// ── Public API (matches previous mock-data interface) ────────────────────────

export async function getClasses(): Promise<Class[]> {
  const rows = await queryClasses()
  return rows.map(mapClassRow)
}

export async function getClassById(id: string): Promise<Class | undefined> {
  const rows = await queryClasses({ id })
  return rows[0] ? mapClassRow(rows[0]) : undefined
}

export async function getClassesByDay(day: DayOfWeek): Promise<Class[]> {
  const rows = await queryClasses({
    schedules: { some: { day: day as unknown as typeof PrismaDayOfWeek[keyof typeof PrismaDayOfWeek] } },
  })
  return rows.map(mapClassRow)
}

export async function getClassesByDiscipline(discipline: Discipline): Promise<Class[]> {
  const prismaDisc = disciplineFromFrontend[discipline]
  const rows = await queryClasses({
    discipline: prismaDisc as typeof PrismaDiscipline[keyof typeof PrismaDiscipline],
  })
  return rows.map(mapClassRow)
}

export async function getClassesByAgeGroup(ageGroup: AgeGroup): Promise<Class[]> {
  const prismaAg = ageGroupFromFrontend[ageGroup]
  const rows = await queryClasses({
    ageGroup: prismaAg as typeof PrismaAgeGroup[keyof typeof PrismaAgeGroup],
  })
  return rows.map(mapClassRow)
}

export async function getClassesByInstructor(instructorId: string): Promise<Class[]> {
  const rows = await queryClasses({ instructorId })
  return rows.map(mapClassRow)
}

export async function getClassesByRoom(room: Class["schedule"]["room"]): Promise<Class[]> {
  const prismaRoom = roomFromFrontend[room]
  const rows = await queryClasses({
    schedules: { some: { room: prismaRoom as typeof PrismaRoom[keyof typeof PrismaRoom] } },
  })
  return rows.map(mapClassRow)
}

export async function searchClasses(query: string): Promise<Class[]> {
  const q = query.toLowerCase()
  const rows = await queryClasses({
    OR: [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ],
  })
  return rows.map(mapClassRow)
}

export async function getActiveClasses(): Promise<Class[]> {
  const rows = await queryClasses({ status: PrismaClassStatus.active })
  return rows.map(mapClassRow)
}

// ── Pure helpers (no DB needed) ──────────────────────────────────────────────

function parseTime(t: string): number {
  const [h, m] = t.split(":").map(Number)
  return h * 60 + m
}

export function getClassDurationHours(cls: Class): number {
  const mins = parseTime(cls.schedule.endTime) - parseTime(cls.schedule.startTime)
  return mins / 60
}

export async function getClassMonthlyTuition(cls: Class): Promise<number> {
  const config = await db.billingConfig.findFirst({ where: { isActive: true } })
  const hourlyRate = config ? Number(config.hourlyRate) : 95
  return +(getClassDurationHours(cls) * hourlyRate).toFixed(2)
}
