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
import type { Class } from "@/lib/types"
import { CreditCard, Lock } from "lucide-react"

const REGISTRATION_FEE = 50

interface RegisterPaymentClientPageProps {
  selectedClasses: Class[]
  selectedIdsParam: string
}

export default function RegisterPaymentClientPage({
  selectedClasses,
  selectedIdsParam,
}: RegisterPaymentClientPageProps) {
  const [card, setCard] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  })

  const monthlyTotal = selectedClasses.reduce((sum, cls) => sum + cls.monthlyRate, 0)
  const todayTotal = monthlyTotal + REGISTRATION_FEE
  const waiverHref = {
    pathname: "/register/waiver",
    query: selectedIdsParam ? { classIds: selectedIdsParam } : {},
  }

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
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground mb-2">
              Tuition is based on the classes selected earlier in registration.
            </p>

            {selectedClasses.length > 0 ? (
              <div className="space-y-3">
                {selectedClasses.map((cls) => (
                  <div key={cls.id} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {cls.name}
                    </span>
                    <span>{formatCurrency(cls.monthlyRate)}/mo</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                No classes are selected yet. Go back to the class step and choose at least one class
                before completing payment.
              </div>
            )}

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
        <Link href={waiverHref}>
          <Button variant="outline">Back</Button>
        </Link>
        <Link href="/register/confirmation">
          <Button disabled={selectedClasses.length === 0}>Complete Registration</Button>
        </Link>
      </div>
    </div>
  )
}
