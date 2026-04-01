"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/dashboard/stat-card"
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
  Brain,
  Sparkles,
  ShieldAlert,
  Calendar,
  CreditCard,
  MessageSquare,
  Tag,
  DollarSign,
  Users,
  UserPlus,
  UserMinus,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  BarChart3,
  Star,
  Target,
} from "lucide-react"
import {
  dailyBriefing,
  atRiskFamilies,
  leadPriorities,
  revenueForecast,
  suggestedActions,
  insightPatterns,
  type RiskLevel,
  type RiskSignalType,
  type ActionPriority,
  type ActionCategory,
} from "@/data/insights"
import { formatCurrency } from "@/lib/format"
import { toast } from "sonner"

// ── Config ────────────────────────────────────────────────────────────────

const RISK_BADGE: Record<RiskLevel, { label: string; className: string }> = {
  high: { label: "High Risk", className: "bg-red-50 text-red-700 border-red-200" },
  medium: { label: "Medium Risk", className: "bg-amber-50 text-amber-700 border-amber-200" },
  low: { label: "Low Risk", className: "bg-blue-50 text-blue-700 border-blue-200" },
}

const SIGNAL_ICON: Record<RiskSignalType, React.ElementType> = {
  attendance: Calendar,
  payment: CreditCard,
  communication: MessageSquare,
  enrollment: Tag,
}

const PRIORITY_STYLE: Record<ActionPriority, { dot: string; label: string }> = {
  urgent: { dot: "bg-red-500", label: "Urgent" },
  high: { dot: "bg-amber-500", label: "High" },
  medium: { dot: "bg-blue-500", label: "Medium" },
}

const CATEGORY_BADGE: Record<ActionCategory, { label: string; className: string }> = {
  retention: { label: "Retention", className: "bg-red-50 text-red-700 border-red-200" },
  growth: { label: "Growth", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  communication: { label: "Communication", className: "bg-blue-50 text-blue-700 border-blue-200" },
  operations: { label: "Operations", className: "bg-purple-50 text-purple-700 border-purple-200" },
}

const PATTERN_ICON: Record<string, React.ElementType> = {
  attendance: Clock,
  reviews: Star,
  enrollment: Target,
  financial: BarChart3,
}

// ── Section Header ────────────────────────────────────────────────────────

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className="h-4 w-1 rounded-full bg-primary" />
      <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
        {children}
      </h2>
    </div>
  )
}

