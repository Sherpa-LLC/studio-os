import { getAllStaff, getStaffById } from "@/lib/dal/staff"
import { getAllClasses } from "@/lib/dal/classes"
import ClientPage from "./client-page"

export async function generateStaticParams() {
  const staff = await getAllStaff()
  return staff.map((s) => ({ id: s.id }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [staff, classes] = await Promise.all([
    getStaffById(id),
    getAllClasses(),
  ])

  return <ClientPage staff={staff} classes={classes} />
}
