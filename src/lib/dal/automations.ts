import { automations as _automations, getAutomationById as _getAutomationById, getActiveAutomations as _getActiveAutomations } from "@/data/automations"

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const automations = _automations

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getAutomationById = _getAutomationById

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getActiveAutomations = _getActiveAutomations
