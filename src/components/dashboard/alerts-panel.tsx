import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Users, CreditCard, CalendarCheck } from "lucide-react"

interface Alert {
  type: "warning" | "info" | "success"
  icon: React.ElementType
  title: string
  description: string
}

const alerts: Alert[] = [
  {
    type: "warning",
    icon: Users,
    title: "3 classes at full capacity",
    description: "Ballet I Minis, Hip Hop II Teens, and Competition Ballet have waitlists",
  },
  {
    type: "warning",
    icon: CreditCard,
    title: "7 households with overdue balance",
    description: "Total outstanding: $2,840 across March billing cycle",
  },
  {
    type: "info",
    icon: CalendarCheck,
    title: "Spring recital in 6 weeks",
    description: "Costume orders due by April 10 — 12 students still need measurements",
  },
  {
    type: "success",
    icon: AlertTriangle,
    title: "Season rollover notifications sent",
    description: "428 families notified — 89% confirmed for Fall 2026 so far",
  },
]

const typeStyles = {
  warning: "border-l-amber-500 bg-amber-50/50",
  info: "border-l-blue-500 bg-blue-50/50",
  success: "border-l-emerald-500 bg-emerald-50/50",
}

const iconStyles = {
  warning: "text-amber-600",
  info: "text-blue-600",
  success: "text-emerald-600",
}

export function AlertsPanel() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Alerts & Updates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {alerts.map((alert) => (
          <div
            key={alert.title}
            className={`flex items-start gap-3 rounded-lg border-l-4 p-3 ${typeStyles[alert.type]}`}
          >
            <alert.icon className={`h-4 w-4 mt-0.5 shrink-0 ${iconStyles[alert.type]}`} />
            <div className="min-w-0">
              <p className="text-sm font-medium">{alert.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {alert.description}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
