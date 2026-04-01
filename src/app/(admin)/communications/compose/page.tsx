"use client"

import { useState, useMemo, useCallback } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  Mail,
  MessageSquare,
  Send,
  Clock,
  X,
  Users,
  FileText,
} from "lucide-react"
import { toast } from "sonner"
import type { MessageChannel } from "@/lib/types"

// ── Template definitions ────────────────────────────────────────────────────

interface ComposeTemplate {
  id: string
  name: string
  subject: string
  body: string
}

const COMPOSE_TEMPLATES: ComposeTemplate[] = [
  {
    id: "snow-day",
    name: "Snow Day Closure",
    subject: "SNOW DAY - Studio Closed Tonight",
    body: "Due to winter weather, all evening classes tonight are cancelled. Stay safe!",
  },
  {
    id: "welcome",
    name: "Welcome New Family",
    subject: "Welcome to Studio OS!",
    body: "Welcome to the Studio OS family! We're so excited to have your dancer join us.\n\nHere's what you need to know for your first class:\n- Arrive 10 minutes early\n- Wear comfortable clothing (leotard + tights for ballet)\n- Hair pulled back in a bun\n- Bring a water bottle\n\nSee you in the studio!",
  },
  {
    id: "payment",
    name: "Payment Reminder",
    subject: "Friendly Reminder - Tuition Payment Due",
    body: "This is a friendly reminder that your monthly tuition is now due. If you haven't already, please submit payment through the parent portal or contact our office.\n\nA 5% late fee will be applied after the 25th. Thank you!",
  },
  {
    id: "recital",
    name: "Recital Reminder",
    subject: "Recital Day Reminder - Important Details",
    body: "Reminder: The Spring Recital is this Saturday!\n\nPlease have your dancer arrive by the designated call time in full costume with hair and makeup done. Don't forget:\n- Costume & shoes\n- Hair kit (bobby pins, hairspray, hairnet)\n- Stage makeup applied\n- Water bottle & snacks\n\nBreak a leg!",
  },
  {
    id: "rollover",
    name: "Season Rollover Notice",
    subject: "Fall 2026 Season - Registration & Re-Enrollment",
    body: "Dear Dance Families,\n\nIt's time to plan for the Fall 2026 season! Current students have priority re-enrollment through the end of this month.\n\nPlease log in to your parent portal to:\n1. Confirm your dancer's class placement\n2. Review any schedule changes\n3. Complete re-enrollment\n\nSpots are limited and open enrollment begins next month. Don't miss out!",
  },
]

// ── Audience filter definitions ──────────────────────────────────────────────

interface AudienceFilter {
  id: string
  category: string
  label: string
  count: number
}

const DISCIPLINE_FILTERS: AudienceFilter[] = [
  { id: "disc-ballet", category: "Discipline", label: "Ballet", count: 86 },
  { id: "disc-jazz", category: "Discipline", label: "Jazz", count: 62 },
  { id: "disc-tap", category: "Discipline", label: "Tap", count: 34 },
  { id: "disc-contemporary", category: "Discipline", label: "Contemporary", count: 48 },
  { id: "disc-hiphop", category: "Discipline", label: "Hip Hop", count: 42 },
  { id: "disc-lyrical", category: "Discipline", label: "Lyrical", count: 38 },
  { id: "disc-acro", category: "Discipline", label: "Acrobatics", count: 28 },
  { id: "disc-mt", category: "Discipline", label: "Musical Theatre", count: 22 },
  { id: "disc-pointe", category: "Discipline", label: "Pointe", count: 18 },
]

const CLASS_FILTERS: AudienceFilter[] = [
  { id: "cls-mon-eve", category: "Class", label: "Monday Evening Classes", count: 45 },
  { id: "cls-tue-eve", category: "Class", label: "Tuesday Evening Classes", count: 52 },
  { id: "cls-wed-eve", category: "Class", label: "Wednesday Evening Classes", count: 48 },
  { id: "cls-thu-eve", category: "Class", label: "Thursday Evening Classes", count: 58 },
  { id: "cls-sat-morn", category: "Class", label: "Saturday Morning Classes", count: 72 },
  { id: "cls-sat-aft", category: "Class", label: "Saturday Afternoon Classes", count: 36 },
]

