"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"


import {
  formatCurrency,
  formatTime,
  getCapacityStatus,
  type CapacityStatus,
} from "@/lib/format"
import {
  DISCIPLINE_LABELS,
  DISCIPLINE_COLORS,
  AGE_GROUP_LABELS,
  DAY_ABBREVIATIONS,
  DAY_LABELS,
} from "@/lib/constants"
import {
  Plus,
  Users,
  Clock,
  Search,
  X,
  ArrowUpDown,
  LayoutGrid,
  List,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import type { AgeGroup, DayOfWeek, Discipline, Class, Instructor } from "@/lib/types"

// ── Constants ────────────────────────────────────────────────────────────────

type SortField = "name" | "day-time" | "capacity" | "price"

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: "name", label: "Name" },
  { value: "day-time", label: "Day & Time" },
  { value: "capacity", label: "Capacity" },
  { value: "price", label: "Price" },
]

const SORT_LABELS: Record<SortField, string> = {
  name: "Name",
  "day-time": "Day & Time",
  capacity: "Capacity",
  price: "Price",
}

const DAY_ORDER: Record<DayOfWeek, number> = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
}

const AVAILABILITY_OPTIONS: {
  value: CapacityStatus
  label: string
  color: string
}[] = [
  { value: "available", label: "Available", color: "#10B981" },
  { value: "nearly-full", label: "Nearly Full", color: "#F59E0B" },
  { value: "full", label: "Full", color: "#EF4444" },
]

const DISCIPLINES = Object.keys(DISCIPLINE_LABELS) as Discipline[]
const AGE_GROUPS = Object.keys(AGE_GROUP_LABELS) as AgeGroup[]
const DAYS = Object.keys(DAY_LABELS) as DayOfWeek[]

// ── Helpers ──────────────────────────────────────────────────────────────────

function toggleSetItem<T>(set: Set<T>, item: T): Set<T> {
  const next = new Set(set)
  if (next.has(item)) next.delete(item)
  else next.add(item)
  return next
}

function getCapacityBarColor(enrolled: number, capacity: number): string {
  const status = getCapacityStatus(enrolled, capacity)
  switch (status) {
    case "available":
      return "bg-emerald-500"
    case "nearly-full":
      return "bg-amber-500"
    case "full":
      return "bg-red-500"
  }
}

function getCapacityLabel(enrolled: number, capacity: number): string {
  const status = getCapacityStatus(enrolled, capacity)
  switch (status) {
    case "available":
      return "Available"
    case "nearly-full":
      return "Nearly Full"
    case "full":
      return "Full"
  }
}

// ── Page ─────────────────────────────────────────────────────────────────────

interface ClassesClientPageProps {
  classes: Class[]
  instructors: Instructor[]
  instructorNameMap: Record<string, string>
  classDurationMap: Record<string, number>
}

