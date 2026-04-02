"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function applyOverride(lineItemId: string, data: FormData) {
  await db.billingOverride.create({
    data: {
      lineItemId,
      originalAmount: parseFloat(data.get("originalAmount") as string),
      newAmount: parseFloat(data.get("newAmount") as string),
      reason: data.get("reason") as string,
      createdBy: data.get("createdBy") as string || "system",
    },
  })
  revalidatePath("/billing")
}

export async function markInvoicePaid(invoiceId: string) {
  await db.invoice.update({
    where: { id: invoiceId },
    data: { status: "paid", paidDate: new Date() },
  })
  revalidatePath("/billing")
}
