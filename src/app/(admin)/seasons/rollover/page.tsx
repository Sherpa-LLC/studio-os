"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  rolloverConfig,
  rolloverResponses,
  ageUpFlags,
  rolloverSummary,
} from "@/data/rollover"
import { formatDate, formatCurrency } from "@/lib/format"
import {
  ArrowLeft,
  Check,
  AlertTriangle,
  Users,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Clock,
  Zap,
} from "lucide-react"
import { toast } from "sonner"
import type { RolloverResponseStatus } from "@/lib/types"

// ── Step definitions ────────────────────────────────────────────────────────

const STEPS = [
  { label: "Configure", number: 1 },
  { label: "Notify Families", number: 2 },
  { label: "Review Responses", number: 3 },
  { label: "Confirm Placements", number: 4 },
  { label: "Charge Fees", number: 5 },
]

// ── Response status badge styling ───────────────────────────────────────────

const RESPONSE_BADGE_CLASSES: Record<RolloverResponseStatus, string> = {
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "opted-out": "bg-red-50 text-red-700 border-red-200",
  "change-requested": "bg-amber-50 text-amber-700 border-amber-200",
  "no-response": "bg-gray-100 text-gray-600 border-gray-200",
}

const RESPONSE_LABELS: Record<RolloverResponseStatus, string> = {
  confirmed: "Confirmed",
  "opted-out": "Opted Out",
  "change-requested": "Change Requested",
  "no-response": "No Response",
}

// ── Filter type ─────────────────────────────────────────────────────────────

type FilterValue = "all" | RolloverResponseStatus

