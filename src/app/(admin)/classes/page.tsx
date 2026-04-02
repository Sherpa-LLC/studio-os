import { getClasses } from "@/lib/dal/classes"
import { getInstructors } from "@/lib/dal/instructors"
import { getClassDurationHours } from "@/data/classes"
import ClassesClientPage from "./client-page"

export default async function ClassesPage() {
  const [classes, instructors] = await Promise.all([
    getClasses(),
    getInstructors(),
  ])

  // Build sync name lookup for client component
  const nameMap: Record<string, string> = {}
  for (const inst of instructors) {
    nameMap[inst.id] = `${inst.firstName} ${inst.lastName}`
  }
  const getInstructorName = (id: string) => nameMap[id] ?? "Unknown"

  return (
    <ClassesClientPage
      classes={classes}
      instructors={instructors}
      getInstructorName={getInstructorName}
      getClassDurationHours={getClassDurationHours}
    />
  )
}
