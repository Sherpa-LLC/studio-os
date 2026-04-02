import { instructors as _instructors, getInstructorById as _getInstructorById, getInstructorsByDiscipline as _getInstructorsByDiscipline, getInstructorName as _getInstructorName } from "@/data/instructors"

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const instructors = _instructors

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getInstructorById = _getInstructorById

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getInstructorsByDiscipline = _getInstructorsByDiscipline

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getInstructorName = _getInstructorName
