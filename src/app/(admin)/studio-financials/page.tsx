"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/dashboard/stat-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingDown, AlertTriangle, Percent } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts"
import { formatCurrency } from "@/lib/format"
import { classFinancials } from "@/data/class-profitability"
import { getExpenseTotalForMonth, getExpensesByCategory } from "@/data/studio-expenses"
import { getRevenueTotalForMonth, getRevenueByCategory } from "@/data/studio-revenue"
import { computeClassFinancialsWithRealOverhead, defaultSettings } from "@/data/studio-financial-settings"
import { RevenueTab } from "@/components/studio-financials/revenue-tab"
import { ExpensesTab } from "@/components/studio-financials/expenses-tab"
import { ClassAnalysisTab } from "@/components/studio-financials/class-analysis-tab"
import type { AllocationMethod } from "@/lib/types"

const MONTHS = [
  "2025-04", "2025-05", "2025-06", "2025-07", "2025-08", "2025-09",
  "2025-10", "2025-11", "2025-12", "2026-01", "2026-02", "2026-03",
]

const MONTH_LABELS: Record<string, string> = {
  "2025-04": "Apr", "2025-05": "May", "2025-06": "Jun", "2025-07": "Jul",
  "2025-08": "Aug", "2025-09": "Sep", "2025-10": "Oct", "2025-11": "Nov",
  "2025-12": "Dec", "2026-01": "Jan", "2026-02": "Feb", "2026-03": "Mar",
}

type DateRange = "12" | "6" | "custom"

export default function StudioFinancialsPage() {
  const [dateRange, setDateRange] = useState<DateRange>("12")
  const [allocationMethod, setAllocationMethod] = useState<AllocationMethod>(defaultSettings.allocationMethod)

  const visibleMonths = dateRange === "6" ? MONTHS.slice(6) : MONTHS
  const currentMonth = "2026-03"

  // Monthly P&L chart data
  const chartData = visibleMonths.map((month) => ({
    month: MONTH_LABELS[month],
    revenue: getRevenueTotalForMonth(month),
    expenses: getExpenseTotalForMonth(month) + classFinancials.reduce((sum, f) => sum + f.monthlyInstructorCost, 0),
  }))

  // KPI calculations for selected range
  const totalRevenue = visibleMonths.reduce((sum, m) => sum + getRevenueTotalForMonth(m), 0)
  const totalInstructorPay = classFinancials.reduce((sum, f) => sum + f.monthlyInstructorCost, 0) * visibleMonths.length
  const totalExpenses = visibleMonths.reduce((sum, m) => sum + getExpenseTotalForMonth(m), 0) + totalInstructorPay
  const netMargin = totalRevenue - totalExpenses
  const marginPercent = totalRevenue > 0 ? (netMargin / totalRevenue) * 100 : 0

  // Recompute class financials with real overhead
  const adjustedFinancials = useMemo(
    () => computeClassFinancialsWithRealOverhead(classFinancials, currentMonth, allocationMethod),
    [allocationMethod],
  )
  const belowBreakeven = adjustedFinancials.filter((f) => f.monthlyMargin < 0).length

  // Current month breakdowns
  const currentRevenueByCategory = getRevenueByCategory(currentMonth)
  const currentExpensesByCategory = getExpensesByCategory(currentMonth)
  const currentMonthRevenue = getRevenueTotalForMonth(currentMonth)
  const currentMonthExpenses = getExpenseTotalForMonth(currentMonth)

  return (
    <>
      <Header title="Studio Financials" />
      <div className="flex-1 p-6 space-y-6">
        <PageHeader
          title="Studio Financials"
          description="Complete financial picture for Premiere Dance Studio"
        />

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="class-analysis">Class Analysis</TabsTrigger>
          </TabsList>

          {/* ── Overview Tab ──────────────────────────────────────────────── */}
          <TabsContent value="overview" className="space-y-6 mt-4">
            {/* Date range controls */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing: <span className="font-medium text-foreground">{dateRange === "6" ? "Oct 2025" : "Apr 2025"} — Mar 2026</span>
              </p>
              <div className="flex gap-1">
                <Button
                  variant={dateRange === "12" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDateRange("12")}
                >
                  12 Months
                </Button>
                <Button
                  variant={dateRange === "6" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDateRange("6")}
                >
                  6 Months
                </Button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Revenue"
                value={formatCurrency(totalRevenue)}
                trend={8.2}
                trendLabel="vs prior period"
                icon={DollarSign}
              />
              <StatCard
                title="Total Expenses"
                value={formatCurrency(totalExpenses)}
                trend={3.1}
                trendLabel="vs prior period"
                icon={TrendingDown}
                invertTrend
              />
              <StatCard
                title="Net Margin"
                value={formatCurrency(netMargin)}
                subtitle={`${marginPercent.toFixed(1)}% margin`}
                trend={12.4}
                trendLabel="vs prior period"
                icon={Percent}
              />
              <StatCard
                title="Classes Below Breakeven"
                value={belowBreakeven.toString()}
                subtitle={`of ${adjustedFinancials.length} active classes`}
                trend={-1}
                trendLabel="vs prior period"
                icon={AlertTriangle}
                invertTrend
              />
            </div>

            {/* Monthly P&L Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Monthly P&L</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ left: 10, right: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" fontSize={12} />
                      <YAxis fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        formatter={(value: any) => formatCurrency(Number(value ?? 0))}
                        contentStyle={{ fontSize: 12 }}
                      />
                      <Legend />
                      <Bar dataKey="revenue" name="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} opacity={0.7} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Revenue & Expense Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Revenue Breakdown (Mar 2026)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentRevenueByCategory.flatMap(({ items }) =>
                      items.map(({ item, amount }) => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{item.name}</span>
                          <span className="font-medium">{formatCurrency(amount)}</span>
                        </div>
                      ))
                    )}
                    <div className="border-t pt-3 flex items-center justify-between text-sm font-bold">
                      <span>Total</span>
                      <span className="text-emerald-600">{formatCurrency(currentMonthRevenue)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Expense Breakdown (Mar 2026)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentExpensesByCategory.map(({ category, items }) => {
                      const catTotal = items.reduce((sum, { amount }) => sum + amount, 0)
                      return (
                        <div key={category.id} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{category.name}</span>
                          <span className="font-medium">{formatCurrency(catTotal)}</span>
                        </div>
                      )
                    })}
                    <div className="border-t pt-3 flex items-center justify-between text-sm font-bold">
                      <span>Total</span>
                      <span className="text-red-600">{formatCurrency(currentMonthExpenses)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── Revenue Tab ───────────────────────────────────────────────── */}
          <TabsContent value="revenue" className="mt-4">
            <RevenueTab currentMonth={currentMonth} />
          </TabsContent>

          {/* ── Expenses Tab ──────────────────────────────────────────────── */}
          <TabsContent value="expenses" className="mt-4">
            <ExpensesTab currentMonth={currentMonth} />
          </TabsContent>

          {/* ── Class Analysis Tab ────────────────────────────────────────── */}
          <TabsContent value="class-analysis" className="mt-4">
            <ClassAnalysisTab
              allocationMethod={allocationMethod}
              onAllocationMethodChange={setAllocationMethod}
              currentMonth={currentMonth}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
