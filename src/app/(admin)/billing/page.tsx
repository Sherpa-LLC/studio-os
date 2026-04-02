import {
  getInvoices,
  getMonthlyBilled,
  getMonthlyCollected,
  getMonthlyOutstanding,
  getMonthlyFailed,
} from "@/lib/dal/invoices"
import { getHouseholds } from "@/lib/dal/households"
import BillingClientPage from "./client-page"

const CURRENT_MONTH = "2026-03"

export default async function BillingPage() {
  const [invoices, households, totalBilled, totalCollected, totalOutstanding, totalFailed] =
    await Promise.all([
      getInvoices(),
      getHouseholds(),
      getMonthlyBilled(CURRENT_MONTH),
      getMonthlyCollected(CURRENT_MONTH),
      getMonthlyOutstanding(CURRENT_MONTH),
      getMonthlyFailed(CURRENT_MONTH),
    ])

  return (
    <BillingClientPage
      invoices={invoices}
      households={households}
      totalBilled={totalBilled}
      totalCollected={totalCollected}
      totalOutstanding={totalOutstanding}
      totalFailed={totalFailed}
    />
  )
}
