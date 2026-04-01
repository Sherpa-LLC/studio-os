"use client"

import type { AllocationMethod } from "@/lib/types"

interface ClassAnalysisTabProps {
  allocationMethod: AllocationMethod
  onAllocationMethodChange: (method: AllocationMethod) => void
  currentMonth: string
}

export function ClassAnalysisTab({ allocationMethod, onAllocationMethodChange, currentMonth }: ClassAnalysisTabProps) {
  return <div className="text-sm text-muted-foreground">Class Analysis tab — coming in next task</div>
}
