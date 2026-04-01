"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { formatCurrency } from "@/lib/format"
import { revenueCategories, revenueLineItems, getRevenueByCategory, getRevenueTotalForMonth } from "@/data/studio-revenue"

interface RevenueTabProps {
  currentMonth: string
}

export function RevenueTab({ currentMonth }: RevenueTabProps) {
  const categorizedRevenue = getRevenueByCategory(currentMonth)
  const totalRevenue = getRevenueTotalForMonth(currentMonth)
  const itemCount = revenueLineItems.length
  const categoryCount = revenueCategories.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Monthly Revenue</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track all income streams. Tuition is auto-calculated from class enrollment data.
          </p>
        </div>
        <Button size="sm">
          <Plus className="size-4 mr-1.5" />
          Add Category
        </Button>
      </div>

      {/* Category groups */}
      {categorizedRevenue.map(({ category, items }) => (
        <div key={category.id}>
          <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-2.5 pb-1.5 border-b">
            {category.name}
          </div>
          <div className="space-y-2">
            {items.map(({ item, amount }) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-card border rounded-lg px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{item.name}</span>
                  {item.isAutoCalculated && (
                    <Badge variant="secondary" className="text-[10px]">Auto</Badge>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground w-14 text-right">Monthly</span>
                  <div className="bg-muted border rounded-md px-3 py-1.5 w-28 text-right text-sm font-medium tabular-nums">
                    {formatCurrency(amount)}
                  </div>
                  {!item.isAutoCalculated && (
                    <button className="text-muted-foreground hover:text-foreground text-lg leading-none">
                      ⋮
                    </button>
                  )}
                  {item.isAutoCalculated && <div className="w-4" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Total footer */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
            Total Monthly Revenue
          </p>
          <p className="text-xs text-emerald-700 mt-0.5">
            {itemCount} items across {categoryCount} categories
          </p>
        </div>
        <p className="text-2xl font-bold text-emerald-800 tabular-nums">
          {formatCurrency(totalRevenue)}
        </p>
      </div>
    </div>
  )
}
