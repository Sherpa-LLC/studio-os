import { getHouseholdById } from "@/lib/dal/households"
import { getStudentsByHousehold } from "@/lib/dal/students"
import { getAllClasses } from "@/lib/dal/classes"
import { notFound } from "next/navigation"
import MyHouseholdClient from "./client-page"

// Anderson household (hh-001) — hardcoded until auth session is wired
const HOUSEHOLD_ID = "hh-001"

export default async function MyHouseholdPage() {
  const [household, students, allClasses] = await Promise.all([
    getHouseholdById(HOUSEHOLD_ID),
    getStudentsByHousehold(HOUSEHOLD_ID),
    getAllClasses(),
  ])

  if (!household) notFound()

  return (
    <MyHouseholdClient
      household={household}
      students={students}
      classes={allClasses}
    />
  )
}
