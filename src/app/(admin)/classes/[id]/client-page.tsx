"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Class, Student, Instructor, ClassFinancials, DayOfWeek } from "@/lib/types"
import {
  formatCurrency,
  formatTime,
  formatDate,
  getCapacityStatus,
  getInitials,
} from "@/lib/format"
import {
  DISCIPLINE_LABELS,
  DISCIPLINE_COLORS,
  AGE_GROUP_LABELS,
  DAY_LABELS,
  DAY_ABBREVIATIONS,
} from "@/lib/constants"
import {
  ArrowLeft,
  Users,
  Clock,
  MapPin,
  DollarSign,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Calculator,
} from "lucide-react"

const ENROLLMENT_BADGE_CLASSES: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  waitlisted: "bg-amber-50 text-amber-700 border-amber-200",
  trial: "bg-sky-50 text-sky-700 border-sky-200",
  withdrawn: "bg-gray-100 text-gray-600 border-gray-200",
  graduated: "bg-violet-50 text-violet-700 border-violet-200",
}

const ALL_DAYS: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
]

function getCapacityBarColor(enrolled: number, capacity: number): string {
  const status = getCapacityStatus(enrolled, capacity)
  switch (status) {
    case "available":
      return "bg-emerald-500"
    case "nearly-full":
      return "bg-amber-500"
    case "full":
      return "bg-red-500"
  }
}

interface ClassDetailPageProps {
  cls: Class | undefined
  students: Student[]
  instructors: Instructor[]
  financials: ClassFinancials | undefined
  instructorName: string
}