export default function RolloverPage() {
  const [filter, setFilter] = useState<FilterValue>("all")

  const filteredResponses =
    filter === "all"
      ? rolloverResponses
      : rolloverResponses.filter((r) => r.status === filter)

  function handleSendReminder(householdName: string) {
    toast.success(`Reminder sent to ${householdName}`)
  }

  function handleApproveChange(householdName: string) {
    toast.success(`Changes approved for ${householdName}`)
  }

  return (
    <>
      <Header title="Season Rollover" />
      <div className="flex-1 p-6 space-y-6">
        {/* Back link + title */}
        <div className="flex items-center gap-3">
          <Link href="/seasons">
            <Button variant="ghost" size="icon">
              <ArrowLeft />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Season Rollover
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {rolloverConfig.sourceSeasonName} &rarr;{" "}
              {rolloverConfig.targetSeasonName}
            </p>
          </div>
        </div>

        {/* ── Step Indicator ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const isCompleted = step.number < rolloverConfig.currentStep
            const isActive = step.number === rolloverConfig.currentStep
            const isFuture = step.number > rolloverConfig.currentStep

            return (
              <div key={step.number} className="flex items-center flex-1 last:flex-none">
                {/* Step circle + label */}
                <div className="flex flex-col items-center gap-1.5 min-w-[80px]">
                  <div
                    className={`flex items-center justify-center size-9 rounded-full text-sm font-semibold transition-colors ${
                      isCompleted
                        ? "bg-emerald-500 text-white"
                        : isActive
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isCompleted ? <Check className="size-4" /> : step.number}
                  </div>
                  <span
                    className={`text-xs font-medium text-center ${
                      isCompleted
                        ? "text-emerald-700"
                        : isActive
                          ? "text-blue-700"
                          : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connector line (skip for last step) */}
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 mt-[-20px] ${
                      step.number < rolloverConfig.currentStep
                        ? "bg-emerald-400"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>

        <Separator />

        {/* ── Step 1 — Configuration (Collapsed) ─────────────────────────── */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center size-6 rounded-full bg-emerald-500 text-white">
                <Check className="size-3.5" />
              </div>
              <CardTitle className="text-base">
                Step 1 &mdash; Configuration
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Source Season</p>
                <p className="font-medium">
                  {rolloverConfig.sourceSeasonName}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Target Season</p>
                <p className="font-medium">
                  {rolloverConfig.targetSeasonName}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Rollover Date</p>
                <p className="font-medium">
                  {formatDate(rolloverConfig.rolloverDate)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Registration Fee</p>
                <p className="font-medium">
                  {formatCurrency(rolloverConfig.registrationFee)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Step 2 — Notification (Collapsed) ──────────────────────────── */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center size-6 rounded-full bg-emerald-500 text-white">
                <Check className="size-3.5" />
              </div>
              <CardTitle className="text-base">
                Step 2 &mdash; Notify Families
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {rolloverSummary.notified} households notified on{" "}
              {formatDate(rolloverConfig.notificationDate)} via Email + SMS
            </p>
          </CardContent>
        </Card>

        {/* ── Step 3 — Review Responses (Expanded, Current) ──────────────── */}
        <Card className="border-blue-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center size-6 rounded-full bg-blue-500 text-white text-xs font-semibold">
                3
              </div>
              <CardTitle className="text-base">
                Step 3 &mdash; Review Responses
              </CardTitle>
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200 ml-auto"
              >
                Current Step
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <SummaryCard
                icon={<Users className="size-4" />}
                label="Notified"
                value={rolloverSummary.notified}
                color="blue"
              />
              <SummaryCard
                icon={<CheckCircle2 className="size-4" />}
                label="Confirmed"
                value={rolloverSummary.confirmed}
                color="emerald"
              />
              <SummaryCard
                icon={<XCircle className="size-4" />}
                label="Opted Out"
                value={rolloverSummary.optedOut}
                color="red"
              />
              <SummaryCard
                icon={<MessageSquare className="size-4" />}
                label="Changes"
                value={rolloverSummary.changeRequested}
                color="amber"
              />
              <SummaryCard
                icon={<Clock className="size-4" />}
                label="No Response"
                value={rolloverSummary.noResponse}
                color="gray"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { value: "all", label: "All" },
                  { value: "confirmed", label: "Confirmed" },
                  { value: "opted-out", label: "Opted Out" },
                  { value: "change-requested", label: "Changes" },
                  { value: "no-response", label: "No Response" },
                ] as const
              ).map((btn) => (
                <Button
                  key={btn.value}
                  variant={filter === btn.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(btn.value)}
                >
                  {btn.label}
                </Button>
              ))}
            </div>

            {/* Responses Table */}
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Household</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Current Classes</TableHead>
                    <TableHead>Next Season</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResponses.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-muted-foreground py-8"
                      >
                        No responses match the selected filter.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredResponses.map((response) => (
                      <TableRow
                        key={response.householdId}
                        className={getRowHighlight(response.status)}
                      >
                        <TableCell className="font-medium">
                          {response.householdName}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              RESPONSE_BADGE_CLASSES[response.status]
                            }
                          >
                            {RESPONSE_LABELS[response.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {response.currentClasses.join(", ")}
                        </TableCell>
                        <TableCell className="text-sm">
                          {response.suggestedClasses.length > 0
                            ? response.suggestedClasses.join(", ")
                            : "\u2014"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {response.reason && (
                            <span className="text-red-600">
                              {response.reason}
                            </span>
                          )}
                          {response.requestedChanges && (
                            <span className="text-amber-700">
                              {response.requestedChanges}
                            </span>
                          )}
                          {response.daysSinceNotification != null && (
                            <span className="text-gray-500">
                              {response.daysSinceNotification} days since
                              notification
                            </span>
                          )}
                          {!response.reason &&
                            !response.requestedChanges &&
                            response.daysSinceNotification == null && (
                              <span className="text-emerald-600">
                                Auto-rollover
                              </span>
                            )}
                        </TableCell>
                        <TableCell className="text-right">
                          {response.status === "no-response" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleSendReminder(response.householdName)
                              }
                            >
                              Send Reminder
                            </Button>
                          )}
                          {response.status === "change-requested" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleApproveChange(response.householdName)
                              }
                            >
                              Approve
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Age-Up Alerts */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <AlertTriangle className="size-4 text-amber-500" />
                Age-Up Alerts
              </h3>
              <div className="grid gap-3 sm:grid-cols-3">
                {ageUpFlags.map((flag) => (
                  <Card key={flag.studentName} className="border-amber-200 bg-amber-50/50">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center size-8 rounded-full bg-amber-100 text-amber-700 shrink-0">
                          <Zap className="size-4" />
                        </div>
                        <div className="text-sm">
                          <p className="font-medium">{flag.studentName}</p>
                          <p className="text-muted-foreground">
                            Aging out of {flag.currentAgeGroup} group
                          </p>
                          <p className="text-amber-700 font-medium mt-1">
                            Suggested: {flag.suggestedClass}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Step 4 — Confirm Placements (Grayed) ───────────────────────── */}
        <Card className="opacity-60">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center size-6 rounded-full bg-gray-200 text-gray-500 text-xs font-semibold">
                4
              </div>
              <CardTitle className="text-base text-muted-foreground">
                Step 4 &mdash; Confirm Placements
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {rolloverSummary.confirmed} registration fees &times;{" "}
              {formatCurrency(rolloverConfig.registrationFee)} ={" "}
              {formatCurrency(
                rolloverSummary.confirmed * rolloverConfig.registrationFee
              )}
            </p>
          </CardContent>
        </Card>

        {/* ── Step 5 — Charge Fees (Grayed / Disabled) ───────────────────── */}
        <Card className="opacity-60">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center size-6 rounded-full bg-gray-200 text-gray-500 text-xs font-semibold">
                5
              </div>
              <CardTitle className="text-base text-muted-foreground">
                Step 5 &mdash; Charge Fees
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Button disabled>Run Charges</Button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

// ── Helper: Summary Card ────────────────────────────────────────────────────

function SummaryCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: number
  color: "blue" | "emerald" | "red" | "amber" | "gray"
}) {
  const colorClasses: Record<typeof color, string> = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    red: "bg-red-50 text-red-700 border-red-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    gray: "bg-gray-50 text-gray-600 border-gray-200",
  }

  return (
    <div
      className={`rounded-lg border px-4 py-3 ${colorClasses[color]}`}
    >
      <div className="flex items-center gap-1.5 text-xs font-medium mb-1">
        {icon}
        {label}
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}

// ── Helper: Row highlight by status ─────────────────────────────────────────

function getRowHighlight(status: RolloverResponseStatus): string {
  switch (status) {
    case "confirmed":
      return ""
    case "opted-out":
      return "bg-red-50/30"
    case "change-requested":
      return "bg-amber-50/30"
    case "no-response":
      return "bg-gray-50/50"
  }
}
