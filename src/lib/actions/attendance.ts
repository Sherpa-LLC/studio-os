"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function markAttendance(classId: string, studentId: string, date: string, status: string) {
  await db.attendanceRecord.upsert({
    where: { classId_studentId_date: { classId, studentId, date: new Date(date) } },
    update: { status: status as any, markedAt: new Date() },
    create: {
      classId,
      studentId,
      date: new Date(date),
      status: status as any,
      markedBy: "system",
      markedAt: new Date(),
    },
  })
  revalidatePath("/attendance")
}

export async function bulkMarkAttendance(classId: string, date: string, records: { studentId: string; status: string }[]) {
  await db.$transaction(
    records.map(r =>
      db.attendanceRecord.upsert({
        where: { classId_studentId_date: { classId, studentId: r.studentId, date: new Date(date) } },
        update: { status: r.status as any, markedAt: new Date() },
        create: {
          classId,
          studentId: r.studentId,
          date: new Date(date),
          status: r.status as any,
          markedBy: "system",
        },
      })
    )
  )
  revalidatePath("/attendance")
}
