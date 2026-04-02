"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Automation, TextTemplate } from "@/lib/types"
import {
  ArrowLeft,
  Zap,
  Mail,
  MessageSquare,
  Clock,
  GitBranch,
  Tag,
  ArrowDown,
  Bell,
  ChevronUp,
  ChevronDown,
  Play,
  Pause,
  Users,
  CheckCircle,
  Pencil,
  Plus,
  Trash2,
  X,
  Save,
} from "lucide-react"
import type { AutomationStep, AutomationStepType, AutomationTrigger } from "@/lib/types"

// ── Config ──────────────────────────────────────────────────────────────────

const TRIGGER_CONFIG: Record<AutomationTrigger, { label: string; color: string; description: string }> = {
  "new-lead": { label: "New Lead", color: "bg-blue-50 text-blue-700 border-blue-200", description: "Fires when a new lead enters the system" },
  "trial-booked": { label: "Trial Booked", color: "bg-purple-50 text-purple-700 border-purple-200", description: "Fires when a trial class is scheduled" },
  "trial-completed": { label: "Trial Completed", color: "bg-indigo-50 text-indigo-700 border-indigo-200", description: "Fires after a trial class is attended" },
  enrollment: { label: "Enrollment", color: "bg-emerald-50 text-emerald-700 border-emerald-200", description: "Fires when a student enrolls" },
  "missed-class": { label: "Missed Class", color: "bg-amber-50 text-amber-700 border-amber-200", description: "Fires when a student is absent without notice" },
  "invoice-overdue": { label: "Invoice Overdue", color: "bg-red-50 text-red-700 border-red-200", description: "Fires when an invoice passes its due date" },
  birthday: { label: "Birthday", color: "bg-pink-50 text-pink-700 border-pink-200", description: "Fires on a student's birthday" },
}

const TRIGGER_OPTIONS = Object.entries(TRIGGER_CONFIG) as [AutomationTrigger, typeof TRIGGER_CONFIG[AutomationTrigger]][]

