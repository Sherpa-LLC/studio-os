"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/shared/page-header"
import { StepIndicator } from "@/components/registration/step-indicator"
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
import { getInstructorName } from "@/data/instructors"
import { DISCIPLINE_LABELS, DISCIPLINE_COLORS, DAY_LABELS } from "@/lib/constants"
import { formatCurrency, formatTime, getCapacityStatus } from "@/lib/format"
import type { Discipline, DayOfWeek } from "@/lib/types"
import { Check, Clock, MapPin, User } from "lucide-react"
import { cn } from "@/lib/utils"

export default function RegisterClassesPage() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [disciplineFilter, setDisciplineFilter] = useState<string>("all")
  const [dayFilter, setDayFilter] = useState<string>("all")

  const availableClasses = useMemo(() => {
    return classes.filter((cls) => {
      if (cls.status !== "active") return false
      if (disciplineFilter !== "all" && cls.discipline !== disciplineFilter) return false
      if (dayFilter !== "all" && cls.schedule.day !== dayFilter) return false
      return true
    })
  }, [disciplineFilter, dayFilter])

  const selectedClasses = classes.filter((cls) => selectedIds.has(cls.id))
  const totalMonthly = selectedClasses.reduce((sum, cls) => sum + cls.monthlyRate, 0)

  function toggleClass(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className="space-y-6">
      <StepIndicator currentStep={3} />
      <PageHeader
        title="Browse Classes"
        description="Select classes for your children"
      />

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3">
        <Select value={disciplineFilter} onValueChange={(val) => setDisciplineFilter(val ?? "all")}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Disciplines" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Disciplines</SelectItem>
            {Object.entries(DISCIPLINE_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={dayFilter} onValueChange={(val) => setDayFilter(val ?? "all")}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Days" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Days</SelectItem>
            {Object.entries(DAY_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Class grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {availableClasses.map((cls) => {
          const isSelected = selectedIds.has(cls.id)
          const capacity = getCapacityStatus(cls.enrolledCount, cls.capacity)
          const isFull = capacity === "full"
          const spotsLeft = cls.capacity - cls.enrolledCount

          return (
            <Card
              key={cls.id}
              className={cn(
                "relative transition-all",
                isSelected && "ring-2 ring-indigo-500",
                isFull && "opacity-60"
              )}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-white">
                  <Check className="h-4 w-4" />
                </div>
              )}
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <div
                    className="mt-0.5 h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: DISCIPLINE_COLORS[cls.discipline] }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium leading-tight">{cls.name}</p>
                    <Badge variant="secondary" className="mt-1">
                      {DISCIPLINE_LABELS[cls.discipline]}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    {DAY_LABELS[cls.schedule.day]},{" "}
                    {formatTime(cls.schedule.startTime)} -{" "}
                    {formatTime(cls.schedule.endTime)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="h-3 w-3" />
                    {getInstructorName(cls.instructorId)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3" />
                    {cls.schedule.room}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-base font-semibold">
                      {formatCurrency(cls.monthlyRate)}
                    </span>
                    <span className="text-xs text-muted-foreground">/mo</span>
                  </div>
                  <div className="text-right">
                    {isFull ? (
                      <Badge variant="destructive">Full</Badge>
                    ) : spotsLeft <= 3 ? (
                      <span className="text-xs text-amber-600">
                        {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {spotsLeft} spots open
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  variant={isSelected ? "secondary" : "outline"}
                  className="w-full"
                  size="sm"
                  disabled={isFull && !isSelected}
                  onClick={() => toggleClass(cls.id)}
                >
                  {isSelected ? "Selected" : isFull ? "Full" : "Select"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {availableClasses.length === 0 && (
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground text-sm">
          No classes match your filters. Try adjusting the discipline or day.
        </div>
      )}

      {/* Selected classes summary */}
      {selectedClasses.length > 0 && (
        <Card className="bg-indigo-50/50 dark:bg-indigo-950/20">
          <CardContent>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">
                  {selectedClasses.length} class{selectedClasses.length !== 1 ? "es" : ""} selected
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedClasses.map((c) => c.name).join(", ")}
                </p>
              </div>
              <p className="text-lg font-bold">
                {formatCurrency(totalMonthly)}
                <span className="text-sm font-normal text-muted-foreground">/mo</span>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between pt-4">
        <Link href="/register/children">
          <Button variant="outline">Back</Button>
        </Link>
        <Link href="/register/waiver">
          <Button disabled={selectedIds.size === 0}>Continue</Button>
        </Link>
      </div>
    </div>
  )
}
