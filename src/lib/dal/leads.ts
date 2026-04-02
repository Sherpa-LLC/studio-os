import { leads as _leads, getLeadsByStage as _getLeadsByStage, getLeadById as _getLeadById, searchLeads as _searchLeads } from "@/data/leads"

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const leads = _leads

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getLeadsByStage = _getLeadsByStage

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getLeadById = _getLeadById

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const searchLeads = _searchLeads
