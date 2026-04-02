import { getClassesByDayAsync, getClassAttendanceSummary } from "@/lib/dal/attendance"
import { getInstructorName } from "@/lib/dal/instructors"
import AttendanceClientPage from "./client-page"
import type { DayOfWeek } from "@/lib/types"

const TODAY = "2026-03-27"
const TODAY_DAY: DayOfWeek = "friday"

export default async function AttendancePage() {
  const todayClasses = await getClassesByDayAsync(TODAY_DAY)
  const activeClasses = todayClasses
    .filter((c) => c.status === "active")
    .sort((a, b) => a.schedule.startTime.localeCompare(b.schedule.startTime))

  // Pre-fetch attendance summaries and instructor names for each class
  const classesWithData = await Promise.all(
    activeClasses.map(async (cls) => ({
      cls,
      summary: await getClassAttendanceSummary(cls.id, TODAY),
      instructorName: getInstructorName(cls.instructorId),
    }))
  )

  return (
    <AttendanceClientPage
      today={TODAY}
      classesWithData={classesWithData.map(({ cls, summary, instructorName }) => ({
        id: cls.id,
        name: cls.name,
        discipline: cls.discipline,
        schedule: cls.schedule,
        enrolledCount: cls.enrolledCount,
        instructorName,
        summary,
      }))}
    />
  )
}
