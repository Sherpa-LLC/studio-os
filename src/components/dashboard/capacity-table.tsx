"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCapacityStatus } from "@/lib/format"
import { cn } from "@/lib/utils"

interface CapacityTableProps {
  data: {
    className: string
    enrolled: number
    capacity: number
    fillRate: number
  }[]
}

export function CapacityTable({ data }: CapacityTableProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Class Fill Rates
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Top 20 classes by enrollment percentage
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.slice(0, 10).map((cls) => {
            const status = getCapacityStatus(cls.enrolled, cls.capacity)
            return (
              <div key={cls.className} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium truncate">{cls.className}</p>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-xs text-muted-foreground font-[family-name:var(--font-geist-mono)] tabular-nums">
                        {cls.enrolled}/{cls.capacity}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] px-1.5 py-0",
                          status === "full" && "bg-red-50 text-red-600 border-red-200",
                          status === "nearly-full" &&
                            "bg-amber-50 text-amber-600 border-amber-200",
                          status === "available" &&
                            "bg-emerald-50 text-emerald-600 border-emerald-200"
                        )}
                      >
                        {cls.fillRate}%
                      </Badge>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        status === "full" && "bg-red-500",
                        status === "nearly-full" && "bg-amber-500",
                        status === "available" && "bg-emerald-500"
                      )}
                      style={{ width: `${Math.min(cls.fillRate, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
