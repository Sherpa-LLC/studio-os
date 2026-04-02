import { getHouseholds } from "@/lib/dal/households"
import { getStudents } from "@/lib/dal/students"
import HouseholdsClientPage from "./client-page"

export default async function HouseholdsPage() {
  const [households, students] = await Promise.all([
    getHouseholds(),
    getStudents(),
  ])

  return <HouseholdsClientPage households={households} students={students} />
}