export default function ClassDetailPage({
  cls,
  students,
  instructors,
  financials,
  instructorName,
}: ClassDetailPageProps) {
  const id = cls?.id ?? ""

  const enrolledStudents = useMemo(() => {
    if (!cls) return []
    return students.filter((s) => s.enrolledClassIds.includes(cls.id))
  }, [cls, students])

  const instructor = useMemo(() => {
    if (!cls) return undefined
    return instructors.find((i) => i.id === cls.instructorId)
  }, [cls, instructors])

  if (!cls) {
    return (
      <>
        <Header title="Class Not Found" />
        <div className="flex-1 p-6 space-y-6">
          <PageHeader title="Class Not Found" />
          <p className="text-sm text-muted-foreground">
            The requested class could not be found.
          </p>
          <Link href="/classes">
            <Button variant="outline">
              <ArrowLeft data-icon="inline-start" />
              Back to Classes
            </Button>
          </Link>
        </div>
      </>
    )
  }

  const fillPercent = Math.min(
    (cls.enrolledCount / cls.capacity) * 100,
    100
  )
  const barColor = getCapacityBarColor(cls.enrolledCount, cls.capacity)
  const disciplineColor = DISCIPLINE_COLORS[cls.discipline]

  // Financials
  const monthlyRevenue = cls.enrolledCount * cls.monthlyRate
  const classDurationHours =
    (() => {
      const [sh, sm] = cls.schedule.startTime.split(":").map(Number)
      const [eh, em] = cls.schedule.endTime.split(":").map(Number)
      return (eh * 60 + em - (sh * 60 + sm)) / 60
    })()
  const weeksPerMonth = 4.33
  const instructorMonthlyCost = instructor
    ? instructor.payType === "per-class"
      ? instructor.payRate * weeksPerMonth
      : instructor.payRate * classDurationHours * weeksPerMonth
    : 0
  const monthlyMargin = monthlyRevenue - instructorMonthlyCost
  const marginPercent =
    monthlyRevenue > 0 ? (monthlyMargin / monthlyRevenue) * 100 : 0

  return (
    <>
      <Header title={cls.name} />
      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link href="/classes">
              <Button variant="ghost" size="icon">
                <ArrowLeft />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight">
                  {cls.name}
                </h1>
                <Badge
                  variant="outline"
                  style={{
                    borderColor: disciplineColor,
                    color: disciplineColor,
                  }}
                >
                  {DISCIPLINE_LABELS[cls.discipline]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {cls.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">Edit Class</Button>
          </div>
        </div>

        {/* Class Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card size="sm">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Clock className="size-4" />
                Schedule
              </div>
              <p className="font-medium text-sm">
                {DAY_LABELS[cls.schedule.day]}
              </p>
              <p className="text-sm">
                {formatTime(cls.schedule.startTime)} &ndash;{" "}
                {formatTime(cls.schedule.endTime)}
              </p>
            </CardContent>
          </Card>

          <Card size="sm">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <MapPin className="size-4" />
                Room
              </div>
              <p className="font-medium text-sm">{cls.schedule.room}</p>
              <p className="text-sm text-muted-foreground">
                Ages {cls.ageRange.min}&ndash;{cls.ageRange.max} (
                {AGE_GROUP_LABELS[cls.ageGroup]})
              </p>
            </CardContent>
          </Card>

          <Card size="sm">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Users className="size-4" />
                Instructor
              </div>
              <p className="font-medium text-sm">
                {instructorName}
              </p>
              {instructor && (
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(instructor.payRate)}/
                  {instructor.payType === "per-class" ? "class" : "hr"}
                </p>
              )}
            </CardContent>
          </Card>

          <Card size="sm">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <DollarSign className="size-4" />
                Tuition
              </div>
              <p className="font-semibold text-lg">
                {formatCurrency(cls.monthlyRate)}/mo
              </p>
              <p className="text-xs text-muted-foreground">
                {classDurationHours} hr/wk &times; $95/hr
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Capacity Indicator */}
        <Card size="sm">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Capacity</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {cls.enrolledCount} enrolled / {cls.capacity} spots
                {cls.waitlistCount > 0 && (
                  <span className="ml-2 text-amber-600">
                    ({cls.waitlistCount} waitlisted)
                  </span>
                )}
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${barColor}`}
                style={{ width: `${fillPercent}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              {cls.capacity - cls.enrolledCount > 0
                ? `${cls.capacity - cls.enrolledCount} spot${cls.capacity - cls.enrolledCount !== 1 ? "s" : ""} remaining`
                : "Class is full"}
            </p>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="roster">
          <TabsList>
            <TabsTrigger value="roster">Roster</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
          </TabsList>

          {/* Roster Tab */}
          <TabsContent value="roster">
            <div className="mt-4 rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Household</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrolledStudents.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-muted-foreground py-8"
                      >
                        No students enrolled in this class.
                      </TableCell>
                    </TableRow>
                  ) : (
                    enrolledStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <Avatar size="sm">
                              <AvatarFallback className="text-[10px]">
                                {getInitials(
                                  student.firstName,
                                  student.lastName
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">
                                {student.firstName} {student.lastName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                DOB: {formatDate(student.dateOfBirth)}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{student.age}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              ENROLLMENT_BADGE_CLASSES[
                                student.enrollmentStatus
                              ]
                            }
                          >
                            {student.enrollmentStatus
                              .charAt(0)
                              .toUpperCase() +
                              student.enrollmentStatus.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/households/${student.householdId}`}
                            className="text-sm text-muted-foreground hover:underline"
                          >
                            {student.householdId}
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule">
            <div className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="size-4" />
                    Weekly Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-6 gap-2">
                    {ALL_DAYS.map((day) => {
                      const isClassDay = cls.schedule.day === day
                      return (
                        <div
                          key={day}
                          className={`rounded-lg border p-3 text-center ${
                            isClassDay
                              ? "border-primary bg-primary/5"
                              : "border-muted bg-muted/30"
                          }`}
                        >
                          <p
                            className={`text-xs font-medium mb-1 ${
                              isClassDay
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          >
                            {DAY_ABBREVIATIONS[day]}
                          </p>
                          {isClassDay ? (
                            <div className="space-y-1">
                              <div
                                className="w-full h-1 rounded-full"
                                style={{
                                  backgroundColor: disciplineColor,
                                }}
                              />
                              <p className="text-xs font-medium">
                                {formatTime(cls.schedule.startTime)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatTime(cls.schedule.endTime)}
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                {cls.schedule.room}
                              </p>
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground py-3">
                              &mdash;
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Financials Tab */}
          <TabsContent value="financials">
            <FinancialsTabContent
              cls={cls}
              instructor={instructor}
              monthlyRevenue={monthlyRevenue}
              instructorMonthlyCost={instructorMonthlyCost}
              classDurationHours={classDurationHours}
              weeksPerMonth={weeksPerMonth}
              monthlyMargin={monthlyMargin}
              marginPercent={marginPercent}
              profData={financials}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

// ── Financials Tab Component ────────────────────────────────────────────────

function FinancialsTabContent({
  cls,
  instructor,
  monthlyRevenue,
  instructorMonthlyCost,
  classDurationHours,
  weeksPerMonth,
  monthlyMargin,
  marginPercent,
  profData,
}: {
  cls: Class
  instructor: Instructor | undefined
  monthlyRevenue: number
  instructorMonthlyCost: number
  classDurationHours: number
  weeksPerMonth: number
  monthlyMargin: number
  marginPercent: number
  profData: ClassFinancials | undefined
}) {
  const [whatIfEnrollment, setWhatIfEnrollment] = useState("")

  // Use profitability data if available, otherwise fall back to inline calculations
  const overhead = profData?.monthlyOverhead ?? 231
  const netMargin = profData?.monthlyMargin ?? (monthlyRevenue - instructorMonthlyCost - overhead)
  const netMarginPercent = profData?.marginPercent ?? (monthlyRevenue > 0 ? ((monthlyRevenue - instructorMonthlyCost - overhead) / monthlyRevenue) * 100 : 0)
  const breakevenStudents = profData?.breakeven ?? (cls.monthlyRate > 0 ? Math.ceil((instructorMonthlyCost + overhead) / cls.monthlyRate) : 0)

  // What-if calculations
  const whatIfCount = whatIfEnrollment ? parseInt(whatIfEnrollment, 10) : null
  const whatIfRevenue = whatIfCount !== null ? whatIfCount * cls.monthlyRate : null
  const whatIfMargin = whatIfRevenue !== null ? whatIfRevenue - instructorMonthlyCost - overhead : null
  const whatIfMarginPercent = whatIfRevenue && whatIfRevenue > 0 ? ((whatIfMargin ?? 0) / whatIfRevenue) * 100 : null

  const marginColor = netMarginPercent > 30
    ? "text-emerald-600"
    : netMarginPercent >= 0
      ? "text-amber-600"
      : "text-red-600"

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* P&L Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-4 text-muted-foreground" />
            Monthly P&L
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {/* Revenue */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Revenue ({cls.enrolledCount} &times; {formatCurrency(cls.monthlyRate)}/mo)
              </span>
              <span className="font-medium text-sm text-emerald-600">
                +{formatCurrency(monthlyRevenue)}
              </span>
            </div>

            <Separator />

            {/* Instructor Cost */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Instructor Cost (
                {instructor?.payType === "per-class"
                  ? `${formatCurrency(instructor.payRate)}/class x ${weeksPerMonth.toFixed(1)} wks`
                  : instructor
                    ? `${formatCurrency(instructor.payRate)}/hr x ${classDurationHours}hr x ${weeksPerMonth.toFixed(1)} wks`
                    : "N/A"}
                )
              </span>
              <span className="font-medium text-sm text-red-600">
                -{formatCurrency(instructorMonthlyCost)}
              </span>
            </div>

            {/* Overhead */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Studio Overhead (allocated)
              </span>
              <span className="font-medium text-sm text-red-600">
                -{formatCurrency(overhead)}
              </span>
            </div>

            <Separator />

            {/* Net Margin */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Net Margin</span>
              <div className="text-right">
                <span className={`font-semibold text-sm ${marginColor}`}>
                  {formatCurrency(netMargin)}
                </span>
                <span className={`text-xs ml-1.5 ${marginColor}`}>
                  ({netMarginPercent.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Breakeven */}
          <div className="rounded-lg border bg-muted/30 p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <AlertTriangle className="size-3.5 text-muted-foreground" />
              Breakeven Analysis
            </div>
            <p className="text-sm text-muted-foreground">
              This class needs{" "}
              <span className="font-semibold text-foreground">
                {breakevenStudents} students
              </span>{" "}
              to break even.
              {cls.enrolledCount >= breakevenStudents ? (
                <span className="text-emerald-600 ml-1">
                  Currently {cls.enrolledCount - breakevenStudents} above breakeven.
                </span>
              ) : (
                <span className="text-red-600 ml-1">
                  Currently {breakevenStudents - cls.enrolledCount} below breakeven.
                </span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* What-if + Revenue Breakdown */}
      <div className="space-y-4">
        {/* What-if Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="size-4 text-muted-foreground" />
              What-If Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="whatif-enrollment">If enrollment drops to</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="whatif-enrollment"
                  type="number"
                  min="0"
                  max={cls.capacity}
                  placeholder={cls.enrolledCount.toString()}
                  value={whatIfEnrollment}
                  onChange={(e) => setWhatIfEnrollment(e.target.value)}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">
                  students (current: {cls.enrolledCount})
                </span>
              </div>
            </div>

            {whatIfCount !== null && whatIfMargin !== null && whatIfMarginPercent !== null && (
              <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Projected Revenue</span>
                  <span className="font-medium">{formatCurrency(whatIfRevenue!)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Projected Margin</span>
                  <span
                    className={`font-semibold ${
                      whatIfMarginPercent > 30
                        ? "text-emerald-600"
                        : whatIfMarginPercent >= 0
                          ? "text-amber-600"
                          : "text-red-600"
                    }`}
                  >
                    {formatCurrency(whatIfMargin)} ({whatIfMarginPercent.toFixed(1)}%)
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Change from current</span>
                  <span
                    className={`font-medium ${
                      whatIfMargin - netMargin >= 0
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {whatIfMargin - netMargin >= 0 ? "+" : ""}
                    {formatCurrency(whatIfMargin - netMargin)}
                  </span>
                </div>
                {whatIfMargin < 0 && (
                  <p className="text-xs text-red-600 flex items-center gap-1 pt-1">
                    <AlertTriangle className="size-3" />
                    Below breakeven at this enrollment level
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Monthly Tuition Revenue
              </span>
              <span className="font-medium text-sm">
                {formatCurrency(monthlyRevenue)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Projected Quarterly
              </span>
              <span className="font-medium text-sm">
                {formatCurrency(monthlyRevenue * 3)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Projected Annual
              </span>
              <span className="font-medium text-sm">
                {formatCurrency(monthlyRevenue * 12)}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Max Revenue (at capacity)
              </span>
              <span className="font-medium text-sm">
                {formatCurrency(cls.capacity * cls.monthlyRate)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Revenue Realization
              </span>
              <span className="font-medium text-sm">
                {((cls.enrolledCount / cls.capacity) * 100).toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
