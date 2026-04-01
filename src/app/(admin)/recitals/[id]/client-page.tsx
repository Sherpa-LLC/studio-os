"use client"

import { useMemo, useState, useCallback, useId } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  getRecitalById,
  getMeasurementsByRecitalId,
  getCostumeFinancials,
  lineupConflicts,
} from "@/data/recitals"
import { formatCurrency, formatDate } from "@/lib/format"
import { DISCIPLINE_LABELS, DISCIPLINE_COLORS } from "@/lib/constants"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  GripVertical,
  Download,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Users,
  Clock,
} from "lucide-react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { toast } from "sonner"
import { OverviewTab } from "@/components/recitals/overview-tab"
import type { RecitalStatus, CostumeOrderStatus, MeasurementStatus, Routine } from "@/lib/types"

// ── Status config ───────────────────────────────────────────────────────────

const RECITAL_STATUS_CONFIG: Record<RecitalStatus, { label: string; className: string }> = {
  planning: { label: "Planning", className: "bg-blue-50 text-blue-700 border-blue-200" },
  ordering: { label: "Ordering", className: "bg-amber-50 text-amber-700 border-amber-200" },
  rehearsals: { label: "Rehearsals", className: "bg-purple-50 text-purple-700 border-purple-200" },
  "show-week": { label: "Show Week", className: "bg-red-50 text-red-700 border-red-200" },
  completed: { label: "Completed", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
}

const ORDER_STATUS_CONFIG: Record<CostumeOrderStatus, { label: string; className: string }> = {
  "not-ordered": { label: "Not Ordered", className: "bg-red-50 text-red-700 border-red-200" },
  ordered: { label: "Ordered", className: "bg-amber-50 text-amber-700 border-amber-200" },
  received: { label: "Received", className: "bg-blue-50 text-blue-700 border-blue-200" },
  distributed: { label: "Distributed", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
}

const MEASUREMENT_STATUS_CONFIG: Record<MeasurementStatus, { label: string; className: string }> = {
  complete: { label: "Complete", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  "needs-update": { label: "Needs Update", className: "bg-amber-50 text-amber-700 border-amber-200" },
  missing: { label: "Missing", className: "bg-red-50 text-red-700 border-red-200" },
}

// ── Sortable Row ─────────────────────────────────────────────────────────────

function SortableRoutineRow({
  routine,
  position,
}: {
  routine: Routine
  position: number
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: routine.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const disciplineColor = DISCIPLINE_COLORS[routine.discipline]

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell className="text-muted-foreground">
        <button
          ref={setActivatorNodeRef}
          className="cursor-grab active:cursor-grabbing touch-none p-1 -m-1 rounded hover:bg-muted"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
      </TableCell>
      <TableCell className="font-mono text-sm font-medium">
        {position}
      </TableCell>
      <TableCell className="font-medium text-sm">
        {routine.name}
        {routine.lineupPosition === 4 && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
            <AlertTriangle className="size-3.5" />
            <span>
              Zoe Thompson: Only 1 apart from &quot;Shadows &amp; Light&quot;
              (#6)
            </span>
          </div>
        )}
        {routine.lineupPosition === 3 && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600">
            <CheckCircle2 className="size-3.5" />
            <span>
              All students have 3+ routines before next appearance
            </span>
          </div>
        )}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
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
      <TableCell className="text-right text-sm">
        <span className="flex items-center justify-end gap-1">
          <Clock className="size-3.5 text-muted-foreground" />
          {routine.estimatedDuration} min
        </span>
      </TableCell>
      <TableCell className="text-right text-sm">
        <span className="flex items-center justify-end gap-1">
          <Users className="size-3.5 text-muted-foreground" />
          {routine.studentCount}
        </span>
      </TableCell>
    </TableRow>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function RecitalDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params

  const recital = useMemo(() => getRecitalById(id), [id])
  const measurements = useMemo(() => getMeasurementsByRecitalId(id), [id])
  const financials = useMemo(() => getCostumeFinancials(id), [id])

  const [activeTab, setActiveTab] = useState("overview")
  const [costumeSheetRoutine, setCostumeSheetRoutine] = useState<Routine | null>(null)
  const [measurementDialogOpen, setMeasurementDialogOpen] = useState(false)

  // Lineup drag-and-drop
  const [orderedRoutines, setOrderedRoutines] = useState<Routine[] | null>(null)
  const dndId = useId()
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  )

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab)
  }, [])

  // Lineup: use reordered state if user has dragged, otherwise sort from data
  const lineup = useMemo(() => {
    if (orderedRoutines) return orderedRoutines
    if (!recital) return []
    return [...recital.routines].sort(
      (a, b) => a.lineupPosition - b.lineupPosition
    )
  }, [recital, orderedRoutines])

  const routineIds = useMemo(() => lineup.map((r) => r.id), [lineup])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setOrderedRoutines((prev) => {
      const items = prev ?? lineup
      const oldIndex = items.findIndex((r) => r.id === active.id)
      const newIndex = items.findIndex((r) => r.id === over.id)
      const reordered = arrayMove(items, oldIndex, newIndex)
      toast.success(`Moved to position ${newIndex + 1}`)
      return reordered
    })
  }

  if (!recital) {
    return (
      <>
        <Header title="Recital Not Found" />
        <div className="flex-1 p-6 space-y-6">
          <PageHeader title="Recital Not Found" />
          <p className="text-sm text-muted-foreground">
            No recital found with ID &quot;{id}&quot;.
          </p>
          <Link href="/recitals">
            <Button variant="outline">
              <ArrowLeft data-icon="inline-start" />
              Back to Recitals
            </Button>
          </Link>
        </div>
      </>
    )
  }

  const statusConfig = RECITAL_STATUS_CONFIG[recital.status]
  const notOrderedCount = recital.routines.filter(
    (r) => r.costume.orderStatus === "not-ordered"
  ).length
  const missingMeasurements = measurements.filter((m) => m.status === "missing")

  const totalStudentsCostumes = recital.routines.reduce((sum, r) => sum + r.studentCount, 0)
  const chargedFamilies = 42
  const totalFamilies = 48

  return (
    <>
      <Header title={recital.name} />
      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link href="/recitals">
              <Button variant="ghost" size="icon">
                <ArrowLeft />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight">
                  {recital.name}
                </h1>
                <Badge
                  variant="outline"
                  className={statusConfig.className}
                >
                  {statusConfig.label}
                </Badge>
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="size-3.5" />
                  {formatDate(recital.date)}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5" />
                  {recital.venue}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="costumes">Costumes</TabsTrigger>
            <TabsTrigger value="measurements">Measurements</TabsTrigger>
            <TabsTrigger value="lineup">Lineup</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
          </TabsList>

          {/* ── Overview Tab ───────────────────────────────────────────── */}
          <TabsContent value="overview">
            <OverviewTab
              recital={recital}
              measurements={measurements}
              financials={financials}
              conflictCount={lineupConflicts.length}
              onTabChange={handleTabChange}
            />
          </TabsContent>

          {/* ── Costumes Tab ───────────────────────────────────────────── */}
          <TabsContent value="costumes">
            <div className="mt-4 space-y-4">
              {/* Alert for missing measurements */}
              {missingMeasurements.length > 0 && (
                <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <AlertTriangle className="size-5 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">
                      {missingMeasurements.length} student{missingMeasurements.length !== 1 ? "s" : ""} missing measurements
                    </p>
                    <p className="text-sm text-amber-700 mt-0.5">
                      Late enrollees need measurements before costume orders can be finalized.
                    </p>
                  </div>
                </div>
              )}

              <div className="rounded-lg border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Routine</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Discipline</TableHead>
                      <TableHead>Costume</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead className="text-right">Unit Cost</TableHead>
                      <TableHead className="text-right">Sale Price</TableHead>
                      <TableHead>Order Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recital.routines.map((routine) => {
                      const orderConfig = ORDER_STATUS_CONFIG[routine.costume.orderStatus]
                      const disciplineColor = DISCIPLINE_COLORS[routine.discipline]

                      return (
                        <TableRow key={routine.id}>
                          <TableCell>
                            <button
                              className="font-medium text-sm text-left hover:underline cursor-pointer"
                              onClick={() => setCostumeSheetRoutine(routine)}
                            >
                              {routine.name}
                            </button>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
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
                          <TableCell className="text-sm">
                            {routine.costume.name}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {routine.costume.supplier}
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            {formatCurrency(routine.costume.unitCost)}
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            {formatCurrency(routine.costume.salePrice)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={orderConfig.className}
                            >
                              {orderConfig.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {routine.costume.orderStatus === "not-ordered" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  toast.success(
                                    `Order placed for "${routine.costume.name}"`
                                  )
                                }}
                              >
                                <ShoppingCart className="size-3.5 mr-1" />
                                Place Order
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          {/* ── Measurements Tab ───────────────────────────────────────── */}
          <TabsContent value="measurements">
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {measurements.length} measurement record{measurements.length !== 1 ? "s" : ""}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      toast.success("Measurement data exported for supplier")
                    }
                  >
                    <Download className="size-3.5 mr-1.5" />
                    Export for Supplier
                  </Button>
                  <Button onClick={() => setMeasurementDialogOpen(true)}>
                    Record Measurements
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Routine</TableHead>
                      <TableHead>Height</TableHead>
                      <TableHead>Chest</TableHead>
                      <TableHead>Waist</TableHead>
                      <TableHead>Hips</TableHead>
                      <TableHead>Inseam</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {measurements.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={9}
                          className="text-center text-muted-foreground py-8"
                        >
                          No measurement records for this recital.
                        </TableCell>
                      </TableRow>
                    ) : (
                      measurements.map((m) => {
                        const mConfig = MEASUREMENT_STATUS_CONFIG[m.status]
                        return (
                          <TableRow key={`${m.studentId}-${m.classId}`}>
                            <TableCell className="font-medium text-sm">
                              {m.studentName}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {m.routineName}
                            </TableCell>
                            <TableCell className="text-sm">
                              {m.height ?? "\u2014"}
                            </TableCell>
                            <TableCell className="text-sm">
                              {m.chest ?? "\u2014"}
                            </TableCell>
                            <TableCell className="text-sm">
                              {m.waist ?? "\u2014"}
                            </TableCell>
                            <TableCell className="text-sm">
                              {m.hips ?? "\u2014"}
                            </TableCell>
                            <TableCell className="text-sm">
                              {m.inseam ?? "\u2014"}
                            </TableCell>
                            <TableCell className="text-sm font-medium">
                              {m.assignedSize ?? "\u2014"}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={mConfig.className}
                              >
                                {mConfig.label}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          {/* ── Lineup Tab ─────────────────────────────────────────────── */}
          <TabsContent value="lineup">
            <div className="mt-4 space-y-4">
              {/* Constraint note */}
              <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <Users className="size-5 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Quick-Change Constraint
                  </p>
                  <p className="text-sm text-blue-700 mt-0.5">
                    Students appearing in multiple routines need at least 2
                    routines between appearances to allow for costume changes.
                  </p>
                </div>
              </div>

              <div className="rounded-lg border bg-card">
                <DndContext
                  id={dndId}
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10"></TableHead>
                        <TableHead className="w-10">#</TableHead>
                        <TableHead>Routine</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Discipline</TableHead>
                        <TableHead className="text-right">Duration</TableHead>
                        <TableHead className="text-right">Students</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <SortableContext
                        items={routineIds}
                        strategy={verticalListSortingStrategy}
                      >
                        {lineup.map((routine, idx) => (
                          <SortableRoutineRow
                            key={routine.id}
                            routine={routine}
                            position={idx + 1}
                          />
                        ))}
                      </SortableContext>
                    </TableBody>
                  </Table>
                </DndContext>
              </div>
            </div>
          </TabsContent>

          {/* ── Financials Tab ─────────────────────────────────────────── */}
          <TabsContent value="financials">
            <div className="mt-4 space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <ShoppingCart className="size-4" />
                      Total Costume Cost
                    </div>
                    <p className="text-2xl font-bold">
                      {formatCurrency(financials.totalCost)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {totalStudentsCostumes} costumes across{" "}
                      {recital.routines.length} routines
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <DollarSign className="size-4" />
                      Total Revenue
                    </div>
                    <p className="text-2xl font-bold text-emerald-600">
                      {formatCurrency(financials.totalRevenue)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      From parent costume charges
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <TrendingUp className="size-4" />
                      Profit Margin
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(financials.margin)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {financials.totalRevenue > 0
                        ? `${((financials.margin / financials.totalRevenue) * 100).toFixed(1)}% margin`
                        : "N/A"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Per-routine breakdown */}
              <div className="rounded-lg border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Routine</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead className="text-right">Students</TableHead>
                      <TableHead className="text-right">Unit Cost</TableHead>
                      <TableHead className="text-right">Sale Price</TableHead>
                      <TableHead className="text-right">Total Cost</TableHead>
                      <TableHead className="text-right">Total Revenue</TableHead>
                      <TableHead className="text-right">Margin</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {financials.perRoutine.map((row) => (
                      <TableRow key={row.routineId}>
                        <TableCell className="font-medium text-sm">
                          {row.routineName}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {row.className}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {row.studentCount}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {formatCurrency(row.unitCost)}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {formatCurrency(row.salePrice)}
                        </TableCell>
                        <TableCell className="text-right text-sm text-red-600">
                          {formatCurrency(row.totalCost)}
                        </TableCell>
                        <TableCell className="text-right text-sm text-emerald-600">
                          {formatCurrency(row.totalRevenue)}
                        </TableCell>
                        <TableCell className="text-right text-sm font-medium">
                          {formatCurrency(row.margin)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* Totals row */}
                    <TableRow className="border-t-2 font-semibold">
                      <TableCell colSpan={2}>Totals</TableCell>
                      <TableCell className="text-right">
                        {totalStudentsCostumes}
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell className="text-right text-red-600">
                        {formatCurrency(financials.totalCost)}
                      </TableCell>
                      <TableCell className="text-right text-emerald-600">
                        {formatCurrency(financials.totalRevenue)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(financials.margin)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Charge config */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Billing Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Charge to parent accounts on
                    </span>
                    <span className="text-sm font-medium">April 15, 2026</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Families charged
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {chargedFamilies} of {totalFamilies}
                      </span>
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-700 border-amber-200"
                      >
                        {totalFamilies - chargedFamilies} pending
                      </Badge>
                    </div>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all"
                      style={{
                        width: `${(chargedFamilies / totalFamilies) * 100}%`,
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* ── Costume Detail Sheet ─────────────────────────────────────── */}
      <Sheet
        open={costumeSheetRoutine !== null}
        onOpenChange={(open) => {
          if (!open) setCostumeSheetRoutine(null)
        }}
      >
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          {costumeSheetRoutine && (
            <>
              <SheetHeader>
                <SheetTitle>{costumeSheetRoutine.costume.name}</SheetTitle>
                <SheetDescription>
                  Costume for &quot;{costumeSheetRoutine.name}&quot; ({costumeSheetRoutine.className})
                </SheetDescription>
              </SheetHeader>
              <div className="px-4 space-y-5 mt-4">
                {/* Description */}
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Description
                  </p>
                  <p className="text-sm">
                    {costumeSheetRoutine.costume.description}
                  </p>
                </div>

                <Separator />

                {/* Supplier info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Supplier</p>
                    <p className="text-sm font-medium">
                      {costumeSheetRoutine.costume.supplier}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Order Status
                    </p>
                    <Badge
                      variant="outline"
                      className={
                        ORDER_STATUS_CONFIG[costumeSheetRoutine.costume.orderStatus]
                          .className
                      }
                    >
                      {
                        ORDER_STATUS_CONFIG[costumeSheetRoutine.costume.orderStatus]
                          .label
                      }
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Unit Cost</p>
                    <p className="text-sm font-medium">
                      {formatCurrency(costumeSheetRoutine.costume.unitCost)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Sale Price</p>
                    <p className="text-sm font-medium">
                      {formatCurrency(costumeSheetRoutine.costume.salePrice)}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Size breakdown */}
                {costumeSheetRoutine.costume.sizeBreakdown && (
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Size Breakdown
                    </p>
                    <div className="rounded-lg border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Size</TableHead>
                            <TableHead className="text-right">Quantity</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(
                            costumeSheetRoutine.costume.sizeBreakdown
                          ).map(([size, qty]) => (
                            <TableRow key={size}>
                              <TableCell className="font-medium">
                                {size}
                              </TableCell>
                              <TableCell className="text-right">
                                {qty}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="font-semibold border-t-2">
                            <TableCell>Total</TableCell>
                            <TableCell className="text-right">
                              {Object.values(
                                costumeSheetRoutine.costume.sizeBreakdown
                              ).reduce((sum, qty) => sum + qty, 0)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* ── Record Measurements Dialog ───────────────────────────────── */}
      <Dialog
        open={measurementDialogOpen}
        onOpenChange={setMeasurementDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Record Measurements</DialogTitle>
            <DialogDescription>
              Enter student measurements for costume sizing.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setMeasurementDialogOpen(false)
              toast.success("Measurements recorded successfully")
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="m-student">Student Name</Label>
              <Input id="m-student" placeholder="Search student..." required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="m-height">Height</Label>
                <Input id="m-height" placeholder={"e.g. 4'8\""} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="m-chest">Chest</Label>
                <Input id="m-chest" placeholder={'e.g. 28"'} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="m-waist">Waist</Label>
                <Input id="m-waist" placeholder={'e.g. 23"'} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="m-hips">Hips</Label>
                <Input id="m-hips" placeholder={'e.g. 29"'} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="m-inseam">Inseam</Label>
                <Input id="m-inseam" placeholder={'e.g. 24"'} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="m-size">Assigned Size</Label>
                <Input id="m-size" placeholder="e.g. CM" />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setMeasurementDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
