import { invoices as _invoices, getInvoicesByHousehold as _getInvoicesByHousehold, getInvoiceById as _getInvoiceById, getInvoicesByStatus as _getInvoicesByStatus, getOverdueInvoices as _getOverdueInvoices } from "@/data/invoices"

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const invoices = _invoices

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getInvoicesByHousehold = _getInvoicesByHousehold

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getInvoiceById = _getInvoiceById

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getInvoicesByStatus = _getInvoicesByStatus

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getOverdueInvoices = _getOverdueInvoices
