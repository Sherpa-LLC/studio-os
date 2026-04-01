import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Check,
  Music,
  Users,
  ShoppingCart,
  CalendarDays,
  AlertTriangle,
  ArrowRight,
} from "lucide-react"
import { formatCurrency } from "@/lib/format"
import type { Recital, RecitalStatus, StudentMeasurement } from "@/lib/types"

// ── Types ──────────────────────────────────────────────────────────────────

interface OverviewTabProps {
  recital: Recital
  measurements: StudentMeasurement[]
  financials: { totalCost: number; totalRevenue: number; margin: number }
  conflictCount: number
  onTabChange: (tab: string) => void
}

// ── Status pipeline config ──────────────────────────────────────────────────

const PIPELINE_STEPS: { key: RecitalStatus; label: string }[] = [
  { key: "planning", label: "Planning" },
  { key: "ordering", label: "Ordering" },
  { key: "rehearsals", label: "Rehearsals" },
  { key: "show-week", label: "Show Week" },
  { key: "completed", label: "Completed" },
]

function getStatusIndex(status: RecitalStatus): number {
  return PIPELINE_STEPS.findIndex((s) => s.key === status)
}

// ── Component ──────────────────────────────────────────────────────────────

export function OverviewTab({
  recital,
  measurements,
  financials,
  conflictCount,
  onTabChange,
}: OverviewTabProps) {
  const currentIndex = getStatusIndex(recital.status)

  const totalStudents = recital.routines.reduce(
    (sum, r) => sum + r.studentCount,
    0
  )
  const notOrderedCount = recital.routines.filter(
    (r) => r.costume.orderStatus === "not-ordered"
  ).length
  const missingMeasurements = measurements.filter((m) => m.status === "missing")

  const showDate = new Date(recital.date)
  const today = new Date()
  const daysUntil = Math.ceil(
    (showDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="mt-4 space-y-6">
      {/* ── Status Pipeline ──────────────────────────────────────────────── */}
      <div className="rounded-lg border bg-card p-6">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
          Recital Progress
        </p>
        <div className="flex items-center justify-between">
          {PIPELINE_STEPS.map((step, index) => {
            const isCompleted = index < currentIndex
            const isActive = index === currentIndex

            return (
              <div
                key={step.key}
                className="flex items-center flex-1 last:flex-none"
              >
                <div className="flex flex-col items-center gap-1.5 min-w-[80px]">
                  <div
                    className={`flex items-center justify-center size-9 rounded-full text-sm font-semibold transition-colors ${
                      isCompleted
                        ? "bg-emerald-500 text-white"
                        : isActive
                          ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="size-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium text-center ${
                      isCompleted
                        ? "text-emerald-700"
                        : isActive
                          ? "text-foreground font-semibold"
                          : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < PIPELINE_STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 mt-[-20px] ${
                      index < currentIndex ? "bg-emerald-400" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Metric Cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Music className="size-4" />
              Routines
            </div>
            <p className="text-2xl font-bold">{recital.routines.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Users className="size-4" />
              Total Students
            </div>
            <p className="text-2xl font-bold">{totalStudents}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <ShoppingCart className="size-4" />
              Costume Budget
            </div>
            <p className="text-2xl font-bold">
              {formatCurrency(financials.totalCost)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <CalendarDays className="size-4" />
              Days Until Show
            </div>
            <p className="text-2xl font-bold">
              {daysUntil > 0 ? daysUntil : "Past"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Action Items ─────────────────────────────────────────────────── */}
      {(missingMeasurements.length > 0 ||
        notOrderedCount > 0 ||
        conflictCount > 0) && (
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Action Items
          </p>

          {missingMeasurements.length > 0 && (
            <button
              type="button"
              onClick={() => onTabChange("measurements")}
              className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 w-full text-left hover:bg-amber-100 transition-colors cursor-pointer"
            >
              <AlertTriangle className="size-5 text-amber-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800">
                  {missingMeasurements.length} student
                  {missingMeasurements.length !== 1 ? "s" : ""} missing
                  measurements
                </p>
                <p className="text-sm text-amber-700 mt-0.5">
                  Measurements need to be collected before costumes can be
                  ordered.
                </p>
              </div>
              <ArrowRight className="size-4 text-amber-600 mt-1 shrink-0" />
            </button>
          )}

          {notOrderedCount > 0 && (
            <button
              type="button"
              onClick={() => onTabChange("costumes")}
              className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 w-full text-left hover:bg-red-100 transition-colors cursor-pointer"
            >
              <ShoppingCart className="size-5 text-red-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">
                  {notOrderedCount} costume
                  {notOrderedCount !== 1 ? "s" : ""} not yet ordered
                </p>
                <p className="text-sm text-red-700 mt-0.5">
                  Place orders to ensure costumes arrive in time for rehearsals.
                </p>
              </div>
              <ArrowRight className="size-4 text-red-600 mt-1 shrink-0" />
            </button>
          )}

          {conflictCount > 0 && (
            <button
              type="button"
              onClick={() => onTabChange("lineup")}
              className="flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4 w-full text-left hover:bg-orange-100 transition-colors cursor-pointer"
            >
              <AlertTriangle className="size-5 text-orange-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-orange-800">
                  {conflictCount} lineup conflict
                  {conflictCount !== 1 ? "s" : ""}
                </p>
                <p className="text-sm text-orange-700 mt-0.5">
                  Some students don&apos;t have enough time for costume changes
                  between routines.
                </p>
              </div>
              <ArrowRight className="size-4 text-orange-600 mt-1 shrink-0" />
            </button>
          )}
        </div>
      )}

      {/* ── Quick Links ──────────────────────────────────────────────────── */}
      <Separator />
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => onTabChange("costumes")}>
          View Costumes
        </Button>
        <Button variant="outline" size="sm" onClick={() => onTabChange("measurements")}>
          View Measurements
        </Button>
        <Button variant="outline" size="sm" onClick={() => onTabChange("lineup")}>
          View Lineup
        </Button>
        <Button variant="outline" size="sm" onClick={() => onTabChange("financials")}>
          View Financials
        </Button>
      </div>
    </div>
  )
}
