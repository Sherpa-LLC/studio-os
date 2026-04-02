import { getStaffMembers, getStaffById } from "@/lib/dal/staff"
import { getClasses } from "@/lib/dal/classes"
import ClientPage from "./client-page"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [staff, classes] = await Promise.all([
    getStaffById(id),
    getClasses(),
  ])

  return <ClientPage staff={staff} classes={classes} />
}