const STEP_CONFIG: Record<AutomationStepType, { label: string; icon: React.ElementType; color: string }> = {
  "send-sms": { label: "Send SMS", icon: MessageSquare, color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  "send-email": { label: "Send Email", icon: Mail, color: "bg-blue-50 text-blue-600 border-blue-200" },
  wait: { label: "Wait", icon: Clock, color: "bg-gray-100 text-gray-600 border-gray-200" },
  condition: { label: "Condition", icon: GitBranch, color: "bg-amber-50 text-amber-600 border-amber-200" },
  "update-stage": { label: "Update Stage", icon: ChevronUp, color: "bg-purple-50 text-purple-600 border-purple-200" },
  "add-tag": { label: "Add Tag", icon: Tag, color: "bg-pink-50 text-pink-600 border-pink-200" },
  "notify-staff": { label: "Notify Staff", icon: Bell, color: "bg-indigo-50 text-indigo-600 border-indigo-200" },
}

const STEP_TYPE_OPTIONS = Object.entries(STEP_CONFIG) as [AutomationStepType, typeof STEP_CONFIG[AutomationStepType]][]

// ── Step config field definitions per type ───────────────────────────────────

const STEP_FIELDS: Record<AutomationStepType, { key: string; label: string; type: "text" | "select" | "textarea" }[]> = {
  "send-sms": [
    { key: "template", label: "Message / Template", type: "textarea" },
  ],
  "send-email": [
    { key: "template", label: "Email Template", type: "text" },
  ],
  wait: [
    { key: "duration", label: "Duration", type: "text" },
  ],
  condition: [
    { key: "field", label: "Field", type: "text" },
    { key: "operator", label: "Operator", type: "text" },
    { key: "value", label: "Value", type: "text" },
  ],
  "update-stage": [
    { key: "stage", label: "New Stage", type: "text" },
  ],
  "add-tag": [
    { key: "tag", label: "Tag Name", type: "text" },
  ],
  "notify-staff": [
    { key: "message", label: "Notification Message", type: "textarea" },
    { key: "assignTo", label: "Assign To", type: "text" },
  ],
}

interface AutomationDetailPageProps {
  automation: Automation | undefined
  textTemplates: TextTemplate[]
}

export default function AutomationDetailPage({
  automation,
  textTemplates,
}: AutomationDetailPageProps) {

  // ── Editable state ──────────────────────────────────────────────────────
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(automation?.name ?? "")
  const [description, setDescription] = useState(automation?.description ?? "")
  const [trigger, setTrigger] = useState<AutomationTrigger>(automation?.trigger ?? "new-lead")
  const [steps, setSteps] = useState<AutomationStep[]>(automation?.steps ?? [])
  const [status, setStatus] = useState(automation?.status ?? "draft")

  // ── Sheet state ─────────────────────────────────────────────────────────
  const [editingStep, setEditingStep] = useState<AutomationStep | null>(null)
  const [editingStepIndex, setEditingStepIndex] = useState<number>(-1)
  const [isNewStep, setIsNewStep] = useState(false)
  const [triggerSheetOpen, setTriggerSheetOpen] = useState(false)

  if (!automation) {
    return (
      <>
        <Header title="Automations" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Automation not found</p>
            <Link href="/automations">
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="size-4 mr-2" /> Back to Automations
              </Button>
            </Link>
          </div>
        </div>
      </>
    )
  }

  const triggerCfg = TRIGGER_CONFIG[trigger]

  // ── Step actions ────────────────────────────────────────────────────────
  function openStepEditor(step: AutomationStep, index: number) {
    setEditingStep({ ...step, config: { ...step.config } })
    setEditingStepIndex(index)
    setIsNewStep(false)
  }

  function openAddStep(atIndex: number) {
    const newStep: AutomationStep = {
      id: `s-new-${Date.now()}`,
      type: "send-sms",
      label: "",
      config: {},
    }
    setEditingStep(newStep)
    setEditingStepIndex(atIndex)
    setIsNewStep(true)
  }

  function saveStep() {
    if (!editingStep) return
    const updated = [...steps]
    if (isNewStep) {
      updated.splice(editingStepIndex, 0, editingStep)
    } else {
      updated[editingStepIndex] = editingStep
    }
    setSteps(updated)
    setEditingStep(null)
  }

  function deleteStep(index: number) {
    setSteps((prev) => prev.filter((_, i) => i !== index))
  }

  function moveStep(index: number, direction: "up" | "down") {
    const target = direction === "up" ? index - 1 : index + 1
    if (target < 0 || target >= steps.length) return
    const updated = [...steps]
    ;[updated[index], updated[target]] = [updated[target], updated[index]]
    setSteps(updated)
  }

  function updateStepConfig(key: string, value: string) {
    if (!editingStep) return
    setEditingStep({
      ...editingStep,
      config: { ...editingStep.config, [key]: value },
    })
  }

  function toggleStatus() {
    setStatus((s) => (s === "active" ? "paused" : "active"))
  }

  return (
    <>
      <Header title="Automations" />
      <div className="flex-1 p-6 space-y-6">
        {/* Back link + header */}
        <div>
          <Link
            href="/automations"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-3"
          >
            <ArrowLeft className="size-3.5" /> Back to Automations
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="rounded-lg bg-purple-50 p-2.5 mt-0.5 shrink-0">
                <Zap className="size-5 text-purple-600" />
              </div>
              {editing ? (
                <div className="flex-1 space-y-2">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-lg font-bold"
                    placeholder="Automation name"
                  />
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[60px]"
                    placeholder="Description"
                  />
                </div>
              ) : (
                <div className="min-w-0">
                  <h1 className="text-xl font-bold">{name}</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
                </div>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              {editing ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setName(automation.name)
                      setDescription(automation.description)
                      setTrigger(automation.trigger)
                      setSteps([...automation.steps])
                      setStatus(automation.status)
                      setEditing(false)
                    }}
                  >
                    <X className="size-3.5 mr-1.5" /> Cancel
                  </Button>
                  <Button size="sm" onClick={() => setEditing(false)}>
                    <Save className="size-3.5 mr-1.5" /> Save
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                    <Pencil className="size-3.5 mr-1.5" /> Edit
                  </Button>
                  <Button
                    variant={status === "active" ? "outline" : "default"}
                    size="sm"
                    onClick={toggleStatus}
                  >
                    {status === "active" ? (
                      <><Pause className="size-3.5 mr-1.5" /> Pause</>
                    ) : (
                      <><Play className="size-3.5 mr-1.5" /> Activate</>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card size="sm">
            <CardContent className="flex items-center gap-3">
              <div className={`rounded-lg p-1.5 ${status === "active" ? "bg-emerald-50" : "bg-amber-50"}`}>
                {status === "active" ? (
                  <Play className="size-4 text-emerald-600" />
                ) : (
                  <Pause className="size-4 text-amber-600" />
                )}
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">Status</p>
                <p className="text-sm font-semibold capitalize">{status}</p>
              </div>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardContent className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-1.5">
                <Users className="size-4 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">Total Runs</p>
                <p className="text-sm font-semibold">{automation.runsCount.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardContent className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-50 p-1.5">
                <CheckCircle className="size-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">Success Rate</p>
                <p className="text-sm font-semibold">{Math.round(automation.successRate * 100)}%</p>
              </div>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardContent className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-50 p-1.5">
                <Zap className="size-4 text-purple-600" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">Steps</p>
                <p className="text-sm font-semibold">{steps.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Visual flow */}
        <div>
          <h2 className="text-sm font-semibold mb-4">Workflow</h2>
          <div className="max-w-lg mx-auto">
            {/* Trigger node */}
            <div
              className={`rounded-xl border-2 ${triggerCfg.color} p-4 text-center transition-all ${
                editing ? "cursor-pointer hover:shadow-md hover:ring-2 hover:ring-foreground/10" : ""
              }`}
              onClick={() => editing && setTriggerSheetOpen(true)}
            >
              <div className="flex items-center justify-center gap-2">
                <Zap className="size-4" />
                <span className="text-sm font-semibold">Trigger: {triggerCfg.label}</span>
                {editing && <Pencil className="size-3 opacity-50" />}
              </div>
              <p className="text-xs mt-1 opacity-70">{triggerCfg.description}</p>
            </div>

            {/* Add step at top (edit mode) */}
            {editing && (
              <div className="flex justify-center py-2">
                <button
                  onClick={() => openAddStep(0)}
                  className="flex items-center gap-1 px-3 py-1 text-xs rounded-full border border-dashed border-foreground/20 text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                >
                  <Plus className="size-3" /> Add step
                </button>
              </div>
            )}

            {/* Steps */}
            {steps.map((step, index) => {
              const config = STEP_CONFIG[step.type]
              const StepIcon = config.icon
              return (
                <div key={step.id}>
                  {/* Connector */}
                  {(!editing || index > 0) && (
                    <div className="flex justify-center py-2">
                      <div className="flex flex-col items-center">
                        <div className="w-px h-4 bg-border" />
                        <ArrowDown className="size-4 text-muted-foreground" />
                      </div>
                    </div>
                  )}

                  {/* Step card */}
                  <div
                    className={`rounded-xl border ${config.color} p-4 transition-all ${
                      editing ? "cursor-pointer hover:shadow-md hover:ring-2 hover:ring-foreground/10" : ""
                    }`}
                    onClick={() => editing && openStepEditor(step, index)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-background/50 p-2">
                        <StepIcon className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px]">
                            {config.label}
                          </Badge>
                          {editing && <Pencil className="size-3 opacity-40" />}
                        </div>
                        <p className="text-sm font-medium mt-1">{step.label}</p>
                        {!editing && Object.keys(step.config).length > 0 && (
                          <div className="mt-2 space-y-1">
                            {Object.entries(step.config).map(([key, value]) => (
                              <div key={key} className="flex gap-2 text-xs">
                                <span className="text-muted-foreground capitalize">
                                  {key.replace(/([A-Z])/g, " $1")}:
                                </span>
                                <span className="font-medium">{value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {editing && (
                        <div className="flex flex-col gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => moveStep(index, "up")}
                            disabled={index === 0}
                            className="p-1 rounded hover:bg-background/50 disabled:opacity-20 transition-colors"
                          >
                            <ChevronUp className="size-3.5" />
                          </button>
                          <button
                            onClick={() => moveStep(index, "down")}
                            disabled={index === steps.length - 1}
                            className="p-1 rounded hover:bg-background/50 disabled:opacity-20 transition-colors"
                          >
                            <ChevronDown className="size-3.5" />
                          </button>
                          <button
                            onClick={() => deleteStep(index)}
                            className="p-1 rounded hover:bg-red-100 text-red-500 transition-colors"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Add step between (edit mode) */}
                  {editing && (
                    <div className="flex justify-center py-2">
                      <button
                        onClick={() => openAddStep(index + 1)}
                        className="flex items-center gap-1 px-3 py-1 text-xs rounded-full border border-dashed border-foreground/20 text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                      >
                        <Plus className="size-3" /> Add step
                      </button>
                    </div>
                  )}
                </div>
              )
            })}

            {/* End node */}
            {!editing && (
              <>
                <div className="flex justify-center py-2">
                  <div className="flex flex-col items-center">
                    <div className="w-px h-4 bg-border" />
                    <ArrowDown className="size-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="rounded-xl border-2 border-dashed border-muted-foreground/30 p-3 text-center">
                  <p className="text-sm text-muted-foreground font-medium">End of Workflow</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Trigger Edit Sheet ─────────────────────────────────────────────── */}
      <Sheet open={triggerSheetOpen} onOpenChange={setTriggerSheetOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Change Trigger</SheetTitle>
            <SheetDescription>Select when this automation should fire</SheetDescription>
          </SheetHeader>
          <div className="px-4 space-y-2 mt-2">
            {TRIGGER_OPTIONS.map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => {
                  setTrigger(key)
                  setTriggerSheetOpen(false)
                }}
                className={`w-full text-left rounded-xl border p-3 transition-all ${
                  trigger === key
                    ? `${cfg.color} border-2 shadow-sm`
                    : "hover:bg-muted/50 hover:border-foreground/20"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Zap className="size-4 shrink-0" />
                  <span className="text-sm font-semibold">{cfg.label}</span>
                  {trigger === key && (
                    <Badge className="ml-auto text-[10px]">Current</Badge>
                  )}
                </div>
                <p className="text-xs mt-0.5 text-muted-foreground">{cfg.description}</p>
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* ── Step Edit Sheet ────────────────────────────────────────────────── */}
      <Sheet
        open={editingStep !== null}
        onOpenChange={(open) => {
          if (!open) setEditingStep(null)
        }}
      >
        <SheetContent className="sm:max-w-md overflow-y-auto">
          {editingStep && (
            <>
              <SheetHeader>
                <SheetTitle>{isNewStep ? "Add Step" : "Edit Step"}</SheetTitle>
                <SheetDescription>
                  Configure this workflow step
                </SheetDescription>
              </SheetHeader>
              <div className="px-4 space-y-4 mt-2">
                {/* Step type */}
                <div className="space-y-1.5">
                  <Label>Step Type</Label>
                  <Select
                    value={editingStep.type}
                    onValueChange={(val) => {
                      if (val) {
                        setEditingStep({
                          ...editingStep,
                          type: val as AutomationStepType,
                          config: {},
                        })
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STEP_TYPE_OPTIONS.map(([key, cfg]) => {
                        const Icon = cfg.icon
                        return (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <Icon className="size-3.5" />
                              {cfg.label}
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Step label */}
                <div className="space-y-1.5">
                  <Label>Label</Label>
                  <Input
                    value={editingStep.label}
                    onChange={(e) =>
                      setEditingStep({ ...editingStep, label: e.target.value })
                    }
                    placeholder="e.g. Send welcome text"
                  />
                </div>

                <Separator />

                {/* Type-specific config fields */}
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Configuration
                </p>
                {(STEP_FIELDS[editingStep.type] ?? []).map((field) => (
                  <div key={field.key} className="space-y-1.5">
                    <Label>{field.label}</Label>
                    {field.type === "textarea" ? (
                      <Textarea
                        value={editingStep.config[field.key] ?? ""}
                        onChange={(e) => updateStepConfig(field.key, e.target.value)}
                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                        className="min-h-[80px]"
                      />
                    ) : (
                      <Input
                        value={editingStep.config[field.key] ?? ""}
                        onChange={(e) => updateStepConfig(field.key, e.target.value)}
                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                      />
                    )}
                  </div>
                ))}

                {/* Template quick-insert for SMS/email */}
                {(editingStep.type === "send-sms" || editingStep.type === "send-email") && (
                  <>
                    <Separator />
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Quick Insert Template
                    </p>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {textTemplates.map((tpl) => (
                        <button
                          key={tpl.id}
                          onClick={() => updateStepConfig("template", tpl.name)}
                          className="w-full text-left px-2 py-1.5 rounded-md hover:bg-muted text-xs transition-colors"
                        >
                          <span className="font-medium">{tpl.name}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                <Separator />

                <div className="flex gap-2">
                  <Button className="flex-1" onClick={saveStep}>
                    <Save className="size-3.5 mr-1.5" />
                    {isNewStep ? "Add Step" : "Save Changes"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditingStep(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
