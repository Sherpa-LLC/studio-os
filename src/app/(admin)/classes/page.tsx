import { getClasses, getClassDurationHours } from "@/lib/dal/classes"
import { getInstructors, getInstructorName } from "@/lib/dal/instructors"
import ClassesClientPage from "./client-page"

export default async function ClassesPage() {
  const [classes, instructors] = await Promise.all([
    getClasses(),
    getInstructors(),
  ])

  return (
    <ClassesClientPage
      classes={classes}
      instructors={instructors}
      getInstructorName={getInstructorName}
      getClassDurationHours={getClassDurationHours}
    />
  )
}
