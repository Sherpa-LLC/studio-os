"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  ArrowRight,
  Zap,
  Mail,
  MessageSquare,
  Clock,
  GitBranch,
  Tag,
  Bell,
  ChevronRight,
  Sparkles,
  PenLine,
} from "lucide-react"
import { toast } from "sonner"
import type { AutomationTrigger, AutomationStepType, AutomationStep } from "@/lib/types"

// ── Trigger config ──────────────────────────────────────────────────────────

const TRIGGER_CONFIG: Record<
  AutomationTrigger,
  { label: string; color: string; bg: string; description: string }
> = {
  "new-lead": {
    label: "New Lead",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    description: "When a new lead enters the system",
  },
  "trial-booked": {
    label: "Trial Booked",
    color: "text-purple-700",
    bg: "bg-purple-50 border-purple-200",
    description: "When a trial class is scheduled",
  },
  "trial-completed": {
    label: "Trial Completed",
    color: "text-indigo-700",
    bg: "bg-indigo-50 border-indigo-200",
    description: "After a trial class is attended",
  },
  enrollment: {
    label: "Enrollment",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    description: "When a student enrolls in a class",
  },
  "missed-class": {
    label: "Missed Class",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    description: "When a student is absent without notice",
  },
  "invoice-overdue": {
    label: "Invoice Overdue",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    description: "When an invoice passes its due date",
  },
  birthday: {
    label: "Birthday",
    color: "text-pink-700",
    bg: "bg-pink-50 border-pink-200",
    description: "On a student's birthday",
  },
}

const TRIGGERS = Object.entries(TRIGGER_CONFIG) as [
  AutomationTrigger,
  (typeof TRIGGER_CONFIG)[AutomationTrigger],
][]

// ── Step type icons ─────────────────────────────────────────────────────────

const STEP_ICONS: Record<AutomationStepType, React.ElementType> = {
  "send-sms": MessageSquare,
  "send-email": Mail,
  wait: Clock,
  condition: GitBranch,
  "update-stage": Zap,
  "add-tag": Tag,
  "notify-staff": Bell,
}

const STEP_COLORS: Record<AutomationStepType, string> = {
  "send-sms": "bg-emerald-100 text-emerald-700",
  "send-email": "bg-blue-100 text-blue-700",
  wait: "bg-gray-100 text-gray-600",
  condition: "bg-amber-100 text-amber-700",
  "update-stage": "bg-purple-100 text-purple-700",
  "add-tag": "bg-pink-100 text-pink-700",
  "notify-staff": "bg-indigo-100 text-indigo-700",
}

// ── Templates ───────────────────────────────────────────────────────────────

interface Template {
  id: string
  name: string
  description: string
  trigger: AutomationTrigger
  steps: { type: AutomationStepType; label: string }[]
  linkedAutomationId: string // for prototype navigation
}

const TEMPLATES: Template[] = [
  {
    id: "tpl-lead",
    name: "Lead Nurture Sequence",
    description:
      "Welcome new leads with a text, follow up with an info packet email, and alert staff if they don't respond.",
    trigger: "new-lead",
    steps: [
      { type: "send-sms", label: "Welcome text" },
      { type: "wait", label: "Wait 1 day" },
      { type: "send-email", label: "Info packet email" },
      { type: "wait", label: "Wait 2 days" },
      { type: "condition", label: "Check if replied" },
      { type: "send-sms", label: "Follow-up text" },
      { type: "notify-staff", label: "Alert front desk" },
    ],
    linkedAutomationId: "auto-001",
  },
  {
    id: "tpl-trial",
    name: "Trial Class Reminders",
    description:
      "Reduce no-shows with a confirmation, day-before reminder, and final 2-hour nudge before the trial.",
    trigger: "trial-booked",
    steps: [
      { type: "send-sms", label: "Confirmation text" },
      { type: "send-email", label: "Waiver & info email" },
      { type: "wait", label: "Day before class" },
      { type: "send-sms", label: "Day-before reminder" },
      { type: "wait", label: "2 hours before" },
      { type: "send-sms", label: "Final reminder" },
    ],
    linkedAutomationId: "auto-002",
  },
  {
    id: "tpl-conversion",
    name: "Post-Trial Conversion",
    description:
      "After a trial, send a thank-you and enrollment offer. Follow up if they haven't signed up.",
    trigger: "trial-completed",
    steps: [
      { type: "send-sms", label: "Thank you text" },
      { type: "wait", label: "Wait 1 day" },
      { type: "send-email", label: "Enrollment offer" },
      { type: "wait", label: "Wait 3 days" },
      { type: "condition", label: "Check if enrolled" },
      { type: "send-sms", label: "Gentle follow-up" },
    ],
    linkedAutomationId: "auto-003",
  },
  {
    id: "tpl-missed",
    name: "Missed Class Check-In",
    description:
      "Reach out to absent students with a caring check-in and notify staff if there's no response.",
    trigger: "missed-class",
    steps: [
      { type: "send-sms", label: "Check-in text" },
      { type: "wait", label: "Wait 1 day" },
      { type: "condition", label: "Check if responded" },
      { type: "notify-staff", label: "Alert instructor" },
    ],
    linkedAutomationId: "auto-004",
  },
  {
    id: "tpl-payment",
    name: "Payment Reminder",
    description:
      "Send a friendly payment reminder, then escalate with an urgent notice if the invoice stays unpaid.",
    trigger: "invoice-overdue",
    steps: [
      { type: "send-sms", label: "Friendly reminder" },
      { type: "wait", label: "Wait 3 days" },
      { type: "send-email", label: "Urgent notice" },
      { type: "wait", label: "Wait 5 days" },
      { type: "notify-staff", label: "Flag for review" },
    ],
    linkedAutomationId: "auto-005",
  },
  {
    id: "tpl-birthday",
    name: "Birthday Celebration",
    description:
      "Delight students on their special day with a personalized birthday message and a tag for tracking.",
    trigger: "birthday",
    steps: [
      { type: "send-sms", label: "Birthday message" },
      { type: "add-tag", label: "Tag: celebrated" },
    ],
    linkedAutomationId: "auto-006",
  },
]

