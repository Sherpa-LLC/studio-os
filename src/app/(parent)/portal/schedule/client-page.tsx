"use client"

import { useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { DISCIPLINE_COLORS, DAY_LABELS } from "@/lib/constants"
import { formatTime } from "@/lib/format"
import type { Class, DayOfWeek, Student } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Clock, MapPin, User } from "lucide-react"

const WEEK_DAYS: DayOfWeek[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]

// Determine "today" for highlighting -- use Monday as the demo day (today is 2026-03-31)
const TODAY: DayOfWeek = "monday"

interface MyScheduleClientProps {
  enrolledClasses: Class[]
  students: Student[]
  instructorNames: Record<string, string>
}

export default function MyScheduleClient({
  enrolledClasses,
  students: householdStudents,
  instructorNames,
}: MyScheduleClientProps) {
  const [weekLabel, setWeekLabel] = useState<"this" | "next">("this")

  function getChildNameForClass(classId: string): string {
    const student = householdStudents.find((s) => s.enrolledClassIds.includes(classId))
    return student?.firstName ?? ""
  }

  const classesByDay = WEEK_DAYS.reduce<Record<DayOfWeek, typeof enrolledClasses>>(
    (acc, day) => {
      acc[day] = enrolledClasses
        .filter((cls) => cls.schedule.day === day)
        .sort((a, b) => a.schedule.startTime.localeCompare(b.schedule.startTime))
      return acc
    },
    {} as Record<DayOfWeek, typeof enrolledClasses>,
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Schedule"
        description="Weekly class schedule for Emma and Lily"
      >
        <div className="flex items-center rounded-lg border bg-muted/50 p-0.5">
          <Button
            variant={weekLabel === "this" ? "default" : "ghost"}
            size="sm"
            onClick={() => setWeekLabel("this")}
          >
            This Week
          </Button>
          <Button
            variant={weekLabel === "next" ? "default" : "ghost"}
            size="sm"
            onClick={() => setWeekLabel("next")}
          >
            Next Week
          </Button>
        </div>
      </PageHeader>

      {/* Desktop: full week grid */}
      <div className="hidden md:grid md:grid-cols-6 gap-3">
        {WEEK_DAYS.map((day) => {
          const isToday = day === TODAY && weekLabel === "this"
          const dayClasses = classesByDay[day]

          return (
            <div key={day} className="space-y-2">
              <div
                className={cn(
                  "rounded-lg px-3 py-2 text-center text-sm font-medium",
                  isToday
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {DAY_LABELS[day]}
                {isToday && (
                  <span className="ml-1 text-xs opacity-80">(Today)</span>
                )}
              </div>

              {dayClasses.length > 0 ? (
                dayClasses.map((cls) => {
                  const childName = getChildNameForClass(cls.id)
                  return (
                    <div
                      key={cls.id}
                      className={cn(
                        "rounded-lg border p-2.5 space-y-1.5",
                        isToday && "bg-primary/[0.03]",
                      )}
                      style={{ borderLeftWidth: 3, borderLeftColor: DISCIPLINE_COLORS[cls.discipline] }}
                    >
                      <p className="text-xs font-medium leading-tight">{cls.name}</p>
                      <div className="space-y-0.5 text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />
                          {formatTime(cls.schedule.startTime)} - {formatTime(cls.schedule.endTime)}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-2.5 w-2.5" />
                          {cls.schedule.room}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-2.5 w-2.5" />
                          {instructorNames[cls.instructorId] ?? "TBD"}
                        </div>
                      </div>
                      {childName && (
                        <div className="flex items-center gap-1">
                          <span
                            className="inline-block h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: DISCIPLINE_COLORS[cls.discipline] }}
                          />
                          <span className="text-[11px] font-medium text-foreground/70">
                            {childName}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })
              ) : (
                <div className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
                  No classes
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile: stacked by day */}
      <div className="space-y-4 md:hidden">
        {WEEK_DAYS.map((day) => {
          const isToday = day === TODAY && weekLabel === "this"
          const dayClasses = classesByDay[day]

          if (dayClasses.length === 0) return null

          return (
            <div key={day}>
              <div
                className={cn(
                  "rounded-t-lg px-3 py-2 text-sm font-medium",
                  isToday
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {DAY_LABELS[day]}
                {isToday && (
                  <span className="ml-2 text-xs opacity-80">Today</span>
                )}
              </div>
              <div className="space-y-0 rounded-b-lg border border-t-0">
                {dayClasses.map((cls, i) => {
                  const childName = getChildNameForClass(cls.id)
                  return (
                    <div
                      key={cls.id}
                      className={cn(
                        "flex items-center gap-3 p-3",
                        i < dayClasses.length - 1 && "border-b",
                      )}
                    >
                      <div
                        className="h-12 w-1 shrink-0 rounded-full"
                        style={{ backgroundColor: DISCIPLINE_COLORS[cls.discipline] }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{cls.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatTime(cls.schedule.startTime)} - {formatTime(cls.schedule.endTime)}
                          {" "}&middot;{" "}{cls.schedule.room}
                          {" "}&middot;{" "}{instructorNames[cls.instructorId] ?? "TBD"}
                        </p>
                        {childName && (
                          <p className="text-xs font-medium text-foreground/70 mt-0.5">
                            {childName}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
