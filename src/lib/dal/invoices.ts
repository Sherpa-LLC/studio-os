import { db } from "@/lib/db"
import { toNumber, toISODate } from "./enum-mappers"
import type { Invoice, InvoiceLineItem, BillingOverride } from "@/lib/types"

function mapOverride(o: any): BillingOverride {
  return {
    id: o.id,
    originalAmount: toNumber(o.originalAmount),
    newAmount: toNumber(o.newAmount),
    reason: o.reason,
    createdBy: o.createdBy,
    createdAt: o.createdAt.toISOString(),
  }
}

function mapLineItem(li: any): InvoiceLineItem {
  return {
    id: li.id,
    studentId: li.studentId,
    classId: li.classId,
    description: li.description,
    amount: toNumber(li.amount),
    override: li.overrides?.[0] ? mapOverride(li.overrides[0]) : undefined,
  }
}

function mapInvoice(inv: any): Invoice {
  return {
    id: inv.id,
    householdId: inv.householdId,
    date: toISODate(inv.date),
    dueDate: toISODate(inv.dueDate),
    lineItems: (inv.lineItems || []).map(mapLineItem),
    subtotal: toNumber(inv.subtotal),
    total: toNumber(inv.total),
    status: inv.status,
    paidDate: inv.paidDate ? toISODate(inv.paidDate) : undefined,
  }
}

export async function getInvoices() {
  const rows = await db.invoice.findMany({
    include: { lineItems: { include: { overrides: true } } },
    orderBy: { date: "desc" },
  })
  return rows.map(mapInvoice)
}

export async function getInvoiceById(id: string) {
  const row = await db.invoice.findUnique({
    where: { id },
    include: { lineItems: { include: { overrides: true } } },
  })
  return row ? mapInvoice(row) : undefined
}

export async function getInvoicesByHousehold(householdId: string) {
  const rows = await db.invoice.findMany({
    where: { householdId },
    include: { lineItems: { include: { overrides: true } } },
    orderBy: { date: "desc" },
  })
  return rows.map(mapInvoice)
}

export async function getInvoicesByStatus(status: string) {
  const rows = await db.invoice.findMany({
    where: { status: status as any },
    include: { lineItems: { include: { overrides: true } } },
    orderBy: { date: "desc" },
  })
  return rows.map(mapInvoice)
}

export async function getOverdueInvoices() {
  return getInvoicesByStatus("overdue")
}