// ── Score bar ─────────────────────────────────────────────────────────────

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 70
      ? "bg-emerald-500"
      : score >= 40
        ? "bg-amber-500"
        : "bg-red-400"

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-20 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-mono font-medium tabular-nums">{score}%</span>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function InsightsPage() {
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set())

  function markActionDone(actionId: string, title: string) {
    setCompletedActions((prev) => {
      const next = new Set(prev)
      next.add(actionId)
      return next
    })
    toast.success("Action marked as done", { description: title })
  }

  return (
    <>
      <Header title="Insights" />
      <div className="flex-1 p-6 space-y-8">
        <PageHeader
          title="Insights"
          description="AI-powered intelligence for your studio"
        />

        {/* ── Section 1: Daily Briefing ─────────────────────────────────── */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/[0.03] to-transparent">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Brain className="size-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-semibold">{dailyBriefing.greeting}</p>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {dailyBriefing.summary}
                </p>
                <ul className="mt-4 space-y-2">
                  {dailyBriefing.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Sparkles className="size-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground mt-4">
                  Updated today at 8:00 AM
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Section 2: At-Risk Families ───────────────────────────────── */}
        <div>
          <SectionHeader>At-Risk Families</SectionHeader>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {atRiskFamilies.map((family) => {
              const riskConfig = RISK_BADGE[family.riskLevel]
              return (
                <Card key={family.householdId}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-sm">{family.householdName}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {family.studentNames.join(", ")}
                        </p>
                      </div>
                      <Badge variant="outline" className={riskConfig.className}>
                        {riskConfig.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Signals */}
                    <div className="space-y-2">
                      {family.signals.map((signal, i) => {
                        const SignalIcon = SIGNAL_ICON[signal.type]
                        return (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <SignalIcon className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
                            <span>{signal.description}</span>
                          </div>
                        )
                      })}
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Last engaged {family.daysSinceLastEngagement} days ago
                    </p>

                    <Separator />

                    {/* Recommended action */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Recommended
                      </p>
                      <p className="text-sm">{family.recommendedAction}</p>
                      <Link href={`/households/${family.householdId}`}>
                        <Button variant="outline" size="sm">
                          View Household
                          <ArrowRight data-icon="inline-end" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* ── Section 3: Lead Priorities ────────────────────────────────── */}
        <div>
          <SectionHeader>Lead Priorities</SectionHeader>
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Lead</TableHead>
                  <TableHead>Child</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Key Signals</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leadPriorities.map((lead, index) => (
                  <TableRow key={lead.leadId}>
                    <TableCell className="font-mono text-sm font-medium">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{lead.leadName}</p>
                        <p className="text-xs text-muted-foreground">
                          {lead.daysInPipeline}d in pipeline
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{lead.childName}, {lead.childAge}</p>
                        <p className="text-xs text-muted-foreground">{lead.discipline}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize text-xs">
                        {lead.source.replace("-", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <ScoreBar score={lead.conversionScore} />
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <p className="text-xs text-muted-foreground truncate">
                        {lead.signals[0]}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Link href="/crm">
                        <Button variant="ghost" size="icon-sm">
                          <ArrowRight className="size-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* ── Section 4: Revenue Forecast ───────────────────────────────── */}
        <div>
          <SectionHeader>Revenue Forecast</SectionHeader>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Projected MRR"
              value={formatCurrency(revenueForecast.projectedMrr)}
              trend={revenueForecast.mrrTrend}
              icon={DollarSign}
            />
            <StatCard
              title="Net Student Movement"
              value={`+${revenueForecast.netStudentMovement}`}
              subtitle="enrollments - withdrawals"
              trend={revenueForecast.netStudentMovement > 0 ? 100 : -100}
              trendLabel={`${revenueForecast.newEnrollments} in, ${revenueForecast.withdrawals} out`}
              icon={Users}
            />
            <StatCard
              title="New Enrollments"
              value={String(revenueForecast.newEnrollments)}
              trend={12.5}
              trendLabel="vs last month"
              icon={UserPlus}
            />
            <StatCard
              title="Withdrawals"
              value={String(revenueForecast.withdrawals)}
              trend={-25}
              trendLabel="vs last month"
              icon={UserMinus}
              invertTrend
            />
          </div>
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="size-4 text-primary shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">
                  {revenueForecast.narrative}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Section 5: Suggested Actions ──────────────────────────────── */}
        <div>
          <SectionHeader>Suggested Actions</SectionHeader>
          <div className="rounded-lg border bg-card divide-y">
            {suggestedActions.map((action) => {
              const isDone = completedActions.has(action.id)
              const priorityStyle = PRIORITY_STYLE[action.priority]
              const categoryConfig = CATEGORY_BADGE[action.category]

              if (isDone) return null

              return (
                <div
                  key={action.id}
                  className="flex items-start gap-3 p-4"
                >
                  {/* Priority dot */}
                  <div className={`size-2.5 rounded-full shrink-0 mt-1.5 ${priorityStyle.dot}`} />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm">{action.title}</p>
                      <Badge variant="outline" className={`text-[10px] ${categoryConfig.className}`}>
                        {categoryConfig.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {action.context}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {action.linkHref && (
                      <Link href={action.linkHref}>
                        <Button variant="ghost" size="icon-sm">
                          <ArrowRight className="size-3.5" />
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => markActionDone(action.id, action.title)}
                    >
                      <CheckCircle2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              )
            })}
            {completedActions.size === suggestedActions.length && (
              <div className="p-8 text-center text-sm text-muted-foreground">
                All caught up! No pending actions.
              </div>
            )}
          </div>
        </div>

        {/* ── Section 6: Patterns & Trends ──────────────────────────────── */}
        <div>
          <SectionHeader>Patterns & Trends</SectionHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insightPatterns.map((pattern) => {
              const PatternIcon = PATTERN_ICON[pattern.category] ?? BarChart3
              return (
                <Card key={pattern.id}>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <PatternIcon className="size-4 text-primary" />
                      </div>
                      <p className="text-sm font-semibold">{pattern.title}</p>
                    </div>
                    <p className="text-2xl font-bold text-primary mb-2">
                      {pattern.dataPoint}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {pattern.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
