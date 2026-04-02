import { dashboardStats as _dashboardStats, leadSourceAnalytics as _leadSourceAnalytics } from "@/data/dashboard-stats"

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const dashboardStats = _dashboardStats

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const leadSourceAnalytics = _leadSourceAnalytics
