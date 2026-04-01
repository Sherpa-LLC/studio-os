"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { leads } from "@/data/leads"
import { formatDate, formatPhone } from "@/lib/format"
import { DISCIPLINE_LABELS } from "@/lib/constants"
import {
  Plus,
  Users,
  UserPlus,
  TrendingUp,
  Clock,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  ChevronRight,
  Save,
} from "lucide-react"
import type { Lead, LeadStage, Discipline } from "@/lib/types"

// ── Stage configuration ──────────────────────────────────────────────────────

interface StageConfig {
  label: string
  color: string
  bgColor: string
}

const STAGE_CONFIG: Record<LeadStage, StageConfig> = {
  new: { label: "New", color: "text-blue-700", bgColor: "bg-blue-50 border-blue-200" },
  contacted: { label: "Contacted", color: "text-amber-700", bgColor: "bg-amber-50 border-amber-200" },
  "trial-scheduled": { label: "Trial Scheduled", color: "text-purple-700", bgColor: "bg-purple-50 border-purple-200" },
  "trial-completed": { label: "Trial Completed", color: "text-indigo-700", bgColor: "bg-indigo-50 border-indigo-200" },
  registered: { label: "Registered", color: "text-emerald-700", bgColor: "bg-emerald-50 border-emerald-200" },
  lost: { label: "Lost", color: "text-gray-600", bgColor: "bg-gray-100 border-gray-200" },
}

const STAGE_ORDER: LeadStage[] = [
  "new",
  "contacted",
  "trial-scheduled",
  "trial-completed",
  "registered",
  "lost",
]

// ── Source badge config ──────────────────────────────────────────────────────

const SOURCE_CONFIG: Record<Lead["source"], { label: string; className: string }> = {
  website: { label: "Website", className: "bg-blue-50 text-blue-700 border-blue-200" },
  "walk-in": { label: "Walk-in", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  referral: { label: "Referral", className: "bg-purple-50 text-purple-700 border-purple-200" },
  trial: { label: "Trial", className: "bg-amber-50 text-amber-700 border-amber-200" },
  "social-media": { label: "Social Media", className: "bg-pink-50 text-pink-700 border-pink-200" },
  phone: { label: "Phone", className: "bg-gray-100 text-gray-600 border-gray-200" },
}

// ── Mock activity timeline ───────────────────────────────────────────────────

interface ActivityEntry {
  id: string
  type: "note" | "email" | "call" | "stage-change" | "trial"
  description: string
  date: string
  user: string
}

function generateActivities(lead: Lead): ActivityEntry[] {
  const activities: ActivityEntry[] = []
  let idx = 0

  activities.push({
    id: `act-${idx++}`,
    type: "note",
    description: `Lead created from ${SOURCE_CONFIG[lead.source].label.toLowerCase()} source`,
    date: lead.createdAt,
    user: "System",
  })

  if (lead.stage !== "new") {
    const contactDate = lead.lastContactedAt ?? lead.createdAt
    activities.push({
      id: `act-${idx++}`,
      type: "call",
      description: "Initial outreach call made",
      date: lead.createdAt,
      user: "Sarah Mitchell",
    })
    activities.push({
      id: `act-${idx++}`,
      type: "email",
      description: "Welcome information packet sent via email",
      date: lead.createdAt,
      user: "Sarah Mitchell",
    })

    if (["trial-scheduled", "trial-completed", "registered", "lost"].includes(lead.stage)) {
      activities.push({
        id: `act-${idx++}`,
        type: "stage-change",
        description: "Stage changed to Trial Scheduled",
        date: contactDate,
        user: "Sarah Mitchell",
      })
    }

    if (["trial-completed", "registered", "lost"].includes(lead.stage)) {
      activities.push({
        id: `act-${idx++}`,
        type: "trial",
        description: `Trial class attended - ${DISCIPLINE_LABELS[lead.interestDiscipline]}`,
        date: contactDate,
        user: lead.assignedTo ?? "Jennifer Walsh",
      })
    }

    if (lead.stage === "registered") {
      activities.push({
        id: `act-${idx++}`,
        type: "stage-change",
        description: "Enrolled! Stage changed to Registered",
        date: contactDate,
        user: "Sarah Mitchell",
      })
    }

    if (lead.stage === "lost") {
      activities.push({
        id: `act-${idx++}`,
        type: "stage-change",
        description: "Marked as lost",
        date: contactDate,
        user: "Sarah Mitchell",
      })
    }
  }

  if (lead.notes) {
    activities.push({
      id: `act-${idx++}`,
      type: "note",
      description: lead.notes,
      date: lead.lastContactedAt ?? lead.createdAt,
      user: "Sarah Mitchell",
    })
  }

  return activities.reverse()
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function daysSince(dateStr: string): number {
  const then = new Date(dateStr + "T00:00:00")
  const now = new Date()
  return Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24))
}

