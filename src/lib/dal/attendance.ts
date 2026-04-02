import { attendanceRecords as _attendanceRecords, getAttendanceByClass as _getAttendanceByClass, getAttendanceByStudent as _getAttendanceByStudent, getAttendanceByDate as _getAttendanceByDate } from "@/data/attendance-records"

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const attendanceRecords = _attendanceRecords

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getAttendanceByClass = _getAttendanceByClass

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getAttendanceByStudent = _getAttendanceByStudent

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getAttendanceByDate = _getAttendanceByDate
