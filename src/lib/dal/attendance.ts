import { db } from "@/lib/db"
import type { AttendanceRecord } from "@/lib/types"

function mapRecord(r: any): AttendanceRecord {
  return {
    id: r.id,
    classId: r.classId,
    studentId: r.studentId,
    date: r.date.toISOString().split("T")[0],
    status: r.status,
    markedBy: r.markedBy,
    markedAt: r.markedAt.toISOString(),
  }
}

export async function getAttendanceRecords() {
  const rows = await db.attendanceRecord.findMany({ orderBy: { date: "desc" } })
  return rows.map(mapRecord)
}

export async function getAttendanceByClass(classId: string, date?: string) {
  const where: any = { classId }
  if (date) where.date = new Date(date)
  const rows = await db.attendanceRecord.findMany({ where, orderBy: { markedAt: "desc" } })
  return rows.map(mapRecord)
}

export async function getAttendanceByStudent(studentId: string) {
  const rows = await db.attendanceRecord.findMany({ where: { studentId }, orderBy: { date: "desc" } })
  return rows.map(mapRecord)
}

export async function getAttendanceByDate(date: string) {
  const rows = await db.attendanceRecord.findMany({ where: { date: new Date(date) }, orderBy: { classId: "asc" } })
  return rows.map(mapRecord)
}
