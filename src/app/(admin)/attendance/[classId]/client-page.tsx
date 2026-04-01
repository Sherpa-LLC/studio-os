"use client"

import { useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { formatTime, formatDate, getInitials } from "@/lib/format"
import { DISCIPLINE_LABELS, DISCIPLINE_COLORS, DAY_LABELS } from "@/lib/constants"
import { getClassById } from "@/data/classes"
import { getStudentsByClass } from "@/data/students"
import { getInstructorName } from "@/data/instructors"
import { getAttendanceByClass } from "@/data/attendance-records"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  ArrowLeft,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Users,
  Save,
  MessageSquare,
} from "lucide-react"
import type { AttendanceStatus } from "@/lib/types"

const WEEK_DATES = [
  "2026-03-23",
  "2026-03-24",
  "2026-03-25",
  "2026-03-26",
  "2026-03-27",
]

const STATUS_OPTIONS: { value: AttendanceStatus; label: string; shortLabel: string }[] = [
  { value: "present", label: "Present", shortLabel: "P" },
  { value: "absent", label: "Absent", shortLabel: "A" },
  { value: "late", label: "Late", shortLabel: "L" },
  { value: "excused", label: "Excused", shortLabel: "E" },
]

function getStatusColor(status: AttendanceStatus): string {
  switch (status) {
    case "present":
      return "bg-emerald-500 text-white hover:bg-emerald-600"
    case "absent":
      return "bg-red-500 text-white hover:bg-red-600"
    case "late":
      return "bg-amber-500 text-white hover:bg-amber-600"
    case "excused":
      return "bg-blue-500 text-white hover:bg-blue-600"
  }
}

function getStatusOutlineColor(status: AttendanceStatus): string {
  switch (status) {
    case "present":
      return "border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
    case "absent":
      return "border-red-300 text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
    case "late":
      return "border-amber-300 text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20"
    case "excused":
      return "border-blue-300 text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
  }
}

// Pre-staged notes for specific students
const INITIAL_NOTES: Record<string, string> = {
  "stu-017": "Left early - parent pickup at 4:30",
}

