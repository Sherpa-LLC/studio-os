import { billingConfig as _billingConfig, billingOverrides as _billingOverrides, getOverrideById as _getOverrideById, calculateMonthlyTotal as _calculateMonthlyTotal } from "@/data/billing-rules"

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const billingConfig = _billingConfig

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const billingOverrides = _billingOverrides

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getOverrideById = _getOverrideById

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const calculateMonthlyTotal = _calculateMonthlyTotal