// ── Mini workflow preview ───────────────────────────────────────────────────

function StepChain({
  steps,
}: {
  steps: { type: AutomationStepType; label: string }[]
}) {
  return (
    <div className="flex items-center gap-0.5 overflow-hidden">
      {steps.map((step, i) => {
        const Icon = STEP_ICONS[step.type]
        return (
          <div key={i} className="flex items-center gap-0.5 shrink-0">
            {i > 0 && (
              <div className="w-3 h-px bg-border shrink-0" />
            )}
            <div
              className={`flex items-center justify-center size-6 rounded-full ${STEP_COLORS[step.type]}`}
              title={step.label}
            >
              <Icon className="size-3" />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function NewAutomationPage() {
  const router = useRouter()
  const [scratchTrigger, setScratchTrigger] = useState<AutomationTrigger | null>(null)
  const [scratchName, setScratchName] = useState("")

  function useTemplate(template: Template) {
    toast.success(`Created "${template.name}" automation`)
    router.push(`/automations/${template.linkedAutomationId}`)
  }

  function createFromScratch() {
    if (!scratchTrigger || !scratchName.trim()) return
    toast.success(`Created "${scratchName}" automation`)
    // In prototype: navigate to the first automation's editor as demo
    router.push("/automations/auto-001")
  }

  return (
    <>
      <Header title="Automations" />
      <div className="flex-1 p-6 space-y-8">
        {/* Header */}
        <div>
          <Link
            href="/automations"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-3"
          >
            <ArrowLeft className="size-3.5" /> Back to Automations
          </Link>
          <PageHeader
            title="Create Automation"
            description="Choose a template to get started quickly, or build from scratch"
          />
        </div>

        {/* ── Start from Scratch ──────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <PenLine className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Start from Scratch</h2>
          </div>

          <Card className="border-dashed">
            <CardContent className="space-y-4">
              {/* Trigger selector */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  What should trigger this automation?
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {TRIGGERS.map(([key, cfg]) => {
                    const isSelected = scratchTrigger === key
                    return (
                      <button
                        key={key}
                        onClick={() => setScratchTrigger(key)}
                        className={`text-left rounded-lg border p-2.5 transition-all ${
                          isSelected
                            ? `${cfg.bg} ring-2 ring-current/20 shadow-sm`
                            : "hover:bg-muted/50 hover:border-foreground/20"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <Zap
                            className={`size-3.5 shrink-0 ${isSelected ? cfg.color : "text-muted-foreground"}`}
                          />
                          <span
                            className={`text-xs font-medium ${isSelected ? cfg.color : ""}`}
                          >
                            {cfg.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1 leading-tight">
                          {cfg.description}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Name + create */}
              {scratchTrigger && (
                <div className="flex items-end gap-3 pt-1">
                  <div className="flex-1 space-y-1.5">
                    <Label htmlFor="scratch-name">Automation Name</Label>
                    <Input
                      id="scratch-name"
                      value={scratchName}
                      onChange={(e) => setScratchName(e.target.value)}
                      placeholder="e.g. Welcome Series, Payment Chase..."
                    />
                  </div>
                  <Button
                    onClick={createFromScratch}
                    disabled={!scratchName.trim()}
                  >
                    Create
                    <ArrowRight data-icon="inline-end" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* ── Templates ───────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Templates</h2>
            <span className="text-xs text-muted-foreground">
              Pre-built workflows for common studio needs
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {TEMPLATES.map((tpl) => {
              const triggerCfg = TRIGGER_CONFIG[tpl.trigger]
              return (
                <Card
                  key={tpl.id}
                  className="hover:shadow-md hover:border-foreground/20 transition-all group"
                >
                  <CardContent className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant="outline"
                            className={triggerCfg.bg}
                          >
                            <Zap className="size-3 mr-1" />
                            {triggerCfg.label}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {tpl.steps.length} steps
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold">{tpl.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {tpl.description}
                        </p>
                      </div>
                    </div>

                    {/* Step chain preview */}
                    <div className="py-1">
                      <StepChain steps={tpl.steps} />
                    </div>

                    {/* Step labels */}
                    <div className="flex flex-wrap gap-1">
                      {tpl.steps.map((step, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
                        >
                          {step.label}
                        </span>
                      ))}
                    </div>

                    {/* Action */}
                    <div className="flex items-center justify-end pt-1 border-t">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => useTemplate(tpl)}
                        className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      >
                        Use Template
                        <ChevronRight className="size-3.5" />
                      </Button>
                    </div>
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
