"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { formatCurrency } from "@/lib/format"
import { expenseCategories, expenseLineItems, getExpensesByCategory, getExpenseTotalForMonth } from "@/data/studio-expenses"
import { classFinancials } from "@/data/class-profitability"

interface ExpensesTabProps {
  currentMonth: string
}

export function ExpensesTab({ currentMonth }: ExpensesTabProps) {
  const categorizedExpenses = getExpensesByCategory(currentMonth)
  const totalExpenses = getExpenseTotalForMonth(currentMonth)
  const totalInstructorPay = classFinancials.reduce((sum, f) => sum + f.monthlyInstructorCost, 0)
  const itemCount = expenseLineItems.length
  const categoryCount = expenseCategories.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Monthly Expenses</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Enter your average monthly costs. These flow into overhead allocation for class profitability.
          </p>
        </div>
        <Button size="sm">
          <Plus className="size-4 mr-1.5" />
          Add Category
        </Button>
      </div>

      {/* Category groups */}
      {categorizedExpenses.map(({ category, items }) => (
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
                <span className="text-sm">{item.name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground w-14 text-right">Monthly</span>
                  <div className="bg-muted border rounded-md px-3 py-1.5 w-28 text-right text-sm font-medium tabular-nums">
                    {formatCurrency(amount)}
                  </div>
                  <button className="text-muted-foreground hover:text-foreground text-lg leading-none">
                    ⋮
                  </button>
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
            Total Monthly Expenses (excl. instructor pay)
          </p>
          <p className="text-xs text-emerald-700 mt-0.5">
            {itemCount} items across {categoryCount} categories
          </p>
        </div>
        <p className="text-2xl font-bold text-emerald-800 tabular-nums">
          {formatCurrency(totalExpenses)}
        </p>
      </div>

      {/* Instructor pay note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800">
        <strong>Note:</strong> Instructor pay ({formatCurrency(totalInstructorPay)}/mo) is calculated
        automatically from class schedules and pay rates — it&apos;s not entered here. Total overhead
        including instructor pay: <strong>{formatCurrency(totalExpenses + totalInstructorPay)}/mo</strong>
      </div>
    </div>
  )
}
