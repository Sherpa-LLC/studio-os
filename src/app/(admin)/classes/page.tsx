import { getClasses } from "@/lib/dal/classes"
import { getInstructors } from "@/lib/dal/instructors"
import { getClassDurationHours } from "@/data/classes"
import ClassesClientPage from "./client-page"

export default async function ClassesPage() {
  const [classes, instructors] = await Promise.all([
    getClasses(),
    getInstructors(),
  ])

  // Pre-compute maps so we don't pass functions to client
  const instructorNameMap: Record<string, string> = {}
  for (const inst of instructors) {
    instructorNameMap[inst.id] = `${inst.firstName} ${inst.lastName}`
  }

  const classDurationMap: Record<string, number> = {}
  for (const cls of classes) {
    classDurationMap[cls.id] = getClassDurationHours(cls)
  }

  return (
    <ClassesClientPage
      classes={classes}
      instructors={instructors}
      instructorNameMap={instructorNameMap}
      classDurationMap={classDurationMap}
    />
  )
}
