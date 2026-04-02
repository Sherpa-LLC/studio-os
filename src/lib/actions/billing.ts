"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { getActiveBillingConfig } from "@/lib/dal/billing"

// ── createInvoice ────────────────────────────────────────────────────────────

export async function createInvoice(householdId: string, data: FormData) {
  const dateStr = data.get("date") as string | null
  const dueDateStr = data.get("dueDate") as string | null

  if (!dateStr || !dueDateStr) {
    throw new Error("date and dueDate are required")
  }

  const date = new Date(dateStr)
  const dueDate = new Date(dueDateStr)

  const invoice = await db.invoice.create({
    data: {
      householdId,
      date,
      dueDate,
      subtotal: 0,
      total: 0,
      status: "pending",
    },
  })

  revalidatePath("/billing")
  revalidatePath(`/households/${householdId}`)

  return { id: invoice.id }
}

// ── addLineItem ──────────────────────────────────────────────────────────────

export async function addLineItem(invoiceId: string, data: FormData) {
  const studentId = data.get("studentId") as string | null
  const classId = data.get("classId") as string | null
  const description = data.get("description") as string | null
  const amountStr = data.get("amount") as string | null

  if (!studentId || !classId || !description || !amountStr) {
    throw new Error("studentId, classId, description, and amount are required")
  }

  const amount = parseFloat(amountStr)
  if (isNaN(amount) || amount < 0) {
    throw new Error("amount must be a non-negative number")
  }

  // Create the line item and recalculate invoice totals in a transaction
  const result = await db.$transaction(async (tx) => {
    const lineItem = await tx.invoiceLineItem.create({
      data: {
        invoiceId,
        studentId,
        classId,
        description,
        amount,
      },
    })

    await recalculateInvoiceTotals(tx, invoiceId)

    return lineItem
  })

  revalidatePath("/billing")

  return { id: result.id }
}

// ── applyOverride ────────────────────────────────────────────────────────────
// BillingOverride records are APPEND-ONLY. No update or delete actions exist.

export async function applyOverride(lineItemId: string, data: FormData) {
  const newAmountStr = data.get("newAmount") as string | null
  const reason = data.get("reason") as string | null
  const createdBy = data.get("createdBy") as string | null

  if (!newAmountStr || !reason || !createdBy) {
    throw new Error("newAmount, reason, and createdBy are required")
  }

  const newAmount = parseFloat(newAmountStr)
  if (isNaN(newAmount) || newAmount < 0) {
    throw new Error("newAmount must be a non-negative number")
  }

  const result = await db.$transaction(async (tx) => {
    // Fetch the line item to record the original amount
    const lineItem = await tx.invoiceLineItem.findUnique({
      where: { id: lineItemId },
    })

    if (!lineItem) {
      throw new Error(`Line item ${lineItemId} not found`)
    }

    // Create the immutable override record (append-only)
    const override = await tx.billingOverride.create({
      data: {
        lineItemId,
        originalAmount: Number(lineItem.amount),
        newAmount,
        reason,
        createdBy,
      },
    })

    // Recalculate the parent invoice total
    await recalculateInvoiceTotals(tx, lineItem.invoiceId)

    return override
  })

  revalidatePath("/billing")

  return { id: result.id }
}

// ── markInvoicePaid ──────────────────────────────────────────────────────────

export async function markInvoicePaid(invoiceId: string) {
  const invoice = await db.invoice.findUnique({
    where: { id: invoiceId },
  })

  if (!invoice) {
    throw new Error(`Invoice ${invoiceId} not found`)
  }

  if (invoice.status === "paid") {
    throw new Error(`Invoice ${invoiceId} is already paid`)
  }

  await db.invoice.update({
    where: { id: invoiceId },
    data: {
      status: "paid",
      paidDate: new Date(),
    },
  })

  revalidatePath("/billing")
  revalidatePath(`/households/${invoice.householdId}`)

  return { success: true }
}

// ── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Recalculate an invoice's subtotal and total based on its line items
 * and any billing overrides. Applies the monthly cap from BillingConfig.
 *
 * Must be called within a transaction context. The tx parameter accepts
 * the Prisma transaction client (which omits lifecycle methods).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function recalculateInvoiceTotals(tx: any, invoiceId: string) {
  const allLineItems = await tx.invoiceLineItem.findMany({
    where: { invoiceId },
    include: { overrides: { orderBy: { createdAt: "desc" } } },
  })

  const config = await getActiveBillingConfig()

  // Subtotal: sum of raw line item amounts (before overrides)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subtotal = allLineItems.reduce(
    (sum: number, li: any) => sum + Number(li.amount),
    0
  )

  // For the total, apply the latest override per line item, then cap
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const effectiveAmounts = allLineItems.map((li: any) => {
    if (li.overrides.length === 0) return Number(li.amount)
    // Latest override wins (already sorted desc by createdAt)
    return Number(li.overrides[0].newAmount)
  })

  const rawTotal = effectiveAmounts.reduce(
    (sum: number, amt: number) => sum + amt,
    0
  )
  const total = rawTotal > config.monthlyCap ? config.monthlyCap : rawTotal

  await tx.invoice.update({
    where: { id: invoiceId },
    data: { subtotal, total },
  })
}
