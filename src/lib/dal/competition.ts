import { teams as _teams, getTeamById as _getTeamById } from "@/data/competition"

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const teams = _teams

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getTeamById = _getTeamById
