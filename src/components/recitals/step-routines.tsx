import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { getAvailableClasses } from "@/data/recitals"
import { DISCIPLINE_LABELS, DISCIPLINE_COLORS, AGE_GROUP_LABELS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Users, Search, Music } from "lucide-react"
import type { Discipline, AgeGroup } from "@/lib/types"

// ── Types ──────────────────────────────────────────────────────────────────────

export interface RoutineSelection {
  classId: string
  className: string
  discipline: Discipline
  ageGroup: AgeGroup
  enrolledCount: number
  routineName: string
  estimatedDuration: number
}

interface StepRoutinesProps {
  routines: RoutineSelection[]
  onChange: (routines: RoutineSelection[]) => void
}

// ── Section Header ─────────────────────────────────────────────────────────────

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

// ── StepRoutines ───────────────────────────────────────────────────────────────

export function StepRoutines({ routines, onChange }: StepRoutinesProps) {
  const [disciplineFilter, setDisciplineFilter] = useState<Discipline | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const availableClasses = useMemo(() => getAvailableClasses(), [])

  const filteredClasses = useMemo(() => {
    return availableClasses.filter((cls) => {
      if (disciplineFilter && cls.discipline !== disciplineFilter) return false
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        return cls.name.toLowerCase().includes(term)
      }
      return true
    })
  }, [availableClasses, disciplineFilter, searchTerm])

  const selectedIds = useMemo(
    () => new Set(routines.map((r) => r.classId)),
    [routines]
  )

  function toggleClass(cls: (typeof availableClasses)[number]) {
    if (selectedIds.has(cls.id)) {
      onChange(routines.filter((r) => r.classId !== cls.id))
    } else {
      onChange([
        ...routines,
        {
          classId: cls.id,
          className: cls.name,
          discipline: cls.discipline,
          ageGroup: cls.ageGroup,
          enrolledCount: cls.enrolledCount,
          routineName: cls.name,
          estimatedDuration: 4,
        },
      ])
    }
  }

  function updateRoutineName(classId: string, name: string) {
    onChange(
      routines.map((r) => (r.classId === classId ? { ...r, routineName: name } : r))
    )
  }

  function updateDuration(classId: string, duration: number) {
    const clamped = Math.max(1, Math.min(10, duration))
    onChange(
      routines.map((r) =>
        r.classId === classId ? { ...r, estimatedDuration: clamped } : r
      )
    )
  }

  return (
    <div className="space-y-8">
      {/* ── Section 1: Select Performing Classes ──────────────────────────── */}
      <div>
        <SectionHeader>Select Performing Classes</SectionHeader>

        {/* Discipline filter pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(Object.keys(DISCIPLINE_LABELS) as Discipline[]).map((d) => {
            const isSelected = disciplineFilter === d
            const color = DISCIPLINE_COLORS[d]
            return (
              <button
                key={d}
                type="button"
                onClick={() => setDisciplineFilter(isSelected ? null : d)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 border-2 cursor-pointer",
                  isSelected
                    ? "text-white shadow-md scale-[1.02]"
                    : "bg-background border-border text-foreground hover:border-muted-foreground/30"
                )}
                style={isSelected ? { backgroundColor: color, borderColor: color } : undefined}
              >
                {DISCIPLINE_LABELS[d]}
              </button>
            )
          })}
        </div>

        {/* Search input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            className="h-10 pl-9"
            placeholder="Search classes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Selected count */}
        <p className="text-sm text-muted-foreground mb-3">
          {routines.length} of {availableClasses.length} classes selected
        </p>

        {/* Class list */}
        <div className="rounded-lg border border-border max-h-[400px] overflow-y-auto">
          {filteredClasses.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No classes match your filters.
            </div>
          ) : (
            filteredClasses.map((cls, idx) => {
              const isSelected = selectedIds.has(cls.id)
              const color = DISCIPLINE_COLORS[cls.discipline]
              return (
                <div key={cls.id}>
                  {idx > 0 && <Separator />}
                  <button
                    type="button"
                    className="flex items-center gap-3 p-3 w-full text-left hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => toggleClass(cls)}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleClass(cls)}
                    />
                    <span className="font-medium text-sm flex-1 min-w-0 truncate">
                      {cls.name}
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-[11px] text-white shrink-0"
                      style={{ backgroundColor: color }}
                    >
                      {DISCIPLINE_LABELS[cls.discipline]}
                    </Badge>
                    <span className="text-xs text-muted-foreground shrink-0 hidden sm:inline">
                      {AGE_GROUP_LABELS[cls.ageGroup]}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                      <Users className="size-3.5" />
                      {cls.enrolledCount}
                    </span>
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* ── Section 2: Your Routines ─────────────────────────────────────── */}
      {routines.length > 0 && (
        <div>
          <SectionHeader>Your Routines</SectionHeader>

          <div className="space-y-3">
            {routines.map((routine) => {
              const color = DISCIPLINE_COLORS[routine.discipline]
              return (
                <div
                  key={routine.classId}
                  className="rounded-lg border border-border p-4 border-l-4"
                  style={{ borderLeftColor: color }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {/* Routine name input */}
                    <div className="flex-1 space-y-1.5">
                      <Label
                        htmlFor={`routine-name-${routine.classId}`}
                        className="text-xs text-muted-foreground"
                      >
                        Routine Name
                      </Label>
                      <Input
                        id={`routine-name-${routine.classId}`}
                        className="h-9"
                        value={routine.routineName}
                        onChange={(e) => updateRoutineName(routine.classId, e.target.value)}
                        placeholder="Name this routine..."
                      />
                    </div>

                    {/* Duration input */}
                    <div className="w-24 shrink-0 space-y-1.5">
                      <Label
                        htmlFor={`routine-duration-${routine.classId}`}
                        className="text-xs text-muted-foreground"
                      >
                        Duration
                      </Label>
                      <div className="relative">
                        <Input
                          id={`routine-duration-${routine.classId}`}
                          type="number"
                          className="h-9 pr-9"
                          min={1}
                          max={10}
                          value={routine.estimatedDuration}
                          onChange={(e) =>
                            updateDuration(routine.classId, parseInt(e.target.value, 10) || 1)
                          }
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                          min
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Class meta info */}
                  <div className="flex items-center gap-2 mt-2.5">
                    <Music className="size-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground truncate">
                      {routine.className}
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-[10px] text-white shrink-0"
                      style={{ backgroundColor: color }}
                    >
                      {DISCIPLINE_LABELS[routine.discipline]}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0 ml-auto">
                      <Users className="size-3.5" />
                      {routine.enrolledCount}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
