"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/dashboard/stat-card"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { EnrollmentChart } from "@/components/dashboard/enrollment-chart"
import { CapacityTable } from "@/components/dashboard/capacity-table"
import { AlertsPanel } from "@/components/dashboard/alerts-panel"
import { dashboardStats, leadSourceAnalytics } from "@/data/dashboard-stats"
import { classFinancials } from "@/data/class-profitability"
import { formatCurrency } from "@/lib/format"
import { Users, DollarSign, UserMinus, UserPlus, TrendingUp, Target, Clock, BarChart3, ArrowUpDown, Percent, AlertTriangle, Award } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

// ── Source config ────────────────────────────────────────────────────────────

const SOURCE_LABELS: Record<string, string> = {
  website: "Website",
  "social-media": "Social Media",
  referral: "Referral",
  "walk-in": "Walk-in",
  phone: "Phone",
  trial: "Trial Event",
}

const SOURCE_COLORS: Record<string, string> = {
  website: "#3b82f6",
  "social-media": "#ec4899",
  referral: "#8b5cf6",
  "walk-in": "#10b981",
  phone: "#6b7280",
  trial: "#f59e0b",
}

const SOURCE_BADGE_COLORS: Record<string, string> = {
  website: "bg-blue-50 text-blue-700 border-blue-200",
  "social-media": "bg-pink-50 text-pink-700 border-pink-200",
  referral: "bg-purple-50 text-purple-700 border-purple-200",
  "walk-in": "bg-emerald-50 text-emerald-700 border-emerald-200",
  phone: "bg-gray-100 text-gray-600 border-gray-200",
  trial: "bg-amber-50 text-amber-700 border-amber-200",
}

type ProfitSortField = "className" | "discipline" | "enrolledStudents" | "monthlyRevenue" | "monthlyInstructorCost" | "monthlyOverhead" | "monthlyMargin" | "marginPercent"