export default function ClassAttendancePage({
  params,
}: {
  params: { classId: string }
}) {
  const { classId } = params
  const router = useRouter()

  const cls = getClassById(classId)

  // Get enrolled students (active + trial)
  let enrolledStudents = getStudentsByClass(classId).filter(
    (s) => s.enrollmentStatus === "active" || s.enrollmentStatus === "trial",
  )

  // If fewer than 18 students enrolled, supplement with a local mock roster
  // to meet the spec requirement of 18 students
  const MOCK_ROSTER = [
    { id: "mock-01", firstName: "Sophia", lastName: "Bennett", enrollmentStatus: "active" as const },
    { id: "mock-02", firstName: "Avery", lastName: "Collins", enrollmentStatus: "active" as const },
    { id: "mock-03", firstName: "Harper", lastName: "Hayes", enrollmentStatus: "active" as const },
    { id: "mock-04", firstName: "Luna", lastName: "Mitchell", enrollmentStatus: "active" as const },
    { id: "mock-05", firstName: "Penelope", lastName: "Reeves", enrollmentStatus: "active" as const },
    { id: "mock-06", firstName: "Isla", lastName: "Fernandez", enrollmentStatus: "active" as const },
    { id: "mock-07", firstName: "Violet", lastName: "Warren", enrollmentStatus: "active" as const },
    { id: "mock-08", firstName: "Aurora", lastName: "Blake", enrollmentStatus: "active" as const },
    { id: "mock-09", firstName: "Stella", lastName: "Price", enrollmentStatus: "active" as const },
    { id: "mock-10", firstName: "Cora", lastName: "James", enrollmentStatus: "active" as const },
    { id: "mock-11", firstName: "Ruby", lastName: "Stone", enrollmentStatus: "active" as const },
    { id: "mock-12", firstName: "Aria", lastName: "Knight", enrollmentStatus: "active" as const },
    { id: "mock-13", firstName: "Sadie", lastName: "Fox", enrollmentStatus: "active" as const },
    { id: "mock-14", firstName: "Daisy", lastName: "Hart", enrollmentStatus: "active" as const },
    { id: "mock-15", firstName: "Clara", lastName: "Wood", enrollmentStatus: "active" as const },
    { id: "mock-16", firstName: "Nora", lastName: "Park", enrollmentStatus: "active" as const },
    { id: "mock-17", firstName: "Eliza", lastName: "Ross", enrollmentStatus: "active" as const },
    { id: "mock-18", firstName: "Ivy", lastName: "Cole", enrollmentStatus: "active" as const },
  ]

  // Pad to 18 if needed
  type StudentLike = {
    id: string
    firstName: string
    lastName: string
    enrollmentStatus: string
  }

  const rosterStudents: StudentLike[] =
    enrolledStudents.length >= 18
      ? enrolledStudents
      : [
          ...enrolledStudents,
          ...MOCK_ROSTER.slice(0, 18 - enrolledStudents.length),
        ]

  // Determine which day this class runs on, find the matching date this week
  const classDay = cls?.schedule.day
  const dayIndex = classDay
    ? ["monday", "tuesday", "wednesday", "thursday", "friday"].indexOf(classDay)
    : -1
  const defaultDate = dayIndex >= 0 ? WEEK_DATES[dayIndex] : WEEK_DATES[4]

  const [selectedDate, setSelectedDate] = useState(defaultDate)

  // Load existing records for this class/date
  const existingRecords = getAttendanceByClass(classId, selectedDate)

  // Pre-stage attendance: 10 present, 2 late, 1 excused, 1 absent, 4 unmarked (null)
  function buildInitialState(): Record<string, AttendanceStatus | null> {
    const state: Record<string, AttendanceStatus | null> = {}
    rosterStudents.forEach((student, i) => {
      // Check for existing record first
      const record = existingRecords.find((r) => r.studentId === student.id)
      if (record) {
        state[student.id] = record.status
        return
      }
      // Pre-stage per spec: 10 present, 2 late, 1 excused, 1 absent, 4 unmarked
      if (i < 10) state[student.id] = "present"
      else if (i < 12) state[student.id] = "late"
      else if (i === 12) state[student.id] = "excused"
      else if (i === 13) state[student.id] = "absent"
      else state[student.id] = null // unmarked
    })
    return state
  }

  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus | null>>(buildInitialState)
  const [notes, setNotes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    for (const student of rosterStudents) {
      initial[student.id] = INITIAL_NOTES[student.id] ?? ""
    }
    return initial
  })

  if (!cls) {
    return (
      <div className="flex-1 p-6">
        <p className="text-muted-foreground">Class not found.</p>
      </div>
    )
  }

  // Compute summary stats
  const totalStudents = rosterStudents.length
  const presentCount = Object.values(attendance).filter((s) => s === "present").length
  const lateCount = Object.values(attendance).filter((s) => s === "late").length
  const absentCount = Object.values(attendance).filter((s) => s === "absent").length
  const excusedCount = Object.values(attendance).filter((s) => s === "excused").length
  const unmarkedCount = Object.values(attendance).filter((s) => s === null).length
  const markedCount = totalStudents - unmarkedCount

  function toggleStatus(studentId: string, status: AttendanceStatus) {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === status ? null : status,
    }))
  }

  function markAllPresent() {
    const updated: Record<string, AttendanceStatus | null> = {}
    for (const student of rosterStudents) {
      updated[student.id] = "present"
    }
    setAttendance(updated)
    toast.success("All students marked present")
  }

  function handleSave() {
    toast.success("Attendance saved")
  }

  // Navigate between class dates
  const dateIndex = WEEK_DATES.indexOf(selectedDate)
  const canGoBack = dateIndex > 0
  const canGoForward = dateIndex < WEEK_DATES.length - 1

  return (
    <div className="flex-1 p-6 space-y-6">
      <PageHeader title={cls.name} description="Take and manage attendance">
        <Button variant="outline" onClick={() => router.push("/attendance")}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Attendance
        </Button>
      </PageHeader>

      {/* Date Picker */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="icon-sm"
          disabled={!canGoBack}
          onClick={() => setSelectedDate(WEEK_DATES[dateIndex - 1])}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm font-medium px-4 py-1.5 rounded-lg bg-muted min-w-[160px] text-center">
          {formatDate(selectedDate)}
        </div>
        <Button
          variant="outline"
          size="icon-sm"
          disabled={!canGoForward}
          onClick={() => setSelectedDate(WEEK_DATES[dateIndex + 1])}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Class Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <Badge
              variant="outline"
              style={{
                borderColor: DISCIPLINE_COLORS[cls.discipline],
                color: DISCIPLINE_COLORS[cls.discipline],
              }}
            >
              {DISCIPLINE_LABELS[cls.discipline]}
            </Badge>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {DAY_LABELS[cls.schedule.day]}s, {formatTime(cls.schedule.startTime)}{" "}
              - {formatTime(cls.schedule.endTime)}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {cls.schedule.room}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              {getInstructorName(cls.instructorId)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Summary Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {markedCount} of {totalStudents} marked
              </span>
            </div>
            <Button size="sm" variant="outline" onClick={markAllPresent}>
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Mark All Present
            </Button>
          </div>

          {/* Status breakdown */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="font-medium">{presentCount}</span>
              <span className="text-muted-foreground">Present</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span className="font-medium">{lateCount}</span>
              <span className="text-muted-foreground">Late</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              <span className="font-medium">{excusedCount}</span>
              <span className="text-muted-foreground">Excused</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
              <span className="font-medium">{absentCount}</span>
              <span className="text-muted-foreground">Absent</span>
            </span>
            {unmarkedCount > 0 && (
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                <span className="font-medium">{unmarkedCount}</span>
                <span className="text-muted-foreground">Remaining</span>
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Student Roster */}
      <div className="space-y-2">
        {rosterStudents.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground text-sm">
              No students enrolled in this class.
            </CardContent>
          </Card>
        ) : (
          rosterStudents.map((student) => {
            const currentStatus = attendance[student.id]
            const note = notes[student.id] ?? ""
            const hasNote = note.length > 0

            return (
              <Card key={student.id}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {getInitials(student.firstName, student.lastName)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {student.firstName} {student.lastName}
                      </p>
                      {student.enrollmentStatus === "trial" && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-violet-50 text-violet-700 border-violet-200 mt-0.5"
                        >
                          Trial
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {STATUS_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => toggleStatus(student.id, option.value)}
                          className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-colors ${
                            currentStatus === option.value
                              ? getStatusColor(option.value)
                              : currentStatus === null
                                ? "bg-transparent border-gray-200 text-gray-400 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-500"
                                : `bg-transparent ${getStatusOutlineColor(option.value)}`
                          }`}
                        >
                          <span className="hidden sm:inline">{option.label}</span>
                          <span className="sm:hidden">{option.shortLabel}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes row */}
                  <div className="mt-2 ml-11 flex items-center gap-2">
                    <MessageSquare className="h-3 w-3 text-muted-foreground shrink-0" />
                    <Input
                      placeholder="Add a note..."
                      value={note}
                      onChange={(e) =>
                        setNotes((prev) => ({
                          ...prev,
                          [student.id]: (e.target as HTMLInputElement).value,
                        }))
                      }
                      className="h-7 text-xs"
                    />
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Save button */}
      {rosterStudents.length > 0 && (
        <div className="flex justify-end sticky bottom-4">
          <Button size="lg" onClick={handleSave} className="shadow-lg">
            <Save className="h-4 w-4 mr-2" />
            Save Attendance
          </Button>
        </div>
      )}
    </div>
  )
}