const STATUS_FILTERS: AudienceFilter[] = [
  { id: "stat-active", category: "Status", label: "Active Families", count: 247 },
  { id: "stat-waitlist", category: "Status", label: "Waitlisted Families", count: 12 },
  { id: "stat-trial", category: "Status", label: "Trial Students", count: 6 },
  { id: "stat-inactive", category: "Status", label: "Inactive Families", count: 35 },
]

const TEAM_FILTERS: AudienceFilter[] = [
  { id: "team-comp", category: "Team", label: "Competition Team", count: 32 },
  { id: "team-comp-parents", category: "Team", label: "Competition Team Parents", count: 45 },
  { id: "team-recital", category: "Team", label: "Recital Participants", count: 220 },
]

const SCHEDULE_FILTERS: AudienceFilter[] = [
  { id: "sched-tonight", category: "Schedule", label: "All Classes Tonight", count: 47 },
  { id: "sched-tomorrow", category: "Schedule", label: "All Classes Tomorrow", count: 52 },
  { id: "sched-this-week", category: "Schedule", label: "All Classes This Week", count: 247 },
]

const ALL_FILTERS = [
  ...DISCIPLINE_FILTERS,
  ...CLASS_FILTERS,
  ...STATUS_FILTERS,
  ...TEAM_FILTERS,
  ...SCHEDULE_FILTERS,
]

interface QuickPreset {
  label: string
  filterIds: string[]
}

const QUICK_PRESETS: QuickPreset[] = [
  { label: "All Active Families", filterIds: ["stat-active"] },
  { label: "Competition Team", filterIds: ["team-comp"] },
  { label: "Tonight's Classes", filterIds: ["sched-tonight"] },
]

// ── Filter dropdown categories ───────────────────────────────────────────────

const FILTER_CATEGORIES = [
  { value: "discipline", label: "By Discipline", filters: DISCIPLINE_FILTERS },
  { value: "class", label: "By Class", filters: CLASS_FILTERS },
  { value: "team", label: "By Team", filters: TEAM_FILTERS },
  { value: "schedule", label: "By Schedule", filters: SCHEDULE_FILTERS },
  { value: "status", label: "Custom / By Status", filters: STATUS_FILTERS },
]

// ── Mock recipient names ─────────────────────────────────────────────────────

const MOCK_RECIPIENTS = [
  "Anderson Family",
  "Ramirez Family",
  "Chen-Williams Family",
  "O'Brien Family",
  "Johnson Family",
  "Patel Family",
  "Kim Family",
  "Thompson Family",
  "Garcia Family",
  "Nguyen Family",
]

// ── Component ────────────────────────────────────────────────────────────────