export default function DashboardPage() {
  const [profitSortField, setProfitSortField] = useState<ProfitSortField>("marginPercent")
  const [profitSortAsc, setProfitSortAsc] = useState(false)

  // Profitability KPIs
  const totalMonthlyMargin = classFinancials.reduce((sum, f) => sum + f.monthlyMargin, 0)
  const avgMarginPercent = classFinancials.reduce((sum, f) => sum + f.marginPercent, 0) / classFinancials.length
  const belowBreakeven = classFinancials.filter((f) => f.monthlyMargin < 0).length
  const highestMarginClass = classFinancials.reduce((best, f) => f.marginPercent > best.marginPercent ? f : best, classFinancials[0])

  const sortedFinancials = [...classFinancials].sort((a, b) => {
    const aVal = a[profitSortField]
    const bVal = b[profitSortField]
    if (typeof aVal === "string" && typeof bVal === "string") {
      return profitSortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    }
    return profitSortAsc ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number)
  })

  function toggleProfitSort(field: ProfitSortField) {
    if (profitSortField === field) {
      setProfitSortAsc(!profitSortAsc)
    } else {
      setProfitSortField(field)
      setProfitSortAsc(false)
    }
  }

  function getSortIcon(field: ProfitSortField) {
    if (profitSortField !== field) return null
    return <ArrowUpDown className="size-3 ml-1 inline" />
  }

  const totalLeads = leadSourceAnalytics.reduce((sum, s) => sum + s.leads, 0)
  const totalEnrollments = leadSourceAnalytics.reduce((sum, s) => sum + s.enrollments, 0)
  const totalRevenue = leadSourceAnalytics.reduce((sum, s) => sum + s.revenueAttributed, 0)
  const overallConversion = totalLeads > 0 ? Math.round((totalEnrollments / totalLeads) * 1000) / 10 : 0

  const chartData = leadSourceAnalytics.map((s) => ({
    source: SOURCE_LABELS[s.source] ?? s.source,
    leads: s.leads,
    enrollments: s.enrollments,
    fill: SOURCE_COLORS[s.source] ?? "#6b7280",
  }))

  return (
    <>
      <Header title="Dashboard" />
      <div className="flex-1 p-6 space-y-6">
        <PageHeader
          title={`${getGreeting()}, Vicki`}
          description="Here's what's happening at Premiere Dance Studio"
        />

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Lead Analytics</TabsTrigger>
            <TabsTrigger value="profitability">Profitability</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-4">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Paying Students"
                value={dashboardStats.payingStudents.toLocaleString()}
                subtitle={`${dashboardStats.trialStudents} trial · ${dashboardStats.waitlistedStudents} waitlisted`}
                trend={dashboardStats.activeStudentsTrend}
                icon={Users}
              />
              <StatCard
                title="Monthly Revenue"
                value={formatCurrency(dashboardStats.mrr)}
                trend={dashboardStats.mrrTrend}
                icon={DollarSign}
              />
              <StatCard
                title="Attrition Rate"
                value={`${dashboardStats.attritionRate}%`}
                trend={dashboardStats.attritionTrend}
                icon={UserMinus}
                invertTrend
              />
              <StatCard
                title="New Enrollments"
                value={dashboardStats.newEnrollments.toString()}
                trend={dashboardStats.newEnrollmentsTrend}
                icon={UserPlus}
                trendLabel="this month"
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <RevenueChart data={dashboardStats.revenueByMonth} />
              <EnrollmentChart data={dashboardStats.enrollmentByDiscipline} />
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <CapacityTable data={dashboardStats.classFillRates} />
              <AlertsPanel />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 mt-4">
            {/* Analytics KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Leads"
                value={totalLeads.toLocaleString()}
                trend={18.3}
                trendLabel="vs last quarter"
                icon={Users}
              />
              <StatCard
                title="Total Enrollments"
                value={totalEnrollments.toLocaleString()}
                trend={12.7}
                trendLabel="vs last quarter"
                icon={Target}
              />
              <StatCard
                title="Overall Conversion"
                value={`${overallConversion}%`}
                trend={3.2}
                trendLabel="vs last quarter"
                icon={TrendingUp}
              />
              <StatCard
                title="Revenue from Leads"
                value={formatCurrency(totalRevenue)}
                trend={22.1}
                trendLabel="vs last quarter"
                icon={DollarSign}
              />
            </div>

            {/* Chart + Table */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Leads by source bar chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <BarChart3 className="size-4 text-muted-foreground" />
                    Leads by Source
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" fontSize={12} />
                        <YAxis type="category" dataKey="source" width={90} fontSize={12} />
                        <Tooltip
                          contentStyle={{ fontSize: 12 }}
                          formatter={(value) => [String(value), "Leads"]}
                        />
                        <Bar dataKey="leads" radius={[0, 4, 4, 0]}>
                          {chartData.map((entry, i) => (
                            <Cell key={i} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Conversion funnel by source */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Target className="size-4 text-muted-foreground" />
                    Conversion by Source
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leadSourceAnalytics
                      .sort((a, b) => b.conversionRate - a.conversionRate)
                      .map((s) => (
                        <div key={s.source} className="space-y-1.5">
                          <div className="flex items-center justify-between text-sm">
                            <Badge variant="outline" className={SOURCE_BADGE_COLORS[s.source] ?? ""}>
                              {SOURCE_LABELS[s.source] ?? s.source}
                            </Badge>
                            <span className="font-semibold">{s.conversionRate}%</span>
                          </div>
                          <Progress value={s.conversionRate} className="h-2" />
                          <div className="flex justify-between text-[10px] text-muted-foreground">
                            <span>{s.leads} leads &rarr; {s.trialsBooked} trials &rarr; {s.enrollments} enrolled</span>
                            <span className="flex items-center gap-1">
                              <Clock className="size-3" /> {s.avgDaysToConvert}d avg
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">
                  Lead Source ROI Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source</TableHead>
                      <TableHead className="text-right">Leads</TableHead>
                      <TableHead className="text-right">Trials</TableHead>
                      <TableHead className="text-right">Enrollments</TableHead>
                      <TableHead className="text-right">Conversion</TableHead>
                      <TableHead className="text-right">Avg Days</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leadSourceAnalytics.map((s) => (
                      <TableRow key={s.source}>
                        <TableCell>
                          <Badge variant="outline" className={SOURCE_BADGE_COLORS[s.source] ?? ""}>
                            {SOURCE_LABELS[s.source] ?? s.source}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">{s.leads}</TableCell>
                        <TableCell className="text-right">{s.trialsBooked}</TableCell>
                        <TableCell className="text-right">{s.enrollments}</TableCell>
                        <TableCell className="text-right font-medium">{s.conversionRate}%</TableCell>
                        <TableCell className="text-right">{s.avgDaysToConvert}d</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(s.revenueAttributed)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-semibold border-t-2">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right">{totalLeads}</TableCell>
                      <TableCell className="text-right">{leadSourceAnalytics.reduce((s, m) => s + m.trialsBooked, 0)}</TableCell>
                      <TableCell className="text-right">{totalEnrollments}</TableCell>
                      <TableCell className="text-right">{overallConversion}%</TableCell>
                      <TableCell className="text-right">—</TableCell>
                      <TableCell className="text-right">{formatCurrency(totalRevenue)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profitability" className="space-y-6 mt-4">
            {/* Profitability KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Monthly Margin"
                value={formatCurrency(totalMonthlyMargin)}
                trend={8.3}
                trendLabel="vs last month"
                icon={DollarSign}
              />
              <StatCard
                title="Average Margin"
                value={`${avgMarginPercent.toFixed(1)}%`}
                trend={2.1}
                trendLabel="vs last month"
                icon={Percent}
              />
              <StatCard
                title="Classes Below Breakeven"
                value={belowBreakeven.toString()}
                trend={-1}
                trendLabel="vs last month"
                icon={AlertTriangle}
                invertTrend
              />
              <StatCard
                title="Highest Margin Class"
                value={`${highestMarginClass.className}`}
                subtitle={`${highestMarginClass.marginPercent.toFixed(0)}% margin`}
                trend={0}
                trendLabel=""
                icon={Award}
              />
            </div>

            {/* Sortable profitability table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">
                  Class Profitability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        className="cursor-pointer select-none"
                        onClick={() => toggleProfitSort("className")}
                      >
                        Class {getSortIcon("className")}
                      </TableHead>
                      <TableHead
                        className="cursor-pointer select-none"
                        onClick={() => toggleProfitSort("discipline")}
                      >
                        Discipline {getSortIcon("discipline")}
                      </TableHead>
                      <TableHead
                        className="text-right cursor-pointer select-none"
                        onClick={() => toggleProfitSort("enrolledStudents")}
                      >
                        Students {getSortIcon("enrolledStudents")}
                      </TableHead>
                      <TableHead
                        className="text-right cursor-pointer select-none"
                        onClick={() => toggleProfitSort("monthlyRevenue")}
                      >
                        Revenue {getSortIcon("monthlyRevenue")}
                      </TableHead>
                      <TableHead
                        className="text-right cursor-pointer select-none"
                        onClick={() => toggleProfitSort("monthlyInstructorCost")}
                      >
                        Instructor {getSortIcon("monthlyInstructorCost")}
                      </TableHead>
                      <TableHead
                        className="text-right cursor-pointer select-none"
                        onClick={() => toggleProfitSort("monthlyOverhead")}
                      >
                        Overhead {getSortIcon("monthlyOverhead")}
                      </TableHead>
                      <TableHead
                        className="text-right cursor-pointer select-none"
                        onClick={() => toggleProfitSort("monthlyMargin")}
                      >
                        Margin {getSortIcon("monthlyMargin")}
                      </TableHead>
                      <TableHead
                        className="text-right cursor-pointer select-none"
                        onClick={() => toggleProfitSort("marginPercent")}
                      >
                        Margin % {getSortIcon("marginPercent")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedFinancials.map((f) => {
                      const marginColor =
                        f.marginPercent > 30
                          ? "text-emerald-600"
                          : f.marginPercent >= 0
                            ? "text-amber-600"
                            : "text-red-600"
                      return (
                        <TableRow key={f.classId}>
                          <TableCell className="font-medium">{f.className}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {f.discipline}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">{f.enrolledStudents}</TableCell>
                          <TableCell className="text-right">{formatCurrency(f.monthlyRevenue)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(f.monthlyInstructorCost)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(f.monthlyOverhead)}</TableCell>
                          <TableCell className={`text-right font-medium ${marginColor}`}>
                            {formatCurrency(f.monthlyMargin)}
                          </TableCell>
                          <TableCell className={`text-right font-medium ${marginColor}`}>
                            {f.marginPercent.toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
