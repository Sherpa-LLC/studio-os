"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  Plus,
  Trash2,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Calendar,
  Save,
  UserCircle,
  Info,
} from "lucide-react"
import { toast } from "sonner"
import {
  DISCIPLINE_LABELS,
  DISCIPLINE_COLORS,
  AGE_GROUP_LABELS,
  AGE_GROUP_RANGES,
  DAY_LABELS,
  ROOMS,
  type RoomName,
} from "@/lib/constants"
import { instructors } from "@/data/instructors"
import { seasons } from "@/data/seasons"
import { formatCurrency, formatTime } from "@/lib/format"
import type { AgeGroup, DayOfWeek, Discipline } from "@/lib/types"
import { cn } from "@/lib/utils"

// ── Schedule slot ───────────────────────────────────────────────────────────

interface ScheduleSlot {
  id: number
  day: DayOfWeek | ""
  startTime: string
  endTime: string
  room: string
}

let nextSlotId = 2

// ── Section header ──────────────────────────────────────────────────────────

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <div className="h-4 w-1 rounded-full bg-primary" />
      <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
        {children}
      </h2>
    </div>
  )
}

// ── Preview row ─────────────────────────────────────────────────────────────

function PreviewRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex items-center justify-center size-7 rounded-md bg-muted/60 shrink-0 mt-0.5">
        <Icon className="size-3.5 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 mb-0.5">
          {label}
        </p>
        <div className="text-sm">{children}</div>
      </div>
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function AddClassPage() {
  // Section A: Identity
  const [className, setClassName] = useState("")
  const [discipline, setDiscipline] = useState<Discipline | "">("")
  const [ageGroup, setAgeGroup] = useState<AgeGroup | "">("")
  const [classType, setClassType] = useState<string>("regular")
  const [description, setDescription] = useState("")

  // Section B: Schedule
  const [scheduleSlots, setScheduleSlots] = useState<ScheduleSlot[]>([
    { id: 1, day: "monday", startTime: "16:00", endTime: "17:00", room: "Studio A" },
  ])

  // Section C: Details
  const [instructorId, setInstructorId] = useState<string>("")
  const [capacity, setCapacity] = useState("25")
  const [ageMin, setAgeMin] = useState("")
  const [ageMax, setAgeMax] = useState("")
  const [monthlyRate, setMonthlyRate] = useState("")
  const [seasonId, setSeasonId] = useState("season-spring-2026")

  // ── Derived state ────────────────────────────────────────────────────────

  const disciplineColor = discipline ? DISCIPLINE_COLORS[discipline] : null
  const disciplineLabel = discipline ? DISCIPLINE_LABELS[discipline] : ""
  const ageGroupLabel = ageGroup ? AGE_GROUP_LABELS[ageGroup] : ""
  const selectedInstructor = instructors.find((i) => i.id === instructorId)
  const selectedSeason = seasons.find((s) => s.id === seasonId)

  // Smart instructor grouping: specialists first when discipline is selected
  const { specialists, others } = useMemo(() => {
    if (!discipline) return { specialists: [], others: instructors }
    const specs = instructors.filter((i) => i.specialties.includes(discipline))
    const rest = instructors.filter((i) => !i.specialties.includes(discipline))
    return { specialists: specs, others: rest }
  }, [discipline])

  // ── Handlers ─────────────────────────────────────────────────────────────

  function handleAgeGroupChange(ag: string | null) {
    if (!ag) return
    const group = ag as AgeGroup
    setAgeGroup(group)
    if (AGE_GROUP_RANGES[group]) {
      setAgeMin(String(AGE_GROUP_RANGES[group].min))
      setAgeMax(String(AGE_GROUP_RANGES[group].max))
    }
  }

  function addScheduleSlot() {
    setScheduleSlots((prev) => [
      ...prev,
      { id: nextSlotId++, day: "", startTime: "", endTime: "", room: "" },
    ])
  }

  function removeScheduleSlot(id: number) {
    setScheduleSlots((prev) => prev.filter((s) => s.id !== id))
  }

  function updateSlot(id: number, field: keyof ScheduleSlot, value: string) {
    setScheduleSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    )
  }

  function handleCreate() {
    toast.success("Class created successfully", {
      description: `${className || "Untitled Class"} has been added to ${selectedSeason?.name ?? "the season"}.`,
    })
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      <Header title="Add New Class" />
      <div className="flex-1 p-6 pb-28">
        <PageHeader
          title="Add New Class"
          description="Build a class offering for your studio"
        >
          <Link href="/classes">
            <Button variant="outline">
              <ArrowLeft data-icon="inline-start" />
              Back to Classes
            </Button>
          </Link>
        </PageHeader>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 max-w-[1120px]">
          {/* ── LEFT COLUMN: Form ────────────────────────────────────────── */}
          <div className="space-y-10">
            {/* Section 1: Class Identity */}
            <section>
              <SectionHeader>Class Identity</SectionHeader>

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="class-name">Class Name</Label>
                  <Input
                    id="class-name"
                    placeholder="e.g. Ballet II - Juniors (Ages 7-9)"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="h-10"
                  />
                </div>

                {/* Discipline pills */}
                <div className="space-y-2">
                  <Label>Discipline</Label>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(DISCIPLINE_LABELS) as Discipline[]).map((d) => {
                      const isSelected = discipline === d
                      const color = DISCIPLINE_COLORS[d]
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDiscipline(isSelected ? "" : d)}
                          className={cn(
                            "px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 border-2 cursor-pointer",
                            isSelected
                              ? "text-white shadow-md scale-[1.02]"
                              : "bg-background border-border text-foreground hover:border-muted-foreground/30"
                          )}
                          style={
                            isSelected
                              ? { backgroundColor: color, borderColor: color }
                              : undefined
                          }
                        >
                          {DISCIPLINE_LABELS[d]}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Age Group</Label>
                    <Select value={ageGroup} onValueChange={handleAgeGroupChange}>
                      <SelectTrigger className="w-full h-10">
                        <SelectValue placeholder="Select age group" />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(AGE_GROUP_LABELS) as AgeGroup[]).map((ag) => (
                          <SelectItem key={ag} value={ag}>
                            {AGE_GROUP_LABELS[ag]}
                            <span className="text-muted-foreground ml-1">
                              ({AGE_GROUP_RANGES[ag].min}-{AGE_GROUP_RANGES[ag].max} yrs)
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Class Type</Label>
                    <Select value={classType} onValueChange={(val) => setClassType(val ?? "regular")}>
                      <SelectTrigger className="w-full h-10">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="trial">Trial</SelectItem>
                        <SelectItem value="drop-in">Drop-in</SelectItem>
                        <SelectItem value="camp">Camp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description">
                    Description{" "}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="What students will learn, prerequisites, what to wear..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Section 2: Schedule */}
            <section>
              <SectionHeader>When & Where</SectionHeader>

              <div className="space-y-4">
                {scheduleSlots.map((slot, index) => (
                  <div
                    key={slot.id}
                    className={cn(
                      "rounded-xl border bg-card p-4 space-y-3 transition-all",
                      "animate-in fade-in-0 slide-in-from-top-1 duration-200"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {scheduleSlots.length > 1 ? `Day ${index + 1}` : "Schedule"}
                      </p>
                      {scheduleSlots.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeScheduleSlot(slot.id)}
                          className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="size-3 mr-1" />
                          Remove
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Day</Label>
                        <Select
                          value={slot.day}
                          onValueChange={(val) => updateSlot(slot.id, "day", val ?? "")}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Day" />
                          </SelectTrigger>
                          <SelectContent>
                            {(Object.keys(DAY_LABELS) as DayOfWeek[]).map((day) => (
                              <SelectItem key={day} value={day}>
                                {DAY_LABELS[day]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs">Start</Label>
                        <Input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => updateSlot(slot.id, "startTime", e.target.value)}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs">End</Label>
                        <Input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => updateSlot(slot.id, "endTime", e.target.value)}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs">Room</Label>
                        <Select
                          value={slot.room}
                          onValueChange={(val) => updateSlot(slot.id, "room", val ?? "")}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Room" />
                          </SelectTrigger>
                          <SelectContent>
                            {(Object.keys(ROOMS) as RoomName[]).map((room) => (
                              <SelectItem key={room} value={room}>
                                <span>{room}</span>
                                <span className="text-muted-foreground ml-1 text-xs">
                                  ({ROOMS[room].capacity} cap)
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Room features hint */}
                    {slot.room && ROOMS[slot.room as RoomName] && (
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pl-0.5">
                        <Info className="size-3 shrink-0" />
                        {ROOMS[slot.room as RoomName].features.join(" · ")}
                      </div>
                    )}
                  </div>
                ))}

                <Button variant="outline" size="sm" onClick={addScheduleSlot}>
                  <Plus className="size-3.5 mr-1.5" />
                  Add Another Day
                </Button>
              </div>
            </section>

            {/* Section 3: Instructor & Pricing */}
            <section>
              <SectionHeader>Instructor & Pricing</SectionHeader>

              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Instructor — smart-grouped by discipline */}
                  <div className="space-y-1.5">
                    <Label>Instructor</Label>
                    <Select
                      value={instructorId}
                      onValueChange={(val) => setInstructorId(val ?? "")}
                    >
                      <SelectTrigger className="w-full h-10">
                        <SelectValue placeholder="Select instructor" />
                      </SelectTrigger>
                      <SelectContent>
                        {discipline && specialists.length > 0 ? (
                          <>
                            <SelectGroup>
                              <SelectLabel>
                                {disciplineLabel} specialists
                              </SelectLabel>
                              {specialists.map((inst) => (
                                <SelectItem key={inst.id} value={inst.id}>
                                  {inst.firstName} {inst.lastName}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                            {others.length > 0 && (
                              <>
                                <SelectSeparator />
                                <SelectGroup>
                                  <SelectLabel>Other instructors</SelectLabel>
                                  {others.map((inst) => (
                                    <SelectItem key={inst.id} value={inst.id}>
                                      {inst.firstName} {inst.lastName}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </>
                            )}
                          </>
                        ) : (
                          instructors.map((inst) => (
                            <SelectItem key={inst.id} value={inst.id}>
                              {inst.firstName} {inst.lastName}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {selectedInstructor && (
                      <p className="text-[11px] text-muted-foreground pl-0.5">
                        Specialties: {selectedInstructor.specialties.map((s) => DISCIPLINE_LABELS[s]).join(", ")}
                        {" · "}${selectedInstructor.payRate}/{selectedInstructor.payType === "hourly" ? "hr" : "class"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      min="1"
                      max="50"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Age Range</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="3"
                        max="99"
                        placeholder="Min"
                        value={ageMin}
                        onChange={(e) => setAgeMin(e.target.value)}
                        className="w-20 h-10"
                      />
                      <span className="text-muted-foreground text-sm">to</span>
                      <Input
                        type="number"
                        min="3"
                        max="99"
                        placeholder="Max"
                        value={ageMax}
                        onChange={(e) => setAgeMax(e.target.value)}
                        className="w-20 h-10"
                      />
                      <span className="text-muted-foreground text-xs">years</span>
                    </div>
                    {ageGroup && (
                      <p className="text-[11px] text-muted-foreground pl-0.5">
                        Auto-filled from {ageGroupLabel} defaults
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="monthly-rate">Monthly Rate</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="monthly-rate"
                        type="number"
                        min="0"
                        step="5"
                        placeholder="95"
                        value={monthlyRate}
                        onChange={(e) => setMonthlyRate(e.target.value)}
                        className="h-10 pl-7"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 max-w-xs">
                  <Label>Season</Label>
                  <Select value={seasonId} onValueChange={(val) => setSeasonId(val ?? "season-spring-2026")}>
                    <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder="Select season" />
                    </SelectTrigger>
                    <SelectContent>
                      {seasons
                        .filter((s) => s.status !== "completed")
                        .map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                            {s.status === "active" && (
                              <span className="text-emerald-600 ml-1 text-xs">(Current)</span>
                            )}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>
          </div>

          {/* ── RIGHT COLUMN: Live Preview ───────────────────────────────── */}
          <div className="hidden lg:block">
            <div className="sticky top-6 space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-1">
                Live Preview
              </p>

              <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
                {/* Discipline color accent bar */}
                <div
                  className="h-1.5 transition-all duration-500 ease-out"
                  style={{
                    backgroundColor: disciplineColor ?? "transparent",
                    opacity: disciplineColor ? 1 : 0,
                  }}
                />

                <div className="p-5 space-y-5">
                  {/* Title */}
                  <div>
                    <h3 className="font-semibold text-lg leading-tight">
                      {className || (
                        <span className="text-muted-foreground/50">Untitled Class</span>
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {[
                        disciplineLabel,
                        ageGroupLabel,
                        classType && classType !== "regular"
                          ? classType.charAt(0).toUpperCase() + classType.slice(1)
                          : null,
                      ]
                        .filter(Boolean)
                        .join(" · ") || (
                        <span className="text-muted-foreground/40">
                          Select a discipline to get started
                        </span>
                      )}
                    </p>
                  </div>

                  {description && (
                    <p className="text-sm text-muted-foreground leading-relaxed border-l-2 border-muted pl-3 italic">
                      {description}
                    </p>
                  )}

                  <Separator />

                  {/* Schedule */}
                  <PreviewRow icon={Clock} label="Schedule">
                    {scheduleSlots.some((s) => s.day || s.startTime) ? (
                      <div className="space-y-1">
                        {scheduleSlots.map((slot) => (
                          <p key={slot.id}>
                            <span className="font-medium">
                              {slot.day ? DAY_LABELS[slot.day as DayOfWeek] : "—"}
                            </span>
                            {(slot.startTime || slot.endTime) && (
                              <span className="text-muted-foreground">
                                {" "}
                                {slot.startTime ? formatTime(slot.startTime) : "—"}
                                {" – "}
                                {slot.endTime ? formatTime(slot.endTime) : "—"}
                              </span>
                            )}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground/40">Not set</span>
                    )}
                  </PreviewRow>

                  {/* Room */}
                  <PreviewRow icon={MapPin} label="Room">
                    {scheduleSlots.some((s) => s.room) ? (
                      <div className="space-y-0.5">
                        {scheduleSlots
                          .filter((s) => s.room)
                          .map((slot) => (
                            <p key={slot.id}>
                              {slot.room}
                              <span className="text-muted-foreground">
                                {" · "}{ROOMS[slot.room as RoomName]?.capacity} max
                              </span>
                            </p>
                          ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground/40">Not selected</span>
                    )}
                  </PreviewRow>

                  <Separator />

                  {/* Instructor */}
                  <PreviewRow icon={UserCircle} label="Instructor">
                    {selectedInstructor ? (
                      <div>
                        <p className="font-medium">
                          {selectedInstructor.firstName} {selectedInstructor.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedInstructor.specialties
                            .map((s) => DISCIPLINE_LABELS[s])
                            .join(", ")}
                        </p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground/40">Not assigned</span>
                    )}
                  </PreviewRow>

                  {/* Capacity & Ages */}
                  <PreviewRow icon={Users} label="Capacity">
                    <span>
                      {capacity || "—"} students
                      {ageMin && ageMax && (
                        <span className="text-muted-foreground">
                          {" · "}Ages {ageMin}–{ageMax}
                        </span>
                      )}
                    </span>
                  </PreviewRow>

                  {/* Rate */}
                  <PreviewRow icon={DollarSign} label="Rate">
                    {monthlyRate ? (
                      <span className="font-medium">
                        {formatCurrency(Number(monthlyRate))}
                        <span className="text-muted-foreground font-normal">/month</span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground/40">Not set</span>
                    )}
                  </PreviewRow>

                  {/* Season */}
                  <PreviewRow icon={Calendar} label="Season">
                    {selectedSeason ? (
                      <span>
                        {selectedSeason.name}
                        {selectedSeason.status === "active" && (
                          <span className="inline-flex items-center ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700">
                            Active
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/40">Not selected</span>
                    )}
                  </PreviewRow>
                </div>
              </div>

              <p className="text-[10px] text-muted-foreground/50 text-center">
                Updates as you type
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky bottom bar ──────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-10 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 py-3">
        <div className="max-w-[1120px] flex items-center justify-between">
          <p className="text-xs text-muted-foreground hidden sm:block">
            {[className, disciplineLabel, ageGroupLabel].filter(Boolean).join(" · ") ||
              "Fill in the details above"}
          </p>
          <div className="flex items-center gap-3 ml-auto">
            <Link href="/classes">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button onClick={handleCreate}>
              <Save className="size-3.5 mr-1.5" />
              Create Class
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
