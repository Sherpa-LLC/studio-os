"use client"

import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import { formatTime, formatDate } from "@/lib/format"
import { DISCIPLINE_LABELS } from "@/lib/constants"
import { getClassesByDay } from "@/data/classes"
import { getInstructorName } from "@/data/instructors"
import { getClassAttendanceSummary } from "@/data/attendance-records"
import { useRouter } from "next/navigation"
import { Clock, MapPin, User, ChevronRight } from "lucide-react"
import type { DayOfWeek } from "@/lib/types"

// Today is Thursday, Mar 27, 2026
const TODAY = "2026-03-27"
const TODAY_DAY: DayOfWeek = "friday"

export default function AttendancePage() {
  const router = useRouter()

  const todayClasses = getClassesByDay(TODAY_DAY)
    .filter((c) => c.status === "active")
    .sort((a, b) => a.schedule.startTime.localeCompare(b.schedule.startTime))

  return (
    <>
      <Header title="Attendance" />
      <div className="flex-1 p-6 space-y-6">
        <PageHeader
          title="Attendance"
          description={`Today's classes -- ${formatDate(TODAY)}`}
        />

        <div className="space-y-3">
          {todayClasses.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground text-sm">
                No classes scheduled for today.
              </CardContent>
            </Card>
          ) : (
            todayClasses.map((cls) => {
              const summary = getClassAttendanceSummary(cls.id, TODAY)
              const presentCount = summary.present + summary.late
              const totalEnrolled = cls.enrolledCount

              return (
                <Card
                  key={cls.id}
                  className="cursor-pointer transition-colors hover:bg-muted/30"
                  onClick={() => router.push(`/attendance/${cls.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium truncate">
                            {cls.name}
                          </h3>
                          <Badge variant="outline" className="shrink-0">
                            {DISCIPLINE_LABELS[cls.discipline]}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(cls.schedule.startTime)} -{" "}
                            {formatTime(cls.schedule.endTime)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {cls.schedule.room}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {getInstructorName(cls.instructorId)}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center gap-3">
                          <div className="flex-1 max-w-xs">
                            <Progress
                              value={
                                totalEnrolled > 0
                                  ? (presentCount / totalEnrolled) * 100
                                  : 0
                              }
                            />
                          </div>
                          <span className="text-sm font-medium shrink-0">
                            <span
                              className={
                                presentCount === totalEnrolled
                                  ? "text-emerald-600"
                                  : presentCount >= totalEnrolled * 0.8
                                    ? "text-foreground"
                                    : "text-amber-600"
                              }
                            >
                              {presentCount}
                            </span>
                            <span className="text-muted-foreground">
                              /{totalEnrolled} present
                            </span>
                          </span>
                        </div>
                      </div>

                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 ml-4" />
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </>
  )
}
