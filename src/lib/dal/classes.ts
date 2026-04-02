import { classes as _classes, getClassById as _getClassById, getClassesByDay as _getClassesByDay, getClassDurationHours as _getClassDurationHours, getClassMonthlyTuition as _getClassMonthlyTuition } from "@/data/classes"

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const classes = _classes

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getClassById = _getClassById

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getClassesByDay = _getClassesByDay

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getClassDurationHours = _getClassDurationHours

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getClassMonthlyTuition = _getClassMonthlyTuition
