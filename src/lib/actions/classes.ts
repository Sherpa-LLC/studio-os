"use server"

import { db } from "@/lib/db"
import {
  disciplineFromFrontend,
  ageGroupFromFrontend,
  roomFromFrontend,
} from "@/lib/dal/classes"
import {
  Discipline as PrismaDiscipline,
  AgeGroup as PrismaAgeGroup,
  Room as PrismaRoom,
  DayOfWeek as PrismaDayOfWeek,
  ClassStatus as PrismaClassStatus,
} from "@/generated/prisma/enums"
import { revalidatePath } from "next/cache"

// ── Create ───────────────────────────────────────────────────────────────────

export async function createClass(data: FormData) {
  const name = data.get("name") as string
  const discipline = data.get("discipline") as string
  const ageGroup = data.get("ageGroup") as string
  const description = (data.get("description") as string) ?? ""
  const instructorId = data.get("instructorId") as string
  const seasonId = data.get("seasonId") as string
  const capacity = Number(data.get("capacity"))
  const monthlyRate = Number(data.get("monthlyRate"))
  const ageRangeMin = Number(data.get("ageRangeMin"))
  const ageRangeMax = Number(data.get("ageRangeMax"))
  const day = data.get("day") as string
  const startTime = data.get("startTime") as string
  const endTime = data.get("endTime") as string
  const room = data.get("room") as string

  if (!name || !discipline || !ageGroup || !instructorId || !seasonId) {
    throw new Error("Missing required fields: name, discipline, ageGroup, instructorId, seasonId")
  }

  const prismaDiscipline = (disciplineFromFrontend as Record<string, string>)[discipline] ?? discipline
  const prismaAgeGroup = (ageGroupFromFrontend as Record<string, string>)[ageGroup] ?? ageGroup
  const prismaRoom = (roomFromFrontend as Record<string, string>)[room] ?? room

  const created = await db.class.create({
    data: {
      name,
      discipline: prismaDiscipline as typeof PrismaDiscipline[keyof typeof PrismaDiscipline],
      ageGroup: prismaAgeGroup as typeof PrismaAgeGroup[keyof typeof PrismaAgeGroup],
      description,
      instructorId,
      seasonId,
      capacity,
      monthlyRate,
      ageRangeMin,
      ageRangeMax,
      schedules: {
        create: {
          day: day as typeof PrismaDayOfWeek[keyof typeof PrismaDayOfWeek],
          startTime,
          endTime,
          room: prismaRoom as typeof PrismaRoom[keyof typeof PrismaRoom],
        },
      },
    },
  })

  revalidatePath("/classes")
  return created.id
}

// ── Update ───────────────────────────────────────────────────────────────────

export async function updateClass(id: string, data: FormData) {
  const updateData: Record<string, unknown> = {}

  const name = data.get("name") as string | null
  if (name) updateData.name = name

  const discipline = data.get("discipline") as string | null
  if (discipline) {
    updateData.discipline = (disciplineFromFrontend as Record<string, string>)[discipline] ?? discipline
  }

  const ageGroup = data.get("ageGroup") as string | null
  if (ageGroup) {
    updateData.ageGroup = (ageGroupFromFrontend as Record<string, string>)[ageGroup] ?? ageGroup
  }

  const description = data.get("description") as string | null
  if (description !== null) updateData.description = description

  const instructorId = data.get("instructorId") as string | null
  if (instructorId) updateData.instructorId = instructorId

  const capacity = data.get("capacity") as string | null
  if (capacity) updateData.capacity = Number(capacity)

  const monthlyRate = data.get("monthlyRate") as string | null
  if (monthlyRate) updateData.monthlyRate = Number(monthlyRate)

  const ageRangeMin = data.get("ageRangeMin") as string | null
  if (ageRangeMin) updateData.ageRangeMin = Number(ageRangeMin)

  const ageRangeMax = data.get("ageRangeMax") as string | null
  if (ageRangeMax) updateData.ageRangeMax = Number(ageRangeMax)

  const status = data.get("status") as string | null
  if (status) updateData.status = status as typeof PrismaClassStatus[keyof typeof PrismaClassStatus]

  await db.class.update({ where: { id }, data: updateData })

  // Update schedule if any schedule fields are provided
  const day = data.get("day") as string | null
  const startTime = data.get("startTime") as string | null
  const endTime = data.get("endTime") as string | null
  const room = data.get("room") as string | null

  if (day || startTime || endTime || room) {
    const existingSchedule = await db.classSchedule.findFirst({ where: { classId: id } })
    const scheduleUpdate: Record<string, unknown> = {}

    if (day) scheduleUpdate.day = day as typeof PrismaDayOfWeek[keyof typeof PrismaDayOfWeek]
    if (startTime) scheduleUpdate.startTime = startTime
    if (endTime) scheduleUpdate.endTime = endTime
    if (room) {
      scheduleUpdate.room = (roomFromFrontend as Record<string, string>)[room] ?? room
    }

    if (existingSchedule) {
      await db.classSchedule.update({
        where: { id: existingSchedule.id },
        data: scheduleUpdate,
      })
    } else {
      await db.classSchedule.create({
        data: {
          classId: id,
          day: (day ?? "monday") as typeof PrismaDayOfWeek[keyof typeof PrismaDayOfWeek],
          startTime: startTime ?? "00:00",
          endTime: endTime ?? "00:00",
          room: ((roomFromFrontend as Record<string, string>)[room ?? ""] ?? "studio_a") as typeof PrismaRoom[keyof typeof PrismaRoom],
        },
      })
    }
  }

  revalidatePath("/classes")
  revalidatePath(`/classes/${id}`)
}

// ── Delete ───────────────────────────────────────────────────────────────────

export async function deleteClass(id: string) {
  await db.class.delete({ where: { id } })

  revalidatePath("/classes")
}
