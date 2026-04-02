import { getHouseholdById } from "@/lib/dal/households"
import { getStudentsByHousehold } from "@/lib/dal/students"
import { getInvoicesByHousehold } from "@/lib/dal/invoices"
import { getClasses } from "@/lib/dal/classes"
import ClientPage from "./client-page"

export default async function Page({
  params,
}: {
  params: Promise<{ householdId: string }>
}) {
  const { householdId } = await params
  const [household, students, invoices, classes] = await Promise.all([
    getHouseholdById(householdId),
    getStudentsByHousehold(householdId),
    getInvoicesByHousehold(householdId),
    getClasses(),
  ])
  return (
    <ClientPage
      household={household}
      students={students}
      invoices={invoices}
      overrides={[]}
      classes={classes}
    />
  )
}
