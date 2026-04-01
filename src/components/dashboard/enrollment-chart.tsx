"use client"

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface EnrollmentChartProps {
  data: { discipline: string; count: number }[]
}

const DISCIPLINE_BAR_COLORS: Record<string, string> = {
  Ballet: "#EC4899",
  Jazz: "#8B5CF6",
  "Hip Hop": "#EF4444",
  Tap: "#F59E0B",
  Contemporary: "#06B6D4",
  Lyrical: "#6366F1",
  Acrobatics: "#10B981",
  "Musical Theatre": "#F97316",
  Pointe: "#D946EF",
}

export function EnrollmentChart({ data }: EnrollmentChartProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Enrollment by Discipline
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Active students across all programs
        </p>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
            >
              <XAxis
                type="number"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="discipline"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={100}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null
                  return (
                    <div className="rounded-lg border bg-card p-3 shadow-md">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-sm font-semibold">
                        {payload[0].value} students
                      </p>
                    </div>
                  )
                }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={DISCIPLINE_BAR_COLORS[entry.discipline] || "#6366F1"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
