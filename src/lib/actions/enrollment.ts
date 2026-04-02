"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

// ── Enroll ───────────────────────────────────────────────────────────────────

export async function enrollStudent(studentId: string, classId: string) {
  // Check class capacity
  const cls = await db.class.findUnique({
    where: { id: classId },
    select: {
      capacity: true,
      _count: { select: { enrollments: { where: { status: "active" } } } },
    },
  })

  if (!cls) {
    throw new Error(`Class ${classId} not found`)
  }

  const activeCount = cls._count?.enrollments ?? 0
  const isFull = activeCount >= cls.capacity

  // If class is full, add to waitlist instead
  const status = isFull ? "waitlisted" : "active"

  const enrollment = await db.enrollment.upsert({
    where: {
      studentId_classId: { studentId, classId },
    },
    update: {
      status,
      enrolledAt: new Date(),
    },
    create: {
      studentId,
      classId,
      status,
    },
  })

  revalidatePath("/classes")
  revalidatePath(`/classes/${classId}`)
  revalidatePath("/households")

  return { id: enrollment.id, status }
}

// ── Withdraw ─────────────────────────────────────────────────────────────────

export async function withdrawStudent(studentId: string, classId: string) {
  const enrollment = await db.enrollment.findUnique({
    where: {
      studentId_classId: { studentId, classId },
    },
  })

  if (!enrollment) {
    throw new Error(`No enrollment found for student ${studentId} in class ${classId}`)
  }

  await db.enrollment.update({
    where: { id: enrollment.id },
    data: { status: "withdrawn" },
  })

  // Promote the first waitlisted student if any
  const nextWaitlisted = await db.enrollment.findFirst({
    where: { classId, status: "waitlisted" },
    orderBy: { enrolledAt: "asc" },
  })

  if (nextWaitlisted) {
    await db.enrollment.update({
      where: { id: nextWaitlisted.id },
      data: { status: "active" },
    })
  }

  revalidatePath("/classes")
  revalidatePath(`/classes/${classId}`)
  revalidatePath("/households")
}