export default function ClassesClientPage({
  classes,
  instructors,
  instructorNameMap,
  classDurationMap,
}: ClassesClientPageProps) {
  // Search
  const [searchQuery, setSearchQuery] = useState("")

  // Multi-select filters
  const [selectedDisciplines, setSelectedDisciplines] = useState<
    Set<Discipline>
  >(new Set())
  const [selectedAvailability, setSelectedAvailability] = useState<
    Set<CapacityStatus>
  >(new Set())

  // Single-select filters
  const [dayFilter, setDayFilter] = useState("all")
  const [roomFilter, setRoomFilter] = useState("all")
  const [ageGroupFilter, setAgeGroupFilter] = useState("all")
  const [instructorFilter, setInstructorFilter] = useState("all")

  // Sort
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // View
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Instructor popover open state
  const [instructorOpen, setInstructorOpen] = useState(false)

  // ── Filter + Sort pipeline ───────────────────────────────────────────────

  const totalClasses = useMemo(
    () => classes.filter((c) => c.status === "active").length,
    []
  )

  const filtered = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()

    return classes
      .filter((cls) => {
        if (cls.status !== "active") return false

        // Text search: class name or instructor name
        if (query) {
          const name = cls.name.toLowerCase()
          const instructor = instructorNameMap[cls.instructorId] ?? "Unknown".toLowerCase()
          if (!name.includes(query) && !instructor.includes(query)) return false
        }

        // Multi-select: empty set = all
        if (
          selectedDisciplines.size > 0 &&
          !selectedDisciplines.has(cls.discipline)
        )
          return false

        if (selectedAvailability.size > 0) {
          const status = getCapacityStatus(cls.enrolledCount, cls.capacity)
          if (!selectedAvailability.has(status)) return false
        }

        // Single selects
        if (ageGroupFilter !== "all" && cls.ageGroup !== ageGroupFilter)
          return false
        if (dayFilter !== "all" && cls.schedule.day !== dayFilter) return false
        if (roomFilter !== "all" && cls.schedule.room !== roomFilter)
          return false
        if (
          instructorFilter !== "all" &&
          cls.instructorId !== instructorFilter
        )
          return false

        return true
      })
      .sort((a, b) => {
        const dir = sortDirection === "asc" ? 1 : -1
        switch (sortField) {
          case "name":
            return dir * a.name.localeCompare(b.name)
          case "day-time": {
            const dayDiff =
              DAY_ORDER[a.schedule.day] - DAY_ORDER[b.schedule.day]
            if (dayDiff !== 0) return dir * dayDiff
            return (
              dir *
              a.schedule.startTime.localeCompare(b.schedule.startTime)
            )
          }
          case "capacity":
            return (
              dir *
              (a.enrolledCount / a.capacity - b.enrolledCount / b.capacity)
            )
          case "price":
            return dir * (a.monthlyRate - b.monthlyRate)
          default:
            return 0
        }
      })
  }, [
    searchQuery,
    selectedDisciplines,
    selectedAvailability,
    ageGroupFilter,
    dayFilter,
    roomFilter,
    instructorFilter,
    sortField,
    sortDirection,
  ])

  // ── Active filter tracking ───────────────────────────────────────────────

  const activeFilterCount =
    (selectedDisciplines.size > 0 ? 1 : 0) +
    (selectedAvailability.size > 0 ? 1 : 0) +
    (ageGroupFilter !== "all" ? 1 : 0) +
    (dayFilter !== "all" ? 1 : 0) +
    (roomFilter !== "all" ? 1 : 0) +
    (instructorFilter !== "all" ? 1 : 0)

  function clearAllFilters() {
    setSelectedDisciplines(new Set())
    setSelectedAvailability(new Set())
    setDayFilter("all")
    setRoomFilter("all")
    setAgeGroupFilter("all")
    setInstructorFilter("all")
  }

  // Build active filter chip descriptors
  const activeFilters: {
    key: string
    label: string
    color?: string
    onRemove: () => void
  }[] = []

  for (const d of selectedDisciplines) {
    activeFilters.push({
      key: `discipline-${d}`,
      label: DISCIPLINE_LABELS[d],
      color: DISCIPLINE_COLORS[d],
      onRemove: () =>
        setSelectedDisciplines((prev) => {
          const next = new Set(prev)
          next.delete(d)
          return next
        }),
    })
  }

  for (const s of selectedAvailability) {
    const opt = AVAILABILITY_OPTIONS.find((o) => o.value === s)!
    activeFilters.push({
      key: `avail-${s}`,
      label: opt.label,
      color: opt.color,
      onRemove: () =>
        setSelectedAvailability((prev) => {
          const next = new Set(prev)
          next.delete(s)
          return next
        }),
    })
  }

  if (dayFilter !== "all") {
    activeFilters.push({
      key: "day",
      label: DAY_LABELS[dayFilter as DayOfWeek],
      onRemove: () => setDayFilter("all"),
    })
  }

  if (roomFilter !== "all") {
    activeFilters.push({
      key: "room",
      label: roomFilter,
      onRemove: () => setRoomFilter("all"),
    })
  }

  if (ageGroupFilter !== "all") {
    activeFilters.push({
      key: "age",
      label: AGE_GROUP_LABELS[ageGroupFilter as AgeGroup],
      onRemove: () => setAgeGroupFilter("all"),
    })
  }

  if (instructorFilter !== "all") {
    activeFilters.push({
      key: "instructor",
      label: instructorNameMap[instructorFilter] ?? instructorFilter,
      onRemove: () => setInstructorFilter("all"),
    })
  }

  // ── Sort handler ─────────────────────────────────────────────────────────

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      <Header title="Classes" />
      <div className="flex-1 p-6 space-y-6">
        <PageHeader
          title="Class Catalog"
          description="Browse and manage all classes"
        >
          <Button render={<Link href="/classes/new" />}>
            <Plus data-icon="inline-start" />
            Add Class
          </Button>
        </PageHeader>

        {/* ── Filter Bar ──────────────────────────────────────────────── */}
        <div className="rounded-xl border bg-card/50 p-4 space-y-3">
          {/* Row A: Search + Sort + View Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <InputGroup className="flex-1 min-w-[200px] max-w-sm">
              <InputGroupAddon>
                <Search className="size-4 text-muted-foreground" />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Search classes or instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-xs"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="size-3" />
                  </InputGroupButton>
                </InputGroupAddon>
              )}
            </InputGroup>

            <div className="flex items-center gap-1.5 ml-auto">
              {/* Sort dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<Button variant="outline" size="sm" />}
                >
                  <ArrowUpDown className="size-3.5" />
                  <span className="hidden sm:inline">
                    {SORT_LABELS[sortField]}
                  </span>
                  {sortDirection === "asc" ? (
                    <ChevronUp className="size-3" />
                  ) : (
                    <ChevronDown className="size-3" />
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {SORT_OPTIONS.map((opt) => (
                    <DropdownMenuItem
                      key={opt.value}
                      onClick={() => handleSort(opt.value)}
                    >
                      <span className="flex-1">{opt.label}</span>
                      {sortField === opt.value && (
                        <span className="text-xs text-muted-foreground">
                          {sortDirection === "asc" ? "A→Z" : "Z→A"}
                        </span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* View toggle */}
              <div className="flex rounded-lg border overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon-sm"
                  className="rounded-none border-0"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="size-3.5" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon-sm"
                  className="rounded-none border-0"
                  onClick={() => setViewMode("list")}
                >
                  <List className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Row B: Discipline chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            {/* All chip */}
            <button
              onClick={() => setSelectedDisciplines(new Set())}
              className={`shrink-0 inline-flex items-center gap-1.5 rounded-full h-7 px-3 text-xs font-medium border transition-all duration-150 ${
                selectedDisciplines.size === 0
                  ? "bg-foreground/10 border-foreground/20 text-foreground"
                  : "bg-transparent border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              All
            </button>
            {DISCIPLINES.map((d) => {
              const color = DISCIPLINE_COLORS[d]
              const isSelected = selectedDisciplines.has(d)
              return (
                <button
                  key={d}
                  onClick={() =>
                    setSelectedDisciplines((prev) => toggleSetItem(prev, d))
                  }
                  className={`shrink-0 inline-flex items-center gap-1.5 rounded-full h-7 px-3 text-xs font-medium border transition-all duration-150 ${
                    isSelected
                      ? "border-current"
                      : "bg-transparent border-border text-muted-foreground hover:bg-muted"
                  }`}
                  style={
                    isSelected
                      ? {
                          backgroundColor: `${color}15`,
                          borderColor: `${color}40`,
                          color: color,
                        }
                      : undefined
                  }
                >
                  <span
                    className="size-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  {DISCIPLINE_LABELS[d]}
                </button>
              )
            })}
          </div>

          <Separator />

          {/* Row C: Availability chips + Select dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Availability chips */}
            {AVAILABILITY_OPTIONS.map((opt) => {
              const isSelected = selectedAvailability.has(opt.value)
              return (
                <button
                  key={opt.value}
                  onClick={() =>
                    setSelectedAvailability((prev) =>
                      toggleSetItem(prev, opt.value)
                    )
                  }
                  className={`shrink-0 inline-flex items-center gap-1.5 rounded-full h-6 px-2.5 text-xs font-medium border transition-all duration-150 ${
                    isSelected
                      ? "border-current"
                      : "bg-transparent border-border text-muted-foreground hover:bg-muted"
                  }`}
                  style={
                    isSelected
                      ? {
                          backgroundColor: `${opt.color}15`,
                          borderColor: `${opt.color}40`,
                          color: opt.color,
                        }
                      : undefined
                  }
                >
                  <span
                    className="size-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: opt.color }}
                  />
                  {opt.label}
                </button>
              )
            })}

            <Separator
              orientation="vertical"
              className="h-5 mx-1 hidden sm:block"
            />

            {/* Day select */}
            <Select
              value={dayFilter}
              onValueChange={(val) => setDayFilter(val ?? "all")}
            >
              <SelectTrigger className="w-auto min-w-[100px]">
                <SelectValue placeholder="Day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Days</SelectItem>
                {DAYS.map((day) => (
                  <SelectItem key={day} value={day}>
                    {DAY_LABELS[day]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Room select */}
            <Select
              value={roomFilter}
              onValueChange={(val) => setRoomFilter(val ?? "all")}
            >
              <SelectTrigger className="w-auto min-w-[110px]">
                <SelectValue placeholder="Room" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rooms</SelectItem>
                <SelectItem value="Studio A">Studio A</SelectItem>
                <SelectItem value="Studio B">Studio B</SelectItem>
                <SelectItem value="Studio C">Studio C</SelectItem>
                <SelectItem value="Studio D">Studio D</SelectItem>
              </SelectContent>
            </Select>

            {/* Age Group select */}
            <Select
              value={ageGroupFilter}
              onValueChange={(val) => setAgeGroupFilter(val ?? "all")}
            >
              <SelectTrigger className="w-auto min-w-[120px]">
                <SelectValue placeholder="Age Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ages</SelectItem>
                {AGE_GROUPS.map((ag) => (
                  <SelectItem key={ag} value={ag}>
                    {AGE_GROUP_LABELS[ag]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Instructor combobox */}
            <Popover open={instructorOpen} onOpenChange={setInstructorOpen}>
              <PopoverTrigger
                render={
                  <Button
                    variant="outline"
                    size="sm"
                    className="min-w-[120px] justify-between font-normal"
                  />
                }
              >
                <span className="truncate">
                  {instructorFilter === "all"
                    ? "Instructor"
                    : instructorNameMap[instructorFilter] ?? instructorFilter}
                </span>
                <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0">
                <Command>
                  <CommandInput placeholder="Search instructors..." />
                  <CommandList>
                    <CommandEmpty>No instructor found.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        data-checked={instructorFilter === "all"}
                        onSelect={() => {
                          setInstructorFilter("all")
                          setInstructorOpen(false)
                        }}
                      >
                        All Instructors
                      </CommandItem>
                      {instructors.map((inst) => (
                        <CommandItem
                          key={inst.id}
                          data-checked={instructorFilter === inst.id}
                          onSelect={() => {
                            setInstructorFilter(inst.id)
                            setInstructorOpen(false)
                          }}
                        >
                          {inst.firstName} {inst.lastName}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Row D: Active filter chips + Results summary */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {activeFilters.map((f) => (
                <Badge
                  key={f.key}
                  variant="secondary"
                  className="gap-1 pr-1"
                >
                  {f.color && (
                    <span
                      className="size-1.5 rounded-full"
                      style={{ backgroundColor: f.color }}
                    />
                  )}
                  {f.label}
                  <button
                    onClick={f.onRemove}
                    className="ml-0.5 rounded-full hover:bg-foreground/10 p-0.5"
                  >
                    <X className="size-2.5" />
                  </button>
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="xs"
                onClick={clearAllFilters}
                className="text-muted-foreground"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Results summary */}
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {filtered.length}
          </span>{" "}
          of {totalClasses} class{totalClasses !== 1 ? "es" : ""}
          {(activeFilterCount > 0 || searchQuery) && (
            <span>
              {" "}
              &middot; filtered
              {searchQuery && (
                <>
                  {" "}
                  by &ldquo;
                  <span className="font-medium text-foreground">
                    {searchQuery}
                  </span>
                  &rdquo;
                </>
              )}
              {activeFilterCount > 0 && (
                <span>
                  {searchQuery ? " and " : " by "}
                  {activeFilterCount} criteria
                </span>
              )}
            </span>
          )}
        </p>

        {/* ── Content area ────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="rounded-lg border bg-card p-12 text-center">
            <p className="text-muted-foreground text-sm">
              {searchQuery
                ? `No classes matching "${searchQuery}"`
                : "No classes match the selected filters."}
            </p>
            {(activeFilterCount > 0 || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => {
                  clearAllFilters()
                  setSearchQuery("")
                }}
              >
                Clear all filters
              </Button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          /* ── Grid View ────────────────────────────────────────────── */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((cls) => {
              const fillPercent = Math.min(
                (cls.enrolledCount / cls.capacity) * 100,
                100
              )
              const barColor = getCapacityBarColor(
                cls.enrolledCount,
                cls.capacity
              )
              const disciplineColor = DISCIPLINE_COLORS[cls.discipline]

              return (
                <Link
                  key={cls.id}
                  href={`/classes/${cls.id}`}
                  className="group block"
                >
                  <Card className="h-full transition-shadow group-hover:shadow-md overflow-hidden">
                    {/* Discipline color bar */}
                    <div
                      className="h-1"
                      style={{ backgroundColor: disciplineColor }}
                    />
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <CardTitle className="leading-snug line-clamp-2">
                            {cls.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {instructorNameMap[cls.instructorId] ?? "Unknown"}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="shrink-0"
                          style={{
                            borderColor: disciplineColor,
                            color: disciplineColor,
                          }}
                        >
                          {DISCIPLINE_LABELS[cls.discipline]}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Schedule */}
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="size-3.5 shrink-0" />
                        <span>
                          {DAY_ABBREVIATIONS[cls.schedule.day]}{" "}
                          {formatTime(cls.schedule.startTime)}&ndash;
                          {formatTime(cls.schedule.endTime)} &middot;{" "}
                          {cls.schedule.room}
                        </span>
                      </div>

                      {/* Age range */}
                      <p className="text-sm text-muted-foreground">
                        Ages {cls.ageRange.min}&ndash;{cls.ageRange.max}
                      </p>

                      {/* Capacity bar */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Users className="size-3" />
                            {cls.enrolledCount}/{cls.capacity} enrolled
                          </div>
                          <span
                            className={`font-medium ${
                              getCapacityStatus(
                                cls.enrolledCount,
                                cls.capacity
                              ) === "full"
                                ? "text-red-600"
                                : getCapacityStatus(
                                      cls.enrolledCount,
                                      cls.capacity
                                    ) === "nearly-full"
                                  ? "text-amber-600"
                                  : "text-emerald-600"
                            }`}
                          >
                            {getCapacityLabel(
                              cls.enrolledCount,
                              cls.capacity
                            )}
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${barColor}`}
                            style={{ width: `${fillPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Tuition */}
                      <div className="flex items-center justify-between pt-1 border-t">
                        <span className="text-xs text-muted-foreground">
                          {classDurationMap[cls.id] ?? 0} hr/wk &times; $95/hr
                        </span>
                        <span className="font-semibold text-sm">
                          {formatCurrency(cls.monthlyRate)}/mo
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        ) : (
          /* ── List/Table View ──────────────────────────────────────── */
          <div className="rounded-lg border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      Class
                      {sortField === "name" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="size-3" />
                        ) : (
                          <ChevronDown className="size-3" />
                        ))}
                    </button>
                  </TableHead>
                  <TableHead>Discipline</TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                      onClick={() => handleSort("day-time")}
                    >
                      Day / Time
                      {sortField === "day-time" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="size-3" />
                        ) : (
                          <ChevronDown className="size-3" />
                        ))}
                    </button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Room</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Instructor
                  </TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                      onClick={() => handleSort("capacity")}
                    >
                      Enrollment
                      {sortField === "capacity" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="size-3" />
                        ) : (
                          <ChevronDown className="size-3" />
                        ))}
                    </button>
                  </TableHead>
                  <TableHead className="text-right">
                    <button
                      className="flex items-center gap-1 ml-auto hover:text-foreground transition-colors"
                      onClick={() => handleSort("price")}
                    >
                      Tuition/mo
                      {sortField === "price" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="size-3" />
                        ) : (
                          <ChevronDown className="size-3" />
                        ))}
                    </button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((cls) => {
                  const fillPercent = Math.min(
                    (cls.enrolledCount / cls.capacity) * 100,
                    100
                  )
                  const barColor = getCapacityBarColor(
                    cls.enrolledCount,
                    cls.capacity
                  )
                  const disciplineColor = DISCIPLINE_COLORS[cls.discipline]
                  const capacityStatus = getCapacityStatus(
                    cls.enrolledCount,
                    cls.capacity
                  )

                  return (
                    <TableRow key={cls.id} className="group">
                      <TableCell>
                        <Link
                          href={`/classes/${cls.id}`}
                          className="hover:underline"
                        >
                          <div className="font-medium text-foreground">
                            {cls.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {AGE_GROUP_LABELS[cls.ageGroup]} &middot; Ages{" "}
                            {cls.ageRange.min}&ndash;{cls.ageRange.max}
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          style={{
                            borderColor: disciplineColor,
                            color: disciplineColor,
                          }}
                        >
                          {DISCIPLINE_LABELS[cls.discipline]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {DAY_ABBREVIATIONS[cls.schedule.day]}{" "}
                        {formatTime(cls.schedule.startTime)}&ndash;
                        {formatTime(cls.schedule.endTime)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {cls.schedule.room}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">
                        {instructorNameMap[cls.instructorId] ?? "Unknown"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm tabular-nums">
                            {cls.enrolledCount}/{cls.capacity}
                          </span>
                          <div className="w-10 h-1 rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full ${barColor}`}
                              style={{ width: `${fillPercent}%` }}
                            />
                          </div>
                          <span
                            className={`text-xs font-medium ${
                              capacityStatus === "full"
                                ? "text-red-600"
                                : capacityStatus === "nearly-full"
                                  ? "text-amber-600"
                                  : "text-emerald-600"
                            }`}
                          >
                            {getCapacityLabel(
                              cls.enrolledCount,
                              cls.capacity
                            )}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(cls.monthlyRate)}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  )
}
