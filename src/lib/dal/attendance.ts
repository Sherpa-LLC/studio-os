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

// Compatibility exports for page components
import { getClassesByDay } from "@/data/classes"
import { getAttendanceByClassAndDate } from "@/data/attendance-records"
import type { DayOfWeek } from "@/lib/types"

export async function getClassesByDayAsync(day: DayOfWeek) {
  return getClassesByDay(day)
}

export async function getClassAttendanceSummary(classId: string, date: string) {
  const records = getAttendanceByClassAndDate(classId, date)
  return {
    present: records.filter(r => r.status === "present").length,
    absent: records.filter(r => r.status === "absent").length,
    late: records.filter(r => r.status === "late").length,
    excused: records.filter(r => r.status === "excused").length,
    total: records.length,
  }
}
