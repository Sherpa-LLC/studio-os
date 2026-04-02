import { getAllClasses } from "@/lib/dal/classes"
import { getStudentsByHousehold } from "@/lib/dal/students"
import { getInstructorName } from "@/lib/dal/instructors"
import ParentDashboardClient from "./client-page"

// Anderson household (hh-001) — hardcoded until auth session is wired
const HOUSEHOLD_ID = "hh-001"

export default async function ParentDashboardPage() {
  const [allClasses, students] = await Promise.all([
    getAllClasses(),
    getStudentsByHousehold(HOUSEHOLD_ID),
  ])

  const enrolledClassIds = students.flatMap((s) => s.enrolledClassIds)
  const enrolledClasses = allClasses.filter((cls) => enrolledClassIds.includes(cls.id))

  // Pre-resolve instructor names on the server
  const instructorIds = [...new Set(enrolledClasses.map((cls) => cls.instructorId))]
  const instructorEntries = await Promise.all(
    instructorIds.map(async (id) => [id, await getInstructorName(id)] as const),
  )
  const instructorNames = Object.fromEntries(instructorEntries)

  return (
    <ParentDashboardClient
      enrolledClasses={enrolledClasses}
      instructorNames={instructorNames}
    />
  )
}
