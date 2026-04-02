import { getClasses } from "@/lib/dal/classes"
import { getInstructorName } from "@/lib/dal/instructors"
import RegisterClassesClient from "./client-page"

export default async function RegisterClassesPage() {
  const allClasses = await getClasses()

  // Pre-resolve instructor names on the server
  const instructorIds = [...new Set(allClasses.map((cls) => cls.instructorId))]
  const instructorEntries = await Promise.all(
    instructorIds.map(async (id) => [id, await getInstructorName(id)] as const),
  )
  const instructorNames = Object.fromEntries(instructorEntries)

  return (
    <RegisterClassesClient
      classes={allClasses}
      instructorNames={instructorNames}
    />
  )
}
