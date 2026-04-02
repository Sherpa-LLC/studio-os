import { getHouseholds, getHouseholdById } from "@/lib/dal/households"
import { getStudentsByHousehold } from "@/lib/dal/students"
import { getClasses } from "@/lib/dal/classes"
import { getInvoicesByHousehold } from "@/lib/dal/invoices"
import ClientPage from "./client-page"

export async function generateStaticParams() {
  const households = await getHouseholds()
  return households.map((hh) => ({ id: hh.id }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [household, students, classes, invoices] = await Promise.all([
    getHouseholdById(id),
    getStudentsByHousehold(id),
    getClasses(),
    getInvoicesByHousehold(id),
  ])

  return (
    <ClientPage
      household={household}
      students={students}
      classes={classes}
      invoices={invoices}
    />
  )
}
