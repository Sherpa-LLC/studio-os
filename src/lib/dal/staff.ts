import { staffMembers as _staffMembers, getStaffById as _getStaffById, subRequests as _subRequests } from "@/data/staff"

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const staffMembers = _staffMembers

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getStaffById = _getStaffById

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const subRequests = _subRequests