function getActivityIcon(type: ActivityEntry["type"]) {
  switch (type) {
    case "email":
      return <Mail className="size-3.5" />
    case "call":
      return <Phone className="size-3.5" />
    case "stage-change":
      return <ChevronRight className="size-3.5" />
    case "trial":
      return <Calendar className="size-3.5" />
    case "note":
    default:
      return <MessageSquare className="size-3.5" />
  }
}

// ── Component ────────────────────────────────────────────────────────────────

export default function CrmPage() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [addLeadOpen, setAddLeadOpen] = useState(false)
  const [leadStageOverrides, setLeadStageOverrides] = useState<
    Record<string, LeadStage>
  >({})

  // Group leads by stage
  const leadsByStage = useMemo(() => {
    const groups: Record<LeadStage, Lead[]> = {
      new: [],
      contacted: [],
      "trial-scheduled": [],
      "trial-completed": [],
      registered: [],
      lost: [],
    }
    for (const lead of leads) {
      const effectiveStage = leadStageOverrides[lead.id] ?? lead.stage
      groups[effectiveStage].push(lead)
    }
    return groups
  }, [leadStageOverrides])

  // Summary stats
  const stats = useMemo(() => {
    const total = leads.length
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const newThisWeek = leads.filter(
      (l) => new Date(l.createdAt + "T00:00:00") >= oneWeekAgo
    ).length
    const registered = leadsByStage.registered.length
    const lost = leadsByStage.lost.length
    const conversionRate =
      registered + lost > 0
        ? Math.round((registered / (registered + lost)) * 100)
        : 0

    // Average days to convert (from created to lastContacted for registered leads)
    const registeredLeads = leadsByStage.registered.filter(
      (l) => l.lastContactedAt
    )
    const avgDays =
      registeredLeads.length > 0
        ? Math.round(
            registeredLeads.reduce((sum, l) => {
              const created = new Date(l.createdAt + "T00:00:00")
              const converted = new Date(l.lastContactedAt! + "T00:00:00")
              return (
                sum +
                (converted.getTime() - created.getTime()) /
                  (1000 * 60 * 60 * 24)
              )
            }, 0) / registeredLeads.length
          )
        : 0

    return { total, newThisWeek, conversionRate, avgDays }
  }, [leadsByStage])

  function handleStageChange(leadId: string, newStage: LeadStage) {
    setLeadStageOverrides((prev) => ({ ...prev, [leadId]: newStage }))
    // Update the selected lead view if open
    if (selectedLead?.id === leadId) {
      setSelectedLead({ ...selectedLead, stage: newStage })
    }
  }

  const effectiveStage = (lead: Lead): LeadStage =>
    leadStageOverrides[lead.id] ?? lead.stage

  return (
    <>
      <Header title="CRM" />
      <div className="flex-1 p-6 space-y-6">
        <PageHeader
          title="Lead Pipeline"
          description="Track and convert prospects"
        >
          <Button onClick={() => setAddLeadOpen(true)}>
            <Plus data-icon="inline-start" />
            Add Lead
          </Button>
        </PageHeader>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card size="sm">
            <CardContent className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <Users className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Leads</p>
                <p className="text-xl font-semibold">{stats.total}</p>
              </div>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardContent className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-50 p-2">
                <UserPlus className="size-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">New This Week</p>
                <p className="text-xl font-semibold">{stats.newThisWeek}</p>
              </div>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardContent className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-50 p-2">
                <TrendingUp className="size-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Conversion Rate
                </p>
                <p className="text-xl font-semibold">{stats.conversionRate}%</p>
              </div>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardContent className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-50 p-2">
                <Clock className="size-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Avg Days to Convert
                </p>
                <p className="text-xl font-semibold">{stats.avgDays}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kanban board */}
        <div className="overflow-x-auto -mx-6 px-6">
        <div className="grid grid-cols-6 gap-3 min-w-[1100px]">
          {STAGE_ORDER.map((stage) => {
            const stageLeads = leadsByStage[stage]
            const config = STAGE_CONFIG[stage]
            return (
              <div key={stage} className="flex flex-col">
                {/* Column header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm font-semibold ${config.color}`}>
                      {config.label}
                    </h3>
                    <Badge
                      variant="outline"
                      className={config.bgColor}
                    >
                      {stageLeads.length}
                    </Badge>
                  </div>
                </div>

                {/* Column body */}
                <div className="flex-1 space-y-2 min-h-[200px] max-h-[calc(100vh-400px)] overflow-y-auto rounded-lg bg-muted/30 border border-dashed border-border/50 p-2">
                  {stageLeads.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-8">
                      No leads
                    </p>
                  ) : (
                    stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className="rounded-lg border bg-card p-3 shadow-sm cursor-pointer hover:shadow-md hover:border-foreground/20 transition-all space-y-2"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <p className="text-sm font-medium leading-tight">
                            {lead.firstName} {lead.lastName}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {lead.childName}, age {lead.childAge}
                        </p>
                        <div className="flex items-center justify-between gap-1">
                          <Badge
                            variant="outline"
                            className={SOURCE_CONFIG[lead.source].className}
                          >
                            {SOURCE_CONFIG[lead.source].label}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {daysSince(lead.createdAt)}d
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {DISCIPLINE_LABELS[lead.interestDiscipline]}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
        </div>

        {/* Horizontal scroll hint for smaller screens */}
        <div className="lg:hidden text-xs text-muted-foreground text-center">
          Scroll horizontally to see all pipeline stages
        </div>
      </div>

      {/* Lead detail sheet */}
      <Sheet
        open={selectedLead !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedLead(null)
        }}
      >
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          {selectedLead && (
            <>
              <SheetHeader>
                <SheetTitle>
                  {selectedLead.firstName} {selectedLead.lastName}
                </SheetTitle>
                <SheetDescription>
                  Lead for {selectedLead.childName}
                </SheetDescription>
              </SheetHeader>

              <div className="px-4 space-y-5">
                {/* Contact info */}
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Contact Information
                  </p>
                  <div className="grid gap-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="size-4" />
                      <a
                        href={`mailto:${selectedLead.email}`}
                        className="text-foreground hover:underline"
                      >
                        {selectedLead.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="size-4" />
                      <span className="text-foreground">
                        {formatPhone(selectedLead.phone)}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Child details */}
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Child Details
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Name</p>
                      <p className="font-medium">{selectedLead.childName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Age</p>
                      <p className="font-medium">
                        {selectedLead.childAge} years old
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">
                        Interest
                      </p>
                      <p className="font-medium">
                        {DISCIPLINE_LABELS[selectedLead.interestDiscipline]}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Source</p>
                      <Badge
                        variant="outline"
                        className={
                          SOURCE_CONFIG[selectedLead.source].className
                        }
                      >
                        {SOURCE_CONFIG[selectedLead.source].label}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Stage management */}
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Pipeline Stage
                  </p>
                  <Select
                    value={effectiveStage(selectedLead)}
                    onValueChange={(val) => {
                      if (val) {
                        handleStageChange(
                          selectedLead.id,
                          val as LeadStage
                        )
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STAGE_ORDER.map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {STAGE_CONFIG[stage].label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>
                      Created: {formatDate(selectedLead.createdAt)}
                    </span>
                    {selectedLead.lastContactedAt && (
                      <span>
                        Last Contact:{" "}
                        {formatDate(selectedLead.lastContactedAt)}
                      </span>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Notes */}
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Notes
                  </p>
                  {selectedLead.notes ? (
                    <p className="text-sm rounded-lg border bg-muted/30 p-3">
                      {selectedLead.notes}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No notes yet
                    </p>
                  )}
                  <Textarea
                    placeholder="Add a note..."
                    className="min-h-[80px]"
                  />
                  <Button variant="outline" size="sm">
                    Add Note
                  </Button>
                </div>

                <Separator />

                {/* Activity timeline */}
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Activity
                  </p>
                  <div className="space-y-3">
                    {generateActivities(selectedLead).map((activity) => (
                      <div
                        key={activity.id}
                        className="flex gap-3 text-sm"
                      >
                        <div className="mt-0.5 flex-shrink-0 rounded-full border bg-muted p-1.5">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm leading-snug">
                            {activity.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatDate(activity.date)} &middot;{" "}
                            {activity.user}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Add Lead Sheet */}
      <Sheet open={addLeadOpen} onOpenChange={setAddLeadOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add New Lead</SheetTitle>
            <SheetDescription>
              Enter contact details for a prospective family
            </SheetDescription>
          </SheetHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setAddLeadOpen(false)
            }}
            className="px-4 space-y-4"
          >
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Parent / Guardian
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="lead-first">First Name</Label>
                <Input id="lead-first" placeholder="Jane" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lead-last">Last Name</Label>
                <Input id="lead-last" placeholder="Smith" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lead-email">Email</Label>
                <Input id="lead-email" type="email" placeholder="jane@email.com" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lead-phone">Phone</Label>
                <Input id="lead-phone" type="tel" placeholder="(555) 123-4567" required />
              </div>
            </div>

            <Separator />

            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Child Details
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="lead-child">Child&apos;s Name</Label>
                <Input id="lead-child" placeholder="Emma" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lead-age">Child&apos;s Age</Label>
                <Input id="lead-age" type="number" min="3" max="18" placeholder="7" required />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>Interest</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select discipline" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(DISCIPLINE_LABELS) as Discipline[]).map((d) => (
                      <SelectItem key={d} value={d}>
                        {DISCIPLINE_LABELS[d]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Lead Info
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 col-span-2">
                <Label>Source</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="How did they find us?" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SOURCE_CONFIG).map(([key, cfg]) => (
                      <SelectItem key={key} value={key}>
                        {cfg.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label htmlFor="lead-notes">Notes</Label>
                <Textarea id="lead-notes" placeholder="Any additional context..." className="min-h-[80px]" />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1">
                <Save className="size-3.5 mr-1.5" /> Add Lead
              </Button>
              <Button type="button" variant="outline" onClick={() => setAddLeadOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </>
  )
}
