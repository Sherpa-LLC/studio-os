"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowUpDown } from "lucide-react"
import { formatCurrency } from "@/lib/format"
import { cn } from "@/lib/utils"
import { classFinancials } from "@/data/class-profitability"
import { computeClassFinancialsWithRealOverhead } from "@/data/studio-financial-settings"
import { getExpenseTotalForMonth } from "@/data/studio-expenses"
import type { AllocationMethod, ClassFinancials } from "@/lib/types"

interface ClassAnalysisTabProps {
  allocationMethod: AllocationMethod
  onAllocationMethodChange: (method: AllocationMethod) => void
  currentMonth: string
}

const METHODS: { value: AllocationMethod; label: string }[] = [
  { value: "equal", label: "Equal" },
  { value: "hours", label: "Hours" },
  { value: "revenue", label: "Revenue" },
  { value: "custom", label: "Custom" },
]

const METHOD_DESCRIPTIONS: Record<AllocationMethod, string> = {
  equal: "overhead is split equally across all active classes, regardless of size or hours.",
  hours: "overhead is distributed proportionally by weekly class hours. Classes using more studio time absorb more overhead.",
  revenue: "overhead is distributed proportionally by monthly tuition revenue. Higher-revenue classes absorb more overhead.",
  custom: "overhead is distributed by manually assigned weights per class.",
}

type SortField = "className" | "enrolledStudents" | "monthlyRevenue" | "monthlyInstructorCost" | "monthlyOverhead" | "monthlyMargin" | "marginPercent" | "breakeven"

export function ClassAnalysisTab({ allocationMethod, onAllocationMethodChange, currentMonth }: ClassAnalysisTabProps) {
  const [sortField, setSortField] = useState<SortField>("marginPercent")
  const [sortAsc, setSortAsc] = useState(false)

  const totalOverhead = getExpenseTotalForMonth(currentMonth)

  const adjustedFinancials = useMemo(
    () => computeClassFinancialsWithRealOverhead(classFinancials, currentMonth, allocationMethod),
    [allocationMethod, currentMonth],
  )

  const sorted = useMemo(() => {
    return [...adjustedFinancials].sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      return sortAsc ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number)
    })
  }, [adjustedFinancials, sortField, sortAsc])

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortField(field)
      setSortAsc(false)
    }
  }

  function getSortIcon(field: SortField) {
    if (sortField !== field) return null
    return <ArrowUpDown className="size-3 ml-1 inline" />
  }

  // KPIs
  const avgMargin = adjustedFinancials.reduce((sum, f) => sum + f.marginPercent, 0) / adjustedFinancials.length
  const profitable = adjustedFinancials.filter((f) => f.monthlyMargin > 0).length
  const belowBreakeven = adjustedFinancials.filter((f) => f.monthlyMargin < 0).length
  const bestMargin = adjustedFinancials.reduce((best, f) => f.marginPercent > best.marginPercent ? f : best, adjustedFinancials[0])

  return (
    <div className="space-y-6">
      {/* Header + allocation toggle */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold">Class Profitability</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Overhead of <span className="font-medium text-foreground">{formatCurrency(totalOverhead)}/mo</span> distributed across {adjustedFinancials.length} active classes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Allocate by:</span>
          <div className="flex rounded-lg border overflow-hidden">
            {METHODS.map((m) => (
              <button
                key={m.value}
                onClick={() => onAllocationMethodChange(m.value)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium transition-colors",
                  allocationMethod === m.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-accent text-muted-foreground"
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Avg Margin</p>
            <p className="text-xl font-bold mt-1 tabular-nums">{avgMargin.toFixed(1)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Profitable</p>
            <p className="text-xl font-bold mt-1 text-emerald-600">{profitable} <span className="text-sm font-normal text-muted-foreground">of {adjustedFinancials.length}</span></p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Below Breakeven</p>
            <p className="text-xl font-bold mt-1 text-red-600">{belowBreakeven}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Best Margin</p>
            <p className="text-xl font-bold mt-1">{bestMargin.marginPercent.toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Class table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("className")}>
                  Class {getSortIcon("className")}
                </TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead className="text-right cursor-pointer select-none" onClick={() => toggleSort("monthlyRevenue")}>
                  Revenue {getSortIcon("monthlyRevenue")}
                </TableHead>
                <TableHead className="text-right cursor-pointer select-none" onClick={() => toggleSort("monthlyInstructorCost")}>
                  Instr. Pay {getSortIcon("monthlyInstructorCost")}
                </TableHead>
                <TableHead className="text-right cursor-pointer select-none" onClick={() => toggleSort("monthlyOverhead")}>
                  Overhead {getSortIcon("monthlyOverhead")}
                </TableHead>
                <TableHead className="text-right cursor-pointer select-none" onClick={() => toggleSort("monthlyMargin")}>
                  Net Margin {getSortIcon("monthlyMargin")}
                </TableHead>
                <TableHead className="text-right cursor-pointer select-none" onClick={() => toggleSort("marginPercent")}>
                  Margin % {getSortIcon("marginPercent")}
                </TableHead>
                <TableHead className="text-right cursor-pointer select-none" onClick={() => toggleSort("breakeven")}>
                  Breakeven {getSortIcon("breakeven")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((f) => {
                const isNegative = f.monthlyMargin < 0
                const marginColor = f.marginPercent > 30
                  ? "text-emerald-600"
                  : f.marginPercent >= 0
                    ? "text-amber-600"
                    : "text-red-600"
                const studentsNeeded = isNegative ? f.breakeven - f.enrolledStudents : 0

                return (
                  <TableRow
                    key={f.classId}
                    className={cn(isNegative && "bg-red-50 hover:bg-red-100")}
                  >
                    <TableCell>
                      <div className="font-medium">{f.className}</div>
                      <div className="text-xs text-muted-foreground">
                        {f.enrolledStudents} students · {f.hoursPerWeek} hrs/wk
                        {isNegative && <span className="text-red-600 font-medium"> · needs {studentsNeeded} more</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{f.instructorName}</TableCell>
                    <TableCell className="text-right text-sm">{formatCurrency(f.monthlyRevenue)}</TableCell>
                    <TableCell className="text-right text-sm">{formatCurrency(f.monthlyInstructorCost)}</TableCell>
                    <TableCell className="text-right text-sm">{formatCurrency(f.monthlyOverhead)}</TableCell>
                    <TableCell className={cn("text-right text-sm font-medium", marginColor)}>
                      {formatCurrency(f.monthlyMargin)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs tabular-nums",
                          f.marginPercent > 30
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : f.marginPercent >= 0
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-red-50 text-red-700 border-red-200"
                        )}
                      >
                        {f.marginPercent.toFixed(1)}%
                      </Badge>
                    </TableCell>
                    <TableCell className={cn("text-right text-sm", isNegative && "text-red-600 font-semibold")}>
                      {f.breakeven}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Allocation explanation */}
      <div className="bg-violet-50 border border-violet-200 rounded-lg px-4 py-3 text-sm text-violet-800">
        <strong>Allocation method: {allocationMethod.charAt(0).toUpperCase() + allocationMethod.slice(1)}</strong> — {METHOD_DESCRIPTIONS[allocationMethod]}
      </div>
    </div>
  )
}
