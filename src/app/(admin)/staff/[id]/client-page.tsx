"use client"

import { useMemo } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { TablePagination } from "@/components/ui/table-pagination"
import { usePagination } from "@/hooks/use-pagination"
import type { StaffMember, Class, DayOfWeek, StaffRole, StaffStatus } from "@/lib/types"
import {
  formatCurrency,
  formatDate,
  formatPhone,
  formatTime,
  getInitials,
} from "@/lib/format"
import {
  DISCIPLINE_LABELS,
  DISCIPLINE_COLORS,
  DAY_LABELS,
  DAY_ABBREVIATIONS,
} from "@/lib/constants"
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  Clock,
  Users,
  DollarSign,
  BookOpen,
} from "lucide-react"

const ALL_DAYS: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
]

const ROLE_BADGE_CLASSES: Record<StaffRole, string> = {
  instructor: "bg-blue-50 text-blue-700 border-blue-200",
  assistant: "bg-purple-50 text-purple-700 border-purple-200",
  sub: "bg-amber-50 text-amber-700 border-amber-200",
  admin: "bg-gray-100 text-gray-600 border-gray-200",
}

const ROLE_LABELS: Record<StaffRole, string> = {
  instructor: "Instructor",
  assistant: "Assistant",
  sub: "Sub",
  admin: "Admin",
}

const STATUS_BADGE_CLASSES: Record<StaffStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "on-leave": "bg-amber-50 text-amber-700 border-amber-200",
  inactive: "bg-gray-100 text-gray-600 border-gray-200",
}

const STATUS_LABELS: Record<StaffStatus, string> = {
  active: "Active",
  "on-leave": "On Leave",
  inactive: "Inactive",
}

function yearsAgo(dateStr: string): number {
  const hire = new Date(dateStr + "T00:00:00")
  const now = new Date()
  let years = now.getFullYear() - hire.getFullYear()
  const monthDiff = now.getMonth() - hire.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < hire.getDate())) {
    years--
  }
  return years
}

function isCertExpiringSoon(expiresAt?: string): boolean {
  if (!expiresAt) return false
  const exp = new Date(expiresAt + "T00:00:00")
  const now = new Date()
  const diffMs = exp.getTime() - now.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  return diffDays <= 60 && diffDays > 0
}

function isCertExpired(expiresAt?: string): boolean {
  if (!expiresAt) return false
  const exp = new Date(expiresAt + "T00:00:00")
  return exp.getTime() < Date.now()
}

interface StaffDetailPageProps {
  staff: StaffMember | undefined
  classes: Class[]
}

