"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Plus,
  Zap,
  Mail,
  MessageSquare,
  Clock,
  GitBranch,
  ChevronRight,
  Play,
  Pause,
  TrendingUp,
  Users,
  CheckCircle,
} from "lucide-react"
import type { Automation, AutomationTrigger } from "@/lib/types"

// ── Trigger config ──────────────────────────────────────────────────────────

const TRIGGER_CONFIG: Record<AutomationTrigger, { label: string; color: string }> = {
  "new-lead": { label: "New Lead", color: "bg-blue-50 text-blue-700 border-blue-200" },
  "trial-booked": { label: "Trial Booked", color: "bg-purple-50 text-purple-700 border-purple-200" },
  "trial-completed": { label: "Trial Completed", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  enrollment: { label: "Enrollment", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  "missed-class": { label: "Missed Class", color: "bg-amber-50 text-amber-700 border-amber-200" },
  "invoice-overdue": { label: "Invoice Overdue", color: "bg-red-50 text-red-700 border-red-200" },
  birthday: { label: "Birthday", color: "bg-pink-50 text-pink-700 border-pink-200" },
}

const STATUS_CONFIG = {
  active: { label: "Active", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  paused: { label: "Paused", color: "bg-amber-50 text-amber-700 border-amber-200" },
  draft: { label: "Draft", color: "bg-gray-100 text-gray-600 border-gray-200" },
}

function getStepIcon(type: string) {
  switch (type) {
    case "send-sms": return <MessageSquare className="size-3" />
    case "send-email": return <Mail className="size-3" />
    case "wait": return <Clock className="size-3" />
    case "condition": return <GitBranch className="size-3" />
    default: return <Zap className="size-3" />
  }
}

interface Props {
  automations: Automation[]
}

export default function ClientPage({ automations }: Props) {
  const [statusOverrides, setStatusOverrides] = useState<Record<string, Automation["status"]>>({})

  function toggleStatus(id: string, current: Automation["status"]) {
    setStatusOverrides((prev) => ({
      ...prev,
      [id]: current === "active" ? "paused" : "active",
    }))
  }

  const effectiveStatus = (auto: Automation): Automation["status"] =>
    statusOverrides[auto.id] ?? auto.status

  // Summary stats
  const stats = useMemo(() => {
    const active = automations.filter((a) => effectiveStatus(a) === "active").length
    const totalRuns = automations.reduce((sum, a) => sum + a.runsCount, 0)
    const avgSuccess = automations.length > 0
      ? automations.reduce((sum, a) => sum + a.successRate, 0) / automations.length
      : 0
    return { total: automations.length, active, totalRuns, avgSuccess }
  }, [statusOverrides])

  return (
    <>
      <Header title="Automations" />
      <div className="flex-1 p-6 space-y-6">
        <PageHeader
          title="Workflow Automations"
          description="Automate follow-ups, reminders, and engagement"
        >
          <Button render={<Link href="/automations/new" />}>
            <Plus data-icon="inline-start" />
            New Automation
          </Button>
        </PageHeader>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card size="sm">
            <CardContent className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-50 p-2">
                <Zap className="size-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Automations</p>
                <p className="text-xl font-semibold">{stats.total}</p>
              </div>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardContent className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-50 p-2">
                <Play className="size-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active</p>
                <p className="text-xl font-semibold">{stats.active}</p>
              </div>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardContent className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <Users className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Runs</p>
                <p className="text-xl font-semibold">{stats.totalRuns.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardContent className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-50 p-2">
                <CheckCircle className="size-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Success Rate</p>
                <p className="text-xl font-semibold">{Math.round(stats.avgSuccess * 100)}%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Automation cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {automations.map((auto) => {
            const status = effectiveStatus(auto)
            return (
              <Card
                key={auto.id}
                className="hover:shadow-md hover:border-foreground/20 transition-all"
              >
                <CardContent className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="rounded-lg bg-purple-50 p-2 mt-0.5">
                        <Zap className="size-4 text-purple-600" />
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/automations/${auto.id}`}
                          className="text-sm font-semibold hover:underline"
                        >
                          {auto.name}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {auto.description}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={status === "active"}
                      onCheckedChange={() => toggleStatus(auto.id, status)}
                    />
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className={TRIGGER_CONFIG[auto.trigger].color}>
                      {TRIGGER_CONFIG[auto.trigger].label}
                    </Badge>
                    <Badge variant="outline" className={STATUS_CONFIG[status].color}>
                      {STATUS_CONFIG[status].label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {auto.steps.length} steps
                    </span>
                  </div>

                  {/* Step preview */}
                  <div className="flex items-center gap-1 overflow-hidden">
                    {auto.steps.slice(0, 5).map((step, i) => (
                      <div key={step.id} className="flex items-center gap-1">
                        {i > 0 && <ChevronRight className="size-3 text-muted-foreground shrink-0" />}
                        <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 shrink-0">
                          {getStepIcon(step.type)}
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                            {step.label}
                          </span>
                        </div>
                      </div>
                    ))}
                    {auto.steps.length > 5 && (
                      <span className="text-[10px] text-muted-foreground">
                        +{auto.steps.length - 5} more
                      </span>
                    )}
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center gap-4 pt-1 border-t text-xs text-muted-foreground">
                    <span>{auto.runsCount.toLocaleString()} runs</span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="size-3" />
                      {Math.round(auto.successRate * 100)}% success
                    </span>
                    <Link
                      href={`/automations/${auto.id}`}
                      className="ml-auto text-foreground font-medium hover:underline flex items-center gap-0.5"
                    >
                      View <ChevronRight className="size-3" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </>
  )
}
