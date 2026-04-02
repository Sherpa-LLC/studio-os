import { trialSlots as _trialSlots, getSlotsByDate as _getSlotsByDate, getAvailableSlots as _getAvailableSlots } from "@/data/trial-slots"

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const trialSlots = _trialSlots

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getSlotsByDate = _getSlotsByDate

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getAvailableSlots = _getAvailableSlots
