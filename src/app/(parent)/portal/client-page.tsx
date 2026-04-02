"use client"

import Link from "next/link"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DISCIPLINE_COLORS, DAY_LABELS } from "@/lib/constants"
import { formatTime } from "@/lib/format"
import type { Class } from "@/lib/types"
import {
  CalendarDays,
  Clock,
  CreditCard,
  MapPin,
  MessageSquare,
  Users,
  ArrowRight,
} from "lucide-react"

const MOCK_MESSAGES = [
  {
    id: "msg-1",
    subject: "Spring Recital Costume Measurements",
    preview: "Please bring your child in for costume measurements this week...",
    date: "Mar 25",
    channel: "email" as const,
  },
  {
    id: "msg-2",
    subject: "Schedule Change: Studio B Maintenance",
    preview: "Due to scheduled maintenance, all Studio B classes on March 28...",
    date: "Mar 22",
    channel: "sms" as const,
  },
  {
    id: "msg-3",
    subject: "Summer Intensive Registration Opens April 1",
    preview: "We are excited to announce our 2026 Summer Intensive program...",
    date: "Mar 20",
    channel: "email" as const,
  },
]

interface ParentDashboardClientProps {
  enrolledClasses: Class[]
  instructorNames: Record<string, string>
}

export default function ParentDashboardClient({
  enrolledClasses,
  instructorNames,
}: ParentDashboardClientProps) {
  // Sort by day then by start time for upcoming view
  const dayOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
  const sortedClasses = [...enrolledClasses].sort((a, b) => {
    const dayDiff = dayOrder.indexOf(a.schedule.day) - dayOrder.indexOf(b.schedule.day)
    if (dayDiff !== 0) return dayDiff
    return a.schedule.startTime.localeCompare(b.schedule.startTime)
  })

  const upcomingClasses = sortedClasses.slice(0, 5)

  return (
    <div className="space-y-6">
      <PageHeader title="Welcome back, Jennifer" description="Here's what's happening with your family" />

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card size="sm">
          <CardContent className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
              <Users className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">2</p>
              <p className="text-xs text-muted-foreground">Enrolled Children</p>
            </div>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardContent className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <CalendarDays className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{enrolledClasses.length}</p>
              <p className="text-xs text-muted-foreground">Active Classes</p>
            </div>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardContent className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <CreditCard className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">Apr 1</p>
              <p className="text-xs text-muted-foreground">Next Payment</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming classes */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Upcoming Classes</CardTitle>
          <Link href="/portal/schedule">
            <Button variant="ghost" size="sm">
              View Schedule
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingClasses.map((cls) => (
              <div
                key={cls.id}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <div
                  className="h-10 w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: DISCIPLINE_COLORS[cls.discipline] }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{cls.name}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {DAY_LABELS[cls.schedule.day]},{" "}
                      {formatTime(cls.schedule.startTime)} - {formatTime(cls.schedule.endTime)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {cls.schedule.room}
                    </span>
                  </div>
                </div>
                <div className="hidden sm:block text-xs text-muted-foreground text-right">
                  {instructorNames[cls.instructorId] ?? "TBD"}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent messages */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Recent Messages</CardTitle>
          <Link href="/portal/messages">
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {MOCK_MESSAGES.map((msg) => (
              <div
                key={msg.id}
                className="flex items-start gap-3 rounded-lg border p-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{msg.subject}</p>
                    <Badge variant="secondary" className="shrink-0">
                      {msg.channel === "email" ? "Email" : "SMS"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {msg.preview}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{msg.date}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
