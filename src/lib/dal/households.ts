import { households as _households, getHouseholdById as _getHouseholdById, searchHouseholds as _searchHouseholds, getHouseholdsByStatus as _getHouseholdsByStatus, getHouseholdsWithBalance as _getHouseholdsWithBalance } from "@/data/households"

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const households = _households

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getHouseholdById = _getHouseholdById

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const searchHouseholds = _searchHouseholds

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getHouseholdsByStatus = _getHouseholdsByStatus

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getHouseholdsWithBalance = _getHouseholdsWithBalance
