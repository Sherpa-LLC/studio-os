import { getStaffMembers } from "@/lib/dal/staff"
import ClientPage from "./client-page"

export default async function Page() {
  const staffMembers = await getStaffMembers()
  return <ClientPage staffMembers={staffMembers} />
}
