import { students as _students, getStudentById as _getStudentById, getStudentsByHousehold as _getStudentsByHousehold, getStudentsByClass as _getStudentsByClass, getActiveStudents as _getActiveStudents } from "@/data/students"

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const students = _students

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getStudentById = _getStudentById

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getStudentsByHousehold = _getStudentsByHousehold

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getStudentsByClass = _getStudentsByClass

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getActiveStudents = _getActiveStudents
