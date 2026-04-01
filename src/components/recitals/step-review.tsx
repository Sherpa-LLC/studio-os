import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ChevronUp,
  ChevronDown,
  Music,
  Users,
  Clock,
  ShoppingCart,
  DollarSign,
} from "lucide-react"
import { DISCIPLINE_LABELS, DISCIPLINE_COLORS } from "@/lib/constants"
import { formatCurrency } from "@/lib/format"
import { Separator } from "@/components/ui/separator"
import type { RoutineSelection } from "./step-routines"
import type { CostumeConfig } from "./step-costumes"

// ── Props ───────────────────────────────────────────────────────────────────

interface StepReviewProps {
  routines: RoutineSelection[]
  costumes: CostumeConfig[]
  onReorder: (routines: RoutineSelection[]) => void
}

// ── Section Header ──────────────────────────────────────────────────────────

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

// ── Step Review ─────────────────────────────────────────────────────────────

export function StepReview({ routines, costumes, onReorder }: StepReviewProps) {
  function moveUp(index: number) {
    if (index === 0) return
    const updated = [...routines]
    ;[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]]
    onReorder(updated)
  }

  function moveDown(index: number) {
    if (index === routines.length - 1) return
    const updated = [...routines]
    ;[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
    onReorder(updated)
  }

  if (routines.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-muted-foreground">
          Select classes in Step 2 to build your lineup.
        </p>
      </div>
    )
  }

  // ── Summary calculations ────────────────────────────────────────────────

  const totalRoutines = routines.length
  const totalStudents = routines.reduce((sum, r) => sum + r.enrolledCount, 0)

  const costumeBudget = routines.reduce((sum, routine) => {
    const costume = costumes.find((c) => c.classId === routine.classId)
    if (!costume) return sum
    return sum + costume.unitCost * routine.enrolledCount
  }, 0)

  const estimatedRevenue = routines.reduce((sum, routine) => {
    const costume = costumes.find((c) => c.classId === routine.classId)
    if (!costume) return sum
    return sum + costume.salePrice * routine.enrolledCount
  }, 0)

  return (
    <div>
      {/* ── Show Lineup ──────────────────────────────────────────────────── */}
      <SectionHeader>Show Lineup</SectionHeader>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead className="w-20">Reorder</TableHead>
              <TableHead>Routine</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Discipline</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Students</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {routines.map((routine, index) => {
              const disciplineColor = DISCIPLINE_COLORS[routine.discipline]

              return (
                <TableRow key={routine.classId}>
                  <TableCell>
                    <span className="font-mono text-sm font-medium">
                      {index + 1}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="size-7"
                        disabled={index === 0}
                        onClick={() => moveUp(index)}
                      >
                        <ChevronUp className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="size-7"
                        disabled={index === routines.length - 1}
                        onClick={() => moveDown(index)}
                      >
                        <ChevronDown className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {routine.routineName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {routine.className}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      style={{
                        borderColor: disciplineColor,
                        color: disciplineColor,
                      }}
                    >
                      {DISCIPLINE_LABELS[routine.discipline]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="size-3.5" />
                      <span className="text-sm">{routine.estimatedDuration} min</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="size-3.5" />
                      <span className="text-sm">{routine.enrolledCount}</span>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* ── Separator ────────────────────────────────────────────────────── */}
      <Separator className="my-8" />

      {/* ── Summary ──────────────────────────────────────────────────────── */}
      <SectionHeader>Summary</SectionHeader>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Music className="size-4" />
              Total Routines
            </div>
            <p className="text-2xl font-bold">{totalRoutines}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Users className="size-4" />
              Total Students
            </div>
            <p className="text-2xl font-bold">{totalStudents}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <ShoppingCart className="size-4" />
              Costume Budget
            </div>
            <p className="text-2xl font-bold">{formatCurrency(costumeBudget)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <DollarSign className="size-4" />
              Estimated Revenue
            </div>
            <p className="text-2xl font-bold text-emerald-600">
              {formatCurrency(estimatedRevenue)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