export default function ComposeMessagePage() {
  // Pre-stage: snow day message with "tonight's classes" audience
  const [channel, setChannel] = useState<MessageChannel>("both")
  const [subject, setSubject] = useState("SNOW DAY - Studio Closed Tonight")
  const [body, setBody] = useState(
    "Due to winter weather, all evening classes tonight are cancelled. Stay safe!"
  )
  const [activeFilters, setActiveFilters] = useState<string[]>(["sched-tonight"])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedFilter, setSelectedFilter] = useState<string>("")

  const addFilter = useCallback((filterId: string) => {
    setActiveFilters((prev) =>
      prev.includes(filterId) ? prev : [...prev, filterId]
    )
  }, [])

  const removeFilter = useCallback((filterId: string) => {
    setActiveFilters((prev) => prev.filter((id) => id !== filterId))
  }, [])

  const applyPreset = useCallback((preset: QuickPreset) => {
    setActiveFilters(preset.filterIds)
  }, [])

  function applyTemplate(templateId: string) {
    const template = COMPOSE_TEMPLATES.find((t) => t.id === templateId)
    if (template) {
      setSubject(template.subject)
      setBody(template.body)
    }
  }

  // Calculate recipient count from active filters
  const recipientCount = useMemo(() => {
    if (activeFilters.length === 0) return 0
    const filterObjects = activeFilters
      .map((id) => ALL_FILTERS.find((f) => f.id === id))
      .filter(Boolean) as AudienceFilter[]

    if (filterObjects.length === 0) return 0
    if (filterObjects.length === 1) return filterObjects[0].count
    return Math.max(...filterObjects.map((f) => f.count))
  }, [activeFilters])

  // Estimate student count (roughly 1.3 students per family)
  const estimatedStudents = useMemo(() => {
    return Math.round(recipientCount * 1.32)
  }, [recipientCount])

  const activeFilterObjects = useMemo(() => {
    return activeFilters
      .map((id) => ALL_FILTERS.find((f) => f.id === id))
      .filter(Boolean) as AudienceFilter[]
  }, [activeFilters])

  const channelButtons: { value: MessageChannel; label: string; icon: React.ReactNode }[] = [
    { value: "email", label: "Email", icon: <Mail className="size-4" /> },
    { value: "sms", label: "SMS", icon: <MessageSquare className="size-4" /> },
    { value: "both", label: "Both", icon: <Send className="size-4" /> },
  ]

  // Get filters for the selected category
  const categoryFilters = useMemo(() => {
    const category = FILTER_CATEGORIES.find((c) => c.value === selectedCategory)
    return category?.filters ?? []
  }, [selectedCategory])

  function handleAddFilter(filterId: string | null) {
    if (filterId) {
      addFilter(filterId)
      setSelectedFilter("")
    }
  }

  function handleSendNow() {
    toast.success(`Message sent to ${recipientCount} families`)
  }

  function handleSchedule() {
    toast.success("Message scheduled")
  }

  const isFormValid =
    (channel === "sms" || subject.trim().length > 0) &&
    body.trim().length > 0 &&
    recipientCount > 0

  return (
    <>
      <Header title="Compose Message" />
      <div className="flex-1 p-6 space-y-6">
        <PageHeader
          title="Compose Message"
          description="Send a new message to families"
        >
          <Link href="/communications">
            <Button variant="outline">
              <ArrowLeft data-icon="inline-start" />
              Back to Messages
            </Button>
          </Link>
        </PageHeader>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left column: Message form (wider) */}
          <div className="lg:col-span-3 space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>Message Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Channel toggle */}
                <div className="space-y-2">
                  <Label>Channel</Label>
                  <div className="flex items-center gap-1 rounded-lg bg-muted p-[3px] w-fit">
                    {channelButtons.map((btn) => (
                      <button
                        key={btn.value}
                        onClick={() => setChannel(btn.value)}
                        className={`
                          inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all
                          ${
                            channel === btn.value
                              ? "bg-background text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }
                        `}
                      >
                        {btn.icon}
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject line (hidden for SMS only) */}
                {channel !== "sms" && (
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Enter email subject line..."
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>
                )}

                {/* Template picker */}
                <div className="space-y-2">
                  <Label>Template</Label>
                  <Select onValueChange={(val: string | null) => { if (val) applyTemplate(val) }}>
                    <SelectTrigger className="w-full">
                      <div className="flex items-center gap-2">
                        <FileText className="size-4 text-muted-foreground" />
                        <SelectValue placeholder="Load a template..." />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {COMPOSE_TEMPLATES.map((tpl) => (
                        <SelectItem key={tpl.id} value={tpl.id}>
                          {tpl.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Message body */}
                <div className="space-y-2">
                  <Label htmlFor="body">
                    {channel === "sms" ? "Message" : "Body"}
                  </Label>
                  <Textarea
                    id="body"
                    placeholder={
                      channel === "sms"
                        ? "Enter SMS message (160 character limit per segment)..."
                        : "Enter your message..."
                    }
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="min-h-[240px] font-mono text-sm"
                  />
                  {channel === "sms" && (
                    <p className="text-xs text-muted-foreground">
                      {body.length} / 160 characters
                      {body.length > 160 && (
                        <span className="text-amber-600 ml-1">
                          ({Math.ceil(body.length / 160)} segments)
                        </span>
                      )}
                    </p>
                  )}
                </div>

                <Separator />

                {/* Action buttons */}
                <div className="flex items-center gap-3">
                  <Button disabled={!isFormValid} onClick={handleSendNow}>
                    <Send data-icon="inline-start" />
                    Send Now
                  </Button>
                  <Button
                    variant="outline"
                    disabled={!isFormValid}
                    onClick={handleSchedule}
                  >
                    <Clock data-icon="inline-start" />
                    Schedule for Later
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column: Audience builder */}
          <div className="lg:col-span-2 space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>Audience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Recipient count */}
                <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3">
                  <Users className="size-5 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {recipientCount > 0 ? (
                      <>
                        <span className="text-lg font-semibold text-foreground">
                          {recipientCount}
                        </span>{" "}
                        families ({estimatedStudents} students)
                      </>
                    ) : (
                      <span className="text-muted-foreground">
                        No audience selected
                      </span>
                    )}
                  </span>
                </div>

                {/* Segment dropdown (maps to filter categories) */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Segment
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_PRESETS.map((preset) => (
                      <Button
                        key={preset.label}
                        variant="outline"
                        size="sm"
                        onClick={() => applyPreset(preset)}
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Add filters */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Refine Audience
                  </p>
                  <div className="flex flex-col gap-2">
                    <Select
                      value={selectedCategory}
                      onValueChange={(val) => {
                        setSelectedCategory(val ?? "")
                        setSelectedFilter("")
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select filter type..." />
                      </SelectTrigger>
                      <SelectContent>
                        {FILTER_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedCategory && (
                      <Select
                        value={selectedFilter}
                        onValueChange={handleAddFilter}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose audience..." />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryFilters.map((f) => (
                            <SelectItem
                              key={f.id}
                              value={f.id}
                              disabled={activeFilters.includes(f.id)}
                            >
                              {f.label} ({f.count})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Active filters */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Active Filters
                  </p>
                  {activeFilterObjects.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-2">
                      No filters selected. Choose a preset or add filters above.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {activeFilterObjects.map((filter) => (
                        <Badge
                          key={filter.id}
                          variant="secondary"
                          className="gap-1 pr-1"
                        >
                          <span className="text-xs text-muted-foreground">
                            {filter.category}:
                          </span>
                          {filter.label}
                          <button
                            onClick={() => removeFilter(filter.id)}
                            className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
                          >
                            <X className="size-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  {activeFilterObjects.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveFilters([])}
                      className="text-muted-foreground"
                    >
                      Clear all
                    </Button>
                  )}
                </div>

                {/* Recipient preview */}
                {recipientCount > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        Recipient Preview
                      </p>
                      <ScrollArea className="h-[200px] rounded-md border">
                        <div className="p-3 space-y-1.5">
                          {MOCK_RECIPIENTS.map((name) => (
                            <div
                              key={name}
                              className="flex items-center gap-2 text-sm py-1 px-2 rounded hover:bg-muted/50"
                            >
                              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-medium text-primary">
                                {name.charAt(0)}
                              </div>
                              {name}
                            </div>
                          ))}
                          {recipientCount > MOCK_RECIPIENTS.length && (
                            <p className="text-xs text-muted-foreground text-center py-2">
                              +{recipientCount - MOCK_RECIPIENTS.length} more families
                            </p>
                          )}
                        </div>
                      </ScrollArea>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
