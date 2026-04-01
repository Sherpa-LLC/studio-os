"use client"

import Link from "next/link"
import { PageHeader } from "@/components/shared/page-header"
import { StepIndicator } from "@/components/registration/step-indicator"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/format"
import { CheckCircle2 } from "lucide-react"

// Mock confirmation data
const ENROLLED_CLASSES = [
  { name: "Ballet I - Minis (Ages 5-7)", schedule: "Monday, 3:30 - 4:30 PM", monthly: 85 },
  { name: "Jazz I - Juniors (Ages 7-9)", schedule: "Tuesday, 4:30 - 5:30 PM", monthly: 90 },
  { name: "Contemporary I - Teens (Ages 10-13)", schedule: "Monday, 5:00 - 6:00 PM", monthly: 100 },
]

export default function RegisterConfirmationPage() {
  const totalMonthly = ENROLLED_CLASSES.reduce((sum, cls) => sum + cls.monthly, 0)

  return (
    <div className="space-y-6">
      <StepIndicator currentStep={7} />

      <div className="flex flex-col items-center text-center space-y-4 py-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">You&apos;re all set!</h1>
          <p className="text-muted-foreground mt-1">
            Your registration is complete. Welcome to Studio OS Dance Academy!
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-4">
          <h3 className="font-semibold">Enrolled Classes</h3>
          <div className="space-y-3">
            {ENROLLED_CLASSES.map((cls) => (
              <div key={cls.name} className="flex items-start justify-between text-sm">
                <div>
                  <p className="font-medium">{cls.name}</p>
                  <p className="text-xs text-muted-foreground">{cls.schedule}</p>
                </div>
                <span className="text-muted-foreground">{formatCurrency(cls.monthly)}/mo</span>
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="font-semibold">Monthly Total</span>
            <span className="text-lg font-bold">{formatCurrency(totalMonthly)}</span>
          </div>

          <div className="rounded-lg bg-muted/50 p-3 text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Next billing date</span>
              <span className="font-medium">April 1, 2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment method</span>
              <span className="font-medium">Visa ending in 4242</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center pt-2">
        <Link href="/portal">
          <Button size="lg">Go to My Portal</Button>
        </Link>
      </div>
    </div>
  )
}
