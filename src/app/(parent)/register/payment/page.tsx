"use client"

import { useState } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/shared/page-header"
import { StepIndicator } from "@/components/registration/step-indicator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/format"
import { CreditCard, Lock } from "lucide-react"

// Mock selected classes for the prototype — tuition = hours/week × $95/hr
const MOCK_SELECTED = [
  { name: "Ballet I - Minis (Ages 5-7)", hours: 1, monthly: 95 },
  { name: "Jazz I - Juniors (Ages 7-9)", hours: 1, monthly: 95 },
  { name: "Contemporary I - Teens (Ages 10-13)", hours: 1, monthly: 95 },
]

const REGISTRATION_FEE = 50

export default function RegisterPaymentPage() {
  const [card, setCard] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  })

  const monthlyTotal = MOCK_SELECTED.reduce((sum, cls) => sum + cls.monthly, 0)
  const todayTotal = monthlyTotal + REGISTRATION_FEE

  function updateCard(field: keyof typeof card, value: string) {
    setCard((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <StepIndicator currentStep={5} />
      <PageHeader
        title="Payment"
        description="Review your order and complete payment"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Order summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            <p className="text-xs text-muted-foreground mb-2">
              Tuition is $95 per hour of class per week, billed monthly.
            </p>
            <div className="space-y-3">
              {MOCK_SELECTED.map((cls) => (
                <div key={cls.name} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{cls.name} ({cls.hours} hr/wk)</span>
                  <span>{formatCurrency(cls.monthly)}/mo</span>
                </div>
              ))}
            </div>

            <Separator />

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Monthly tuition</span>
              <span>{formatCurrency(monthlyTotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">One-time registration fee</span>
              <span>{formatCurrency(REGISTRATION_FEE)}</span>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="font-semibold">Due today</span>
              <span className="text-lg font-bold">{formatCurrency(todayTotal)}</span>
            </div>

            <p className="text-xs text-muted-foreground">
              Your card will be charged {formatCurrency(monthlyTotal)} on the 1st of each
              subsequent month. You may cancel with 30 days notice.
            </p>
          </CardContent>
        </Card>

        {/* Payment form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="4242 4242 4242 4242"
                value={card.number}
                onChange={(e) => updateCard("number", e.target.value)}
              />
            </div>

            <div className="grid gap-4 grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM / YY"
                  value={card.expiry}
                  onChange={(e) => updateCard("expiry", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  placeholder="123"
                  value={card.cvc}
                  onChange={(e) => updateCard("cvc", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardName">Name on Card</Label>
              <Input
                id="cardName"
                placeholder="Jennifer Anderson"
                value={card.name}
                onChange={(e) => updateCard("name", e.target.value)}
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" />
              Your payment information is encrypted and secure.
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between pt-4">
        <Link href="/register/waiver">
          <Button variant="outline">Back</Button>
        </Link>
        <Link href="/register/confirmation">
          <Button>Complete Registration</Button>
        </Link>
      </div>
    </div>
  )
}