export default function StaffDetailPage({
  staff,
  classes,
}: StaffDetailPageProps) {

  const staffClasses = useMemo(() => {
    if (!staff) return []
    return classes.filter((c) => staff.classIds.includes(c.id))
  }, [staff, classes])

  const classPayDetails = useMemo(() => {
    if (!staff) return []
    return staffClasses.map((cls) => {
      const [sh, sm] = cls.schedule.startTime.split(":").map(Number)
      const [eh, em] = cls.schedule.endTime.split(":").map(Number)
      const durationHours = (eh * 60 + em - (sh * 60 + sm)) / 60
      const payPerClass =
        staff.payType === "per-class"
          ? staff.payRate
          : staff.payRate * durationHours
      const monthlyPay = payPerClass * 4.3
      return {
        cls,
        durationHours,
        payPerClass,
        monthlyPay,
      }
    })
  }, [staff, staffClasses])

  const classTablePagination = usePagination(classPayDetails, {
    initialPageSize: 50,
  })

  if (!staff) {
    return (
      <>
        <Header title="Staff Not Found" />
        <div className="flex-1 p-6 space-y-6">
          <PageHeader title="Staff Not Found" />
          <p className="text-sm text-muted-foreground">
            The requested staff member could not be found.
          </p>
          <Link href="/staff">
            <Button variant="outline">
              <ArrowLeft data-icon="inline-start" />
              Back to Staff
            </Button>
          </Link>
        </div>
      </>
    )
  }

  const fullName = `${staff.firstName} ${staff.lastName}`
  const tenure = yearsAgo(staff.hireDate)

  const totalMonthlyComp = classPayDetails.reduce(
    (sum, d) => sum + d.monthlyPay,
    0
  )
  const totalMonthlyRevenue = staffClasses.reduce(
    (sum, c) => sum + c.enrolledCount * c.monthlyRate,
    0
  )

  return (
    <>
      <Header title={fullName} />
      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link href="/staff">
              <Button variant="ghost" size="icon">
                <ArrowLeft />
              </Button>
            </Link>
            <Avatar size="lg">
              <AvatarFallback>
                {getInitials(staff.firstName, staff.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight">
                  {fullName}
                </h1>
                <Badge
                  variant="outline"
                  className={ROLE_BADGE_CLASSES[staff.role]}
                >
                  {ROLE_LABELS[staff.role]}
                </Badge>
                <Badge
                  variant="outline"
                  className={STATUS_BADGE_CLASSES[staff.status]}
                >
                  {STATUS_LABELS[staff.status]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                Hired {formatDate(staff.hireDate)} &middot; {tenure} year
                {tenure !== 1 ? "s" : ""} at studio
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="classes-pay">Classes & Pay</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
          </TabsList>

          {/* ── Profile Tab ──────────────────────────────────────────────── */}
          <TabsContent value="profile">
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contact Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar size="lg">
                      <AvatarFallback>
                        {getInitials(staff.firstName, staff.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{fullName}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {ROLE_LABELS[staff.role]}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="size-4 text-muted-foreground" />
                      {formatPhone(staff.phone)}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="size-4 text-muted-foreground" />
                      {staff.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="size-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Address on file
                      </span>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Emergency Contact
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Contact information on file
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Certifications Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {staff.certifications.map((cert) => {
                    const expired = isCertExpired(cert.expiresAt)
                    const expiringSoon = isCertExpiringSoon(cert.expiresAt)
                    return (
                      <div
                        key={cert.name}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-2">
                          {expired ? (
                            <AlertTriangle className="size-4 text-red-500" />
                          ) : expiringSoon ? (
                            <AlertTriangle className="size-4 text-amber-500" />
                          ) : (
                            <ShieldCheck className="size-4 text-emerald-500" />
                          )}
                          <span className="text-sm font-medium">
                            {cert.name}
                          </span>
                        </div>
                        {cert.expiresAt && (
                          <Badge
                            variant="outline"
                            className={
                              expired
                                ? "bg-red-50 text-red-700 border-red-200"
                                : expiringSoon
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }
                          >
                            {expired
                              ? "Expired"
                              : expiringSoon
                                ? `Expires ${formatDate(cert.expiresAt)}`
                                : `Valid until ${formatDate(cert.expiresAt)}`}
                          </Badge>
                        )}
                      </div>
                    )
                  })}
                  <Separator />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Hire Date</span>
                    <span className="font-medium">
                      {formatDate(staff.hireDate)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Years at Studio
                    </span>
                    <span className="font-medium">
                      {tenure} year{tenure !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Disciplines</span>
                    <div className="flex flex-wrap gap-1">
                      {staff.disciplines.map((d) => (
                        <Badge
                          key={d}
                          variant="outline"
                          className="text-[10px] px-1.5 py-0"
                          style={{
                            borderColor: DISCIPLINE_COLORS[d],
                            color: DISCIPLINE_COLORS[d],
                          }}
                        >
                          {DISCIPLINE_LABELS[d]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── Schedule Tab ─────────────────────────────────────────────── */}
          <TabsContent value="schedule">
            <div className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="size-4" />
                    Weekly Teaching Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-6 gap-2">
                    {ALL_DAYS.map((day) => {
                      const dayClasses = staffClasses
                        .filter((c) => c.schedule.day === day)
                        .sort((a, b) =>
                          a.schedule.startTime.localeCompare(
                            b.schedule.startTime
                          )
                        )
                      return (
                        <div key={day} className="space-y-2">
                          <div className="text-center">
                            <p className="text-xs font-medium text-muted-foreground">
                              {DAY_ABBREVIATIONS[day]}
                            </p>
                          </div>
                          {dayClasses.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-muted bg-muted/20 p-3 text-center">
                              <p className="text-[10px] text-muted-foreground">
                                No classes
                              </p>
                            </div>
                          ) : (
                            dayClasses.map((cls) => {
                              const color = DISCIPLINE_COLORS[cls.discipline]
                              return (
                                <Link
                                  key={cls.id}
                                  href={`/classes/${cls.id}`}
                                  className="block rounded-lg border p-2 hover:shadow-sm transition-shadow"
                                  style={{
                                    borderLeftWidth: "3px",
                                    borderLeftColor: color,
                                  }}
                                >
                                  <p className="text-[11px] font-medium leading-tight truncate">
                                    {cls.name.split(" - ")[0]}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground mt-0.5">
                                    {formatTime(cls.schedule.startTime)} &ndash;{" "}
                                    {formatTime(cls.schedule.endTime)}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground">
                                    {cls.schedule.room}
                                  </p>
                                </Link>
                              )
                            })
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="size-4" />
                <span>
                  {staff.weeklyHours} weekly teaching hours across{" "}
                  {staffClasses.length} class
                  {staffClasses.length !== 1 ? "es" : ""}
                </span>
              </div>
            </div>
          </TabsContent>

          {/* ── Classes & Pay Tab ────────────────────────────────────────── */}
          <TabsContent value="classes-pay">
            <div className="mt-4 space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card size="sm">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <BookOpen className="size-4" />
                      Total Classes
                    </div>
                    <p className="text-2xl font-bold">
                      {staffClasses.length}
                    </p>
                  </CardContent>
                </Card>
                <Card size="sm">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Clock className="size-4" />
                      Weekly Hours
                    </div>
                    <p className="text-2xl font-bold">{staff.weeklyHours}h</p>
                  </CardContent>
                </Card>
                <Card size="sm">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <DollarSign className="size-4" />
                      Monthly Compensation
                    </div>
                    <p className="text-2xl font-bold">
                      {formatCurrency(totalMonthlyComp)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Class Breakdown Table */}
              <div className="rounded-lg border bg-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class</TableHead>
                      <TableHead>Day / Time</TableHead>
                      <TableHead className="text-center">Students</TableHead>
                      <TableHead className="text-right">
                        Pay / Class
                      </TableHead>
                      <TableHead className="text-right">
                        Monthly Total
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classPayDetails.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-muted-foreground py-8"
                        >
                          No classes assigned.
                        </TableCell>
                      </TableRow>
                    ) : (
                      classTablePagination.paginatedItems.map(({ cls, payPerClass, monthlyPay }) => (
                        <TableRow key={cls.id}>
                          <TableCell>
                            <Link
                              href={`/classes/${cls.id}`}
                              className="font-medium text-foreground hover:underline"
                            >
                              {cls.name}
                            </Link>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {DAY_LABELS[cls.schedule.day]}{" "}
                            {formatTime(cls.schedule.startTime)} &ndash;{" "}
                            {formatTime(cls.schedule.endTime)}
                          </TableCell>
                          <TableCell className="text-center">
                            {cls.enrolledCount}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(payPerClass)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(monthlyPay)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                {classPayDetails.length > 0 && (
                  <TablePagination
                    page={classTablePagination.page}
                    pageCount={classTablePagination.pageCount}
                    pageSize={classTablePagination.pageSize}
                    totalItems={classTablePagination.totalItems}
                    startIndex={classTablePagination.startIndex}
                    endIndex={classTablePagination.endIndex}
                    onPageChange={classTablePagination.setPage}
                    onPageSizeChange={classTablePagination.setPageSize}
                  />
                )}
              </div>

              {/* Revenue Metric */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Revenue vs. Cost</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Total Tuition from Classes
                    </span>
                    <span className="font-medium text-emerald-600">
                      {formatCurrency(totalMonthlyRevenue)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Instructor Compensation
                    </span>
                    <span className="font-medium text-red-600">
                      {formatCurrency(totalMonthlyComp)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Net Margin</span>
                    <span className="font-semibold">
                      {formatCurrency(totalMonthlyRevenue - totalMonthlyComp)}
                      <span className="text-xs text-muted-foreground ml-1.5">
                        (
                        {totalMonthlyRevenue > 0
                          ? (
                              ((totalMonthlyRevenue - totalMonthlyComp) /
                                totalMonthlyRevenue) *
                              100
                            ).toFixed(1)
                          : "0.0"}
                        %)
                      </span>
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── Availability Tab ─────────────────────────────────────────── */}
          <TabsContent value="availability">
            <div className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="size-4" />
                    Weekly Availability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="text-left text-xs font-medium text-muted-foreground p-2 w-24">
                            Period
                          </th>
                          {ALL_DAYS.map((day) => (
                            <th
                              key={day}
                              className="text-center text-xs font-medium text-muted-foreground p-2"
                            >
                              {DAY_ABBREVIATIONS[day]}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(
                          ["morning", "afternoon", "evening"] as const
                        ).map((period) => (
                          <tr key={period}>
                            <td className="text-xs font-medium text-muted-foreground p-2 capitalize">
                              {period}
                            </td>
                            {ALL_DAYS.map((day) => {
                              const slot = staff.availability.find(
                                (a) => a.day === day && a.period === period
                              )
                              const isAvailable = slot?.available ?? false
                              return (
                                <td key={day} className="p-1">
                                  <div
                                    className={`h-10 rounded-md flex items-center justify-center text-xs font-medium ${
                                      isAvailable
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-gray-100 text-gray-400"
                                    }`}
                                  >
                                    {isAvailable ? "Available" : "\u2014"}
                                  </div>
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
