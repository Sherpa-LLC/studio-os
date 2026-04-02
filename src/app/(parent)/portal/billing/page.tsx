import { getHouseholdById } from "@/lib/dal/households"
import { getStudentsByHousehold } from "@/lib/dal/students"
import { getInvoicesByHousehold } from "@/lib/dal/invoices"
import { getAllClasses } from "@/lib/dal/classes"
import { notFound } from "next/navigation"
import MyBillingClient from "./client-page"

// Anderson household (hh-001) — hardcoded until auth session is wired
const HOUSEHOLD_ID = "hh-001"

export default async function MyBillingPage() {
  const [household, students, invoices, allClasses] = await Promise.all([
    getHouseholdById(HOUSEHOLD_ID),
    getStudentsByHousehold(HOUSEHOLD_ID),
    getInvoicesByHousehold(HOUSEHOLD_ID),
    getAllClasses(),
  ])

  if (!household) notFound()

  const sortedInvoices = [...invoices].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <MyBillingClient
      household={household}
      invoices={sortedInvoices}
      students={students}
      classes={allClasses}
    />
  )
}
