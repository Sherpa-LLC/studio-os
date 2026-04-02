import { db } from "@/lib/db"
import type {
  Invoice,
  InvoiceLineItem,
  BillingOverride,
  PaymentStatus,
} from "@/lib/types"

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Convert a Prisma Decimal to a plain number for the frontend. */
function dec(value: unknown): number {
  if (value == null) return 0
  return Number(value)
}

/** Format a Date as an ISO date string (YYYY-MM-DD). */
function isoDate(d: Date | null | undefined): string {
  if (!d) return ""
  return d.toISOString().slice(0, 10)
}

// ── Shared include shape ─────────────────────────────────────────────────────

const invoiceInclude = {
  lineItems: {
    include: {
      overrides: {
        orderBy: { createdAt: "desc" as const },
      },
    },
  },
} as const

/**
 * Map a Prisma invoice row (with nested line items and overrides) to the
 * frontend Invoice type defined in src/lib/types.ts.
 *
 * Uses `any` for the row parameter because Prisma 7's generated types
 * are deeply nested generics that don't extract cleanly. The function's
 * return type (Invoice) guarantees the output contract.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapInvoice(row: any): Invoice {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lineItems: InvoiceLineItem[] = row.lineItems.map((li: any) => {
    // The frontend type expects at most one override per line item.
    // If there are multiple (append-only audit trail), the latest one wins
    // for display purposes.
    const latestOverride =
      li.overrides.length > 0 ? li.overrides[0] : undefined

    const override: BillingOverride | undefined = latestOverride
      ? {
          id: latestOverride.id,
          originalAmount: dec(latestOverride.originalAmount),
          newAmount: dec(latestOverride.newAmount),
          reason: latestOverride.reason,
          createdBy: latestOverride.createdBy,
          createdAt: latestOverride.createdAt.toISOString(),
        }
      : undefined

    return {
      id: li.id,
      studentId: li.studentId,
      classId: li.classId,
      description: li.description,
      amount: dec(li.amount),
      override,
    }
  })

  return {
    id: row.id,
    householdId: row.householdId,
    date: isoDate(row.date),
    dueDate: isoDate(row.dueDate),
    lineItems,
    subtotal: dec(row.subtotal),
    total: dec(row.total),
    status: row.status as PaymentStatus,
    paidDate: row.paidDate ? isoDate(row.paidDate) : undefined,
  }
}

// ── Public DAL functions ─────────────────────────────────────────────────────

/** Fetch all invoices, most recent first. */
export async function getInvoices(): Promise<Invoice[]> {
  const rows = await db.invoice.findMany({
    include: invoiceInclude,
    orderBy: { date: "desc" },
  })
  return rows.map(mapInvoice)
}

/** Fetch a single invoice by ID, or null if not found. */
export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const row = await db.invoice.findUnique({
    where: { id },
    include: invoiceInclude,
  })
  return row ? mapInvoice(row) : null
}

/** Fetch all invoices for a household, most recent first. */
export async function getInvoicesByHousehold(
  householdId: string
): Promise<Invoice[]> {
  const rows = await db.invoice.findMany({
    where: { householdId },
    include: invoiceInclude,
    orderBy: { date: "desc" },
  })
  return rows.map(mapInvoice)
}

/** Fetch invoices filtered by payment status. */
export async function getInvoicesByStatus(
  status: PaymentStatus
): Promise<Invoice[]> {
  const rows = await db.invoice.findMany({
    where: { status: status as never },
    include: invoiceInclude,
    orderBy: { date: "desc" },
  })
  return rows.map(mapInvoice)
}

/**
 * Fetch overdue invoices — those with status "overdue" or those that are
 * still "pending" but past their due date.
 */
export async function getOverdueInvoices(): Promise<Invoice[]> {
  const now = new Date()
  const rows = await db.invoice.findMany({
    where: {
      OR: [
        { status: "overdue" },
        {
          status: "pending",
          dueDate: { lt: now },
        },
      ],
    },
    include: invoiceInclude,
    orderBy: { dueDate: "asc" },
  })
  return rows.map(mapInvoice)
}
