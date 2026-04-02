import { seasons as _seasons, getSeasonById as _getSeasonById, getActiveSeason as _getActiveSeason, getSeasonsByStatus as _getSeasonsByStatus } from "@/data/seasons"

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const seasons = _seasons

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getSeasonById = _getSeasonById

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getActiveSeason = _getActiveSeason

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getSeasonsByStatus = _getSeasonsByStatus
