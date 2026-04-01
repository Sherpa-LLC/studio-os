import { Card, CardContent } from "@/components/ui/card"
import { TrendingDown, TrendingUp, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string
  subtitle?: string
  trend: number
  trendLabel?: string
  icon: React.ElementType
  invertTrend?: boolean // true = negative trend is good (like attrition)
}

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  trendLabel = "vs last month",
  icon: Icon,
  invertTrend = false,
}: StatCardProps) {
  const isPositive = invertTrend ? trend < 0 : trend > 0
  const isNeutral = trend === 0

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-3xl font-bold tracking-tight font-[family-name:var(--font-geist-mono)] tabular-nums">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
          <div className="flex items-center gap-1.5 mt-2">
            {isNeutral ? (
              <Minus className="h-3.5 w-3.5 text-muted-foreground" />
            ) : isPositive ? (
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-red-600" />
            )}
            <span
              className={cn(
                "text-xs font-medium",
                isNeutral
                  ? "text-muted-foreground"
                  : isPositive
                    ? "text-emerald-600"
                    : "text-red-600"
              )}
            >
              {trend > 0 ? "+" : ""}
              {trend.toFixed(1)}%
            </span>
            <span className="text-xs text-muted-foreground">{trendLabel}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
