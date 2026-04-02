"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { classes } from "@/data/classes"
import { students } from "@/data/students"
import { billingConfig } from "@/data/billing-rules"
import { getInstructorName } from "@/data/instructors"
import {
  DISCIPLINE_LABELS,
  DISCIPLINE_COLORS,
  DAY_LABELS,
  AGE_GROUP_LABELS,
  AGE_GROUP_RANGES,
} from "@/lib/constants"
import { formatCurrency, formatTime, getCapacityStatus } from "@/lib/format"
import type { Discipline, DayOfWeek, Student, Class } from "@/lib/types"
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  GraduationCap,
  MapPin,
  Sparkles,
  User,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Anderson household — matches all other portal pages
const HOUSEHOLD_ID = "hh-001"

const STEPS = [
  { label: "Choose Child", num: 1 },
  { label: "Browse Classes", num: 2 },
  { label: "Review & Confirm", num: 3 },
]

function getAgeGroupLabel(age: number): string {
  for (const [key, range] of Object.entries(AGE_GROUP_RANGES)) {
    if (age >= range.min && age <= range.max) {
      return AGE_GROUP_LABELS[key as keyof typeof AGE_GROUP_LABELS]
    }
  }
  return ""
}

export default function EnrollPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null)
  const [selectedClassIds, setSelectedClassIds] = useState<Set<string>>(new Set())
  const [disciplineFilter, setDisciplineFilter] = useState<string>("all")
  const [dayFilter, setDayFilter] = useState<string>("all")
  const [confirmed, setConfirmed] = useState(false)

  const householdStudents = students.filter((s) => s.householdId === HOUSEHOLD_ID)
  const selectedChild = householdStudents.find((s) => s.id === selectedChildId) ?? null

  // Classes filtered to the selected child's age
  const ageFilteredClasses = useMemo(() => {
    if (!selectedChild) return []
    return classes.filter((cls) => {
      if (cls.status !== "active") return false
      if (selectedChild.age < cls.ageRange.min || selectedChild.age > cls.ageRange.max) return false
      if (disciplineFilter !== "all" && cls.discipline !== disciplineFilter) return false
      if (dayFilter !== "all" && cls.schedule.day !== dayFilter) return false
      return true
    })
  }, [selectedChild, disciplineFilter, dayFilter])

  // Disciplines present in age-filtered results (before discipline filter)
  const availableDisciplines = useMemo(() => {
    if (!selectedChild) return []
    const disciplines = new Set<Discipline>()
    for (const cls of classes) {
      if (cls.status !== "active") continue
      if (selectedChild.age < cls.ageRange.min || selectedChild.age > cls.ageRange.max) continue
      disciplines.add(cls.discipline)
    }
    return Array.from(disciplines).sort()
  }, [selectedChild])

  const selectedClasses = classes.filter((cls) => selectedClassIds.has(cls.id))
  const newMonthlyTotal = selectedClasses.reduce((sum, cls) => sum + cls.monthlyRate, 0)

  // Existing enrolled classes across the whole household for cap calculation
  const existingEnrolledIds = householdStudents.flatMap((s) => s.enrolledClassIds)
  const existingMonthly = classes
    .filter((cls) => existingEnrolledIds.includes(cls.id))
    .reduce((sum, cls) => sum + cls.monthlyRate, 0)

  const combinedMonthly = existingMonthly + newMonthlyTotal
  const cappedMonthly = billingConfig.monthlyCapEnabled
    ? Math.min(combinedMonthly, billingConfig.monthlyCapAmount)
    : combinedMonthly
  const capSavings = combinedMonthly - cappedMonthly

  function selectChild(id: string) {
    setSelectedChildId(id)
    setSelectedClassIds(new Set())
    setDisciplineFilter("all")
    setDayFilter("all")
    setStep(2)
  }

  function toggleClass(id: string) {
    setSelectedClassIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  if (confirmed) {
    return <SuccessState childName={selectedChild?.firstName ?? ""} classes={selectedClasses} />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enroll in Classes"
        description="Find the perfect classes for your dancer"
      />

      {/* Step indicator */}
      <nav aria-label="Enrollment progress" className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s.num} className="flex items-center gap-2">
            {i > 0 && (
              <div
                className={cn(
                  "h-px w-6 sm:w-10",
                  step > s.num - 1 ? "bg-primary" : "bg-border"
                )}
              />
            )}
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  step > s.num
                    ? "bg-primary text-primary-foreground"
                    : step === s.num
                      ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                      : "bg-muted text-muted-foreground"
                )}
              >
                {step > s.num ? <Check className="h-3.5 w-3.5" /> : s.num}
              </div>
              <span
                className={cn(
                  "hidden text-sm font-medium sm:inline",
                  step === s.num ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {s.label}
              </span>
            </div>
          </div>
        ))}
      </nav>

      {/* Step 1: Child picker */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Which dancer are you enrolling? We&apos;ll show classes matched to their age.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {householdStudents.map((child) => {
              const enrolledClasses = classes.filter((cls) =>
                child.enrolledClassIds.includes(cls.id)
              )
              const ageGroup = getAgeGroupLabel(child.age)

              return (
                <button
                  key={child.id}
                  onClick={() => selectChild(child.id)}
                  className="group text-left"
                >
                  <Card className="transition-all group-hover:ring-2 group-hover:ring-primary/40 group-hover:shadow-md">
                    <CardContent className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-lg font-bold">
                        {child.firstName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-semibold">{child.firstName} {child.lastName}</p>
                        <p className="text-sm text-muted-foreground">
                          Age {child.age} &middot; {ageGroup}
                        </p>
                        <div className="mt-2 flex items-center gap-1.5">
                          {enrolledClasses.map((cls) => (
                            <div
                              key={cls.id}
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: DISCIPLINE_COLORS[cls.discipline] }}
                              title={cls.name}
                            />
                          ))}
                          <span className="text-xs text-muted-foreground ml-1">
                            {enrolledClasses.length} class{enrolledClasses.length !== 1 ? "es" : ""} enrolled
                          </span>
                        </div>
                      </div>
                      <div className="text-muted-foreground group-hover:text-primary transition-colors">
                        <ArrowLeft className="h-5 w-5 rotate-180" />
                      </div>
                    </CardContent>
                  </Card>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Step 2: Class browser */}
      {step === 2 && selectedChild && (
        <div className="space-y-5">
          {/* Child context banner */}
          <div className="flex items-center gap-3 rounded-xl bg-primary/5 px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary text-sm font-bold">
              {selectedChild.firstName[0]}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">
                Showing classes for <span className="text-primary">{selectedChild.firstName}</span>{" "}
                <span className="text-muted-foreground">(age {selectedChild.age})</span>
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setStep(1); setSelectedClassIds(new Set()) }}
            >
              Change
            </Button>
          </div>

          {/* Filters */}
          <div className="space-y-3">
            {/* Discipline chips */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setDisciplineFilter("all")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  disciplineFilter === "all"
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                All
              </button>
              {availableDisciplines.map((d) => (
                <button
                  key={d}
                  onClick={() => setDisciplineFilter(d === disciplineFilter ? "all" : d)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                    disciplineFilter === d
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: DISCIPLINE_COLORS[d] }}
                  />
                  {DISCIPLINE_LABELS[d]}
                </button>
              ))}
            </div>

            {/* Day filter + count */}
            <div className="flex items-center gap-3">
              <Select value={dayFilter} onValueChange={(val) => setDayFilter(val ?? "all")}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Days" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Days</SelectItem>
                  {Object.entries(DAY_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-xs text-muted-foreground">
                {ageFilteredClasses.length} class{ageFilteredClasses.length !== 1 ? "es" : ""} available
              </span>
            </div>
          </div>

          {/* Class grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {ageFilteredClasses.map((cls) => {
              const isSelected = selectedClassIds.has(cls.id)
              const isEnrolled = selectedChild.enrolledClassIds.includes(cls.id)
              const capacity = getCapacityStatus(cls.enrolledCount, cls.capacity)
              const isFull = capacity === "full"
              const spotsLeft = cls.capacity - cls.enrolledCount
              const fillPercent = Math.round((cls.enrolledCount / cls.capacity) * 100)

              return (
                <Card
                  key={cls.id}
                  className={cn(
                    "relative overflow-hidden transition-all",
                    isSelected && "ring-2 ring-primary shadow-sm",
                    isEnrolled && "opacity-60",
                    isFull && !isEnrolled && "opacity-70"
                  )}
                >
                  {/* Discipline color accent */}
                  <div
                    className="h-1"
                    style={{ backgroundColor: DISCIPLINE_COLORS[cls.discipline] }}
                  />

                  {isSelected && (
                    <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                  )}

                  <CardContent className="space-y-3 pt-4">
                    {/* Header */}
                    <div>
                      <p className="font-semibold leading-tight pr-8">{cls.name}</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="text-xs"
                          style={{
                            backgroundColor: DISCIPLINE_COLORS[cls.discipline] + "18",
                            color: DISCIPLINE_COLORS[cls.discipline],
                          }}
                        >
                          {DISCIPLINE_LABELS[cls.discipline]}
                        </Badge>
                        {isEnrolled && (
                          <Badge variant="outline" className="text-xs">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Enrolled
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {cls.description}
                    </p>

                    {/* Details */}
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3 shrink-0" />
                        {DAY_LABELS[cls.schedule.day]}, {formatTime(cls.schedule.startTime)} &ndash; {formatTime(cls.schedule.endTime)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="h-3 w-3 shrink-0" />
                        {getInstructorName(cls.instructorId)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {cls.schedule.room}
                      </div>
                    </div>

                    {/* Capacity bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {cls.enrolledCount}/{cls.capacity} enrolled
                        </span>
                        {isFull ? (
                          <span className="font-medium text-red-500">Full</span>
                        ) : spotsLeft <= 3 ? (
                          <span className="font-medium text-amber-600">
                            {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left
                          </span>
                        ) : null}
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            isFull
                              ? "bg-red-400"
                              : capacity === "nearly-full"
                                ? "bg-amber-400"
                                : "bg-emerald-400"
                          )}
                          style={{ width: `${Math.min(fillPercent, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Price + action */}
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-base font-bold">{formatCurrency(cls.monthlyRate)}</span>
                        <span className="text-xs text-muted-foreground">/mo</span>
                      </div>
                      {isEnrolled ? (
                        <span className="text-xs text-muted-foreground">Already enrolled</span>
                      ) : (
                        <Button
                          variant={isSelected ? "secondary" : "outline"}
                          size="sm"
                          disabled={isFull}
                          onClick={() => toggleClass(cls.id)}
                        >
                          {isSelected ? "Selected" : isFull ? "Class Full" : "Select"}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {ageFilteredClasses.length === 0 && (
            <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground text-sm">
              No classes match your filters. Try adjusting the discipline or day.
            </div>
          )}

          {/* Floating cost summary */}
          {selectedClasses.length > 0 && (
            <div className="sticky bottom-4 z-10">
              <Card className="border-primary/20 bg-card shadow-lg">
                <CardContent>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="font-semibold">
                        {selectedClasses.length} class{selectedClasses.length !== 1 ? "es" : ""} selected
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {selectedClasses.map((c) => DISCIPLINE_LABELS[c.discipline]).join(", ")}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold">
                          +{formatCurrency(newMonthlyTotal)}
                          <span className="text-sm font-normal text-muted-foreground">/mo</span>
                        </p>
                        {capSavings > 0 && (
                          <p className="text-xs text-emerald-600">
                            {formatCurrency(capSavings)} saved with monthly cap
                          </p>
                        )}
                      </div>
                      <Button onClick={() => setStep(3)}>
                        Continue
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Back button (when no classes selected) */}
          {selectedClasses.length === 0 && (
            <div className="pt-2">
              <Button
                variant="ghost"
                onClick={() => { setStep(1); setSelectedClassIds(new Set()) }}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Review & confirm */}
      {step === 3 && selectedChild && (
        <div className="space-y-6">
          <Button
            variant="ghost"
            onClick={() => setStep(2)}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to classes
          </Button>

          {/* New classes */}
          <Card>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                  {selectedChild.firstName[0]}
                </div>
                <div>
                  <p className="font-semibold">New classes for {selectedChild.firstName}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedClasses.length} class{selectedClasses.length !== 1 ? "es" : ""} being added
                  </p>
                </div>
              </div>

              <div className="divide-y">
                {selectedClasses.map((cls) => (
                  <div key={cls.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <div
                      className="h-8 w-1 shrink-0 rounded-full"
                      style={{ backgroundColor: DISCIPLINE_COLORS[cls.discipline] }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{cls.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {DAY_LABELS[cls.schedule.day]}, {formatTime(cls.schedule.startTime)} &ndash; {formatTime(cls.schedule.endTime)}
                        {" "}&middot; {getInstructorName(cls.instructorId)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold shrink-0">
                      {formatCurrency(cls.monthlyRate)}<span className="text-xs font-normal text-muted-foreground">/mo</span>
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cost breakdown */}
          <Card>
            <CardContent className="space-y-3">
              <p className="font-semibold">Monthly cost summary</p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Current monthly tuition</span>
                  <span>{formatCurrency(existingMonthly)}</span>
                </div>
                <div className="flex justify-between">
                  <span>New classes</span>
                  <span>+{formatCurrency(newMonthlyTotal)}</span>
                </div>
                {capSavings > 0 && (
                  <>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span className="line-through">{formatCurrency(combinedMonthly)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-600">
                      <span>Monthly cap discount</span>
                      <span>&minus;{formatCurrency(capSavings)}</span>
                    </div>
                  </>
                )}
                <div className="border-t pt-2 flex justify-between font-semibold text-base">
                  <span>New monthly total</span>
                  <span>{formatCurrency(cappedMonthly)}</span>
                </div>
                {billingConfig.monthlyCapEnabled && (
                  <p className="text-xs text-muted-foreground">
                    Monthly tuition is capped at {formatCurrency(billingConfig.monthlyCapAmount)} per household.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Button
            className="w-full"
            size="lg"
            onClick={() => setConfirmed(true)}
          >
            <GraduationCap className="h-4 w-4 mr-2" />
            Confirm Enrollment
          </Button>
        </div>
      )}
    </div>
  )
}

/* ── Success state ─────────────────────────────────────────────────────────── */

function SuccessState({ childName, classes: enrolledClasses }: { childName: string; classes: Class[] }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
      <div className="relative">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>
        <Sparkles className="absolute -top-1 -right-1 h-6 w-6 text-amber-400" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">You&apos;re all set!</h2>
        <p className="text-muted-foreground max-w-md">
          {childName} has been enrolled in {enrolledClasses.length} new class{enrolledClasses.length !== 1 ? "es" : ""}.
          You&apos;ll see them on your schedule right away.
        </p>
      </div>

      <div className="w-full max-w-sm space-y-2">
        {enrolledClasses.map((cls) => (
          <div
            key={cls.id}
            className="flex items-center gap-3 rounded-lg border px-4 py-2.5"
          >
            <div
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: DISCIPLINE_COLORS[cls.discipline] }}
            />
            <p className="text-sm font-medium text-left flex-1">{cls.name}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <Link href="/portal/schedule">
          <Button variant="outline">View Schedule</Button>
        </Link>
        <Link href="/portal">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
