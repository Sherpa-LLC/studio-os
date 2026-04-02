import { getAllHouseholds, getHouseholdById } from "@/lib/dal/households"
import { getStudentsByHousehold } from "@/lib/dal/students"
import { getInvoicesByHousehold, getBillingOverridesByHousehold } from "@/lib/dal/invoices"
import { getAllClasses } from "@/lib/dal/classes"
import ClientPage from "./client-page"

export async function generateStaticParams() {
  const households = await getAllHouseholds()
  return households.map((hh) => ({ householdId: hh.id }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ householdId: string }>
}) {
  const { householdId } = await params
  const [household, students, invoices, overrides, classes] = await Promise.all([
    getHouseholdById(householdId),
    getStudentsByHousehold(householdId),
    getInvoicesByHousehold(householdId),
    getBillingOverridesByHousehold(householdId),
    getAllClasses(),
  ])

  return (
    <ClientPage
      household={household}
      students={students}
      invoices={invoices}
      overrides={overrides}
      classes={classes}
    />
  )
}
