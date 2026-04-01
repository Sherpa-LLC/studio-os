import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { COSTUME_SUPPLIERS } from "@/data/recitals"
import { DISCIPLINE_LABELS, DISCIPLINE_COLORS } from "@/lib/constants"
import type { RoutineSelection } from "./step-routines"

// ── Types ────────────────────────────────────────────────────────────────────

export interface CostumeConfig {
  classId: string
  costumeName: string
  description: string
  supplier: string
  unitCost: number
  salePrice: number
}

interface StepCostumesProps {
  routines: RoutineSelection[]
  costumes: CostumeConfig[]
  onChange: (costumes: CostumeConfig[]) => void
}

// ── Section Header ───────────────────────────────────────────────────────────

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

// ── Step Costumes ────────────────────────────────────────────────────────────

export function StepCostumes({ routines, costumes, onChange }: StepCostumesProps) {
  function updateCostume(classId: string, field: keyof CostumeConfig, value: string | number) {
    onChange(
      costumes.map((c) =>
        c.classId === classId ? { ...c, [field]: value } : c
      )
    )
  }

  if (routines.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-muted-foreground">
          Select classes in the previous step to configure costumes.
        </p>
      </div>
    )
  }

  return (
    <div>
      <SectionHeader>Costume Configuration</SectionHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {routines.map((routine) => {
          const costume = costumes.find((c) => c.classId === routine.classId)
          if (!costume) return null

          return (
            <Card key={routine.classId} className="overflow-hidden">
              <div
                className="h-1 rounded-t-lg"
                style={{ backgroundColor: DISCIPLINE_COLORS[routine.discipline] }}
              />
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-sm font-semibold">
                      {routine.routineName}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {routine.className}
                    </p>
                  </div>
                  <Badge variant="outline" className="shrink-0">
                    {DISCIPLINE_LABELS[routine.discipline]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor={`costume-name-${routine.classId}`}>Costume Name</Label>
                  <Input
                    id={`costume-name-${routine.classId}`}
                    className="h-10"
                    placeholder="e.g. Garden Fairy Tutu"
                    value={costume.costumeName}
                    onChange={(e) =>
                      updateCostume(routine.classId, "costumeName", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor={`description-${routine.classId}`}>Description</Label>
                  <Textarea
                    id={`description-${routine.classId}`}
                    rows={2}
                    placeholder="Brief costume description..."
                    value={costume.description}
                    onChange={(e) =>
                      updateCostume(routine.classId, "description", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Supplier</Label>
                  <Select
                    value={costume.supplier}
                    onValueChange={(val) =>
                      updateCostume(routine.classId, "supplier", val ?? "")
                    }
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {COSTUME_SUPPLIERS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor={`unit-cost-${routine.classId}`}>Unit Cost</Label>
                    <Input
                      id={`unit-cost-${routine.classId}`}
                      className="h-10"
                      type="number"
                      placeholder="$"
                      value={costume.unitCost || ""}
                      onChange={(e) =>
                        updateCostume(
                          routine.classId,
                          "unitCost",
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`sale-price-${routine.classId}`}>Sale Price</Label>
                    <Input
                      id={`sale-price-${routine.classId}`}
                      className="h-10"
                      type="number"
                      placeholder="$"
                      value={costume.salePrice || ""}
                      onChange={(e) =>
                        updateCostume(
                          routine.classId,
                          "salePrice",
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
