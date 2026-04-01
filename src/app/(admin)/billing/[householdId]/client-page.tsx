"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, formatDate } from "@/lib/format"
import { getHouseholdById, households } from "@/data/households"
import { getStudentsByHousehold } from "@/data/students"
import {
  getInvoicesByHousehold,
  getBillingOverridesByHousehold,
} from "@/data/invoices"
import { getClassById } from "@/data/classes"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  CreditCard,
  Calendar,
  ChevronDown,
  ChevronRight,
  Plus,
  Settings,
} from "lucide-react"
import type { PaymentStatus, Invoice } from "@/lib/types"

function getStatusBadge(status: PaymentStatus) {
  switch (status) {
    case "paid":
      return (
        <Badge
          className="bg-emerald-50 text-emerald-700 border-emerald-200"
          variant="outline"
        >
          Paid
        </Badge>
      )
    case "pending":
      return (
        <Badge
          className="bg-amber-50 text-amber-700 border-amber-200"
          variant="outline"
        >
          Pending
        </Badge>
      )
    case "overdue":
      return (
        <Badge
          className="bg-red-50 text-red-700 border-red-200"
          variant="outline"
        >
          Overdue
        </Badge>
      )
    case "failed":
      return <Badge variant="destructive">Failed</Badge>
    case "refunded":
      return (
        <Badge
          className="bg-gray-50 text-gray-700 border-gray-200"
          variant="outline"
        >
          Refunded
        </Badge>
      )
  }
}

function getPaymentMethodIcon(type: string) {
  const labels: Record<string, string> = {
    visa: "Visa",
    mastercard: "Mastercard",
    amex: "Amex",
  }
  return labels[type] ?? type
}

function InvoiceRow({ invoice }: { invoice: Invoice }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <TableRow
        className="cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <TableCell>
          <Button variant="ghost" size="icon-sm">
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </TableCell>
        <TableCell className="text-muted-foreground">
          {invoice.id.toUpperCase()}
        </TableCell>
        <TableCell>{formatDate(invoice.date)}</TableCell>
        <TableCell>{formatDate(invoice.dueDate)}</TableCell>
        <TableCell className="text-right font-[family-name:var(--font-geist-mono)] tabular-nums">
          {formatCurrency(invoice.total)}
        </TableCell>
        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
        <TableCell className="text-muted-foreground">
          {invoice.paidDate ? formatDate(invoice.paidDate) : "--"}
        </TableCell>
      </TableRow>
      {expanded &&
        invoice.lineItems.map((item) => (
          <TableRow key={item.id} className="bg-muted/30">
            <TableCell />
            <TableCell
              colSpan={3}
              className="text-sm text-muted-foreground pl-8"
            >
              {item.description}
            </TableCell>
            <TableCell className="text-right font-[family-name:var(--font-geist-mono)] tabular-nums text-muted-foreground">
              {formatCurrency(item.amount)}
            </TableCell>
            <TableCell />
            <TableCell />
          </TableRow>
        ))}
    </>
  )
}

export default function HouseholdBillingPage({
  params,
}: {
  params: { householdId: string }
}) {
  const { householdId } = params
  const router = useRouter()

  const household = getHouseholdById(householdId)
  const students = getStudentsByHousehold(householdId)
  const householdInvoices = getInvoicesByHousehold(householdId)
  const overrides = getBillingOverridesByHousehold(householdId)

  const [overrideDialogOpen, setOverrideDialogOpen] = useState(false)
  const [overrideAmount, setOverrideAmount] = useState("")
  const [overrideReason, setOverrideReason] = useState("")

  if (!household) {
    return (
      <>
        <Header title="Household Billing" />
        <div className="flex-1 p-6">
          <p className="text-muted-foreground">Household not found.</p>
        </div>
      </>
    )
  }

  const primaryGuardian = household.guardians[0]
  const householdName = primaryGuardian.lastName

  // Calculate the total monthly cost from students' enrolled classes
  const monthlyTotal = students.reduce((sum, student) => {
    return (
      sum +
      student.enrolledClassIds.reduce((classSum, classId) => {
        const cls = getClassById(classId)
        return classSum + (cls?.monthlyRate ?? 0)
      }, 0)
    )
  }, 0)

  return (
    <>
      <Header title="Household Billing" />
      <div className="flex-1 p-6 space-y-6">
        <PageHeader
          title={`${householdName} Household`}
          description="Billing details and invoice history"
        >
          <Button variant="outline" onClick={() => router.push("/billing")}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Billing
          </Button>
        </PageHeader>

        {/* Account Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Current Balance
                  </p>
                  <p className="text-xl font-bold font-[family-name:var(--font-geist-mono)] tabular-nums">
                    {household.balance > 0
                      ? formatCurrency(household.balance)
                      : "$0.00"}
                  </p>
                </div>
              </div>
              {household.balance > 0 && (
                <p className="text-xs text-red-600 mt-2">Amount due</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="text-sm font-medium mt-0.5">
                    {household.paymentMethod
                      ? `${getPaymentMethodIcon(household.paymentMethod.type)} ending in ${household.paymentMethod.last4}`
                      : "No card on file"}
                  </p>
                  {household.paymentMethod && (
                    <p className="text-xs text-muted-foreground">
                      Expires {household.paymentMethod.expiry}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-violet-100 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-violet-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Next Billing Date
                  </p>
                  <p className="text-sm font-medium mt-0.5">April 1, 2026</p>
                  <p className="text-xs text-muted-foreground">
                    Est. {formatCurrency(monthlyTotal)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="invoices">
          <TabsList>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="overrides">Overrides</TabsTrigger>
            <TabsTrigger value="rules">Billing Rules</TabsTrigger>
          </TabsList>

          {/* Invoices Tab */}
          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle>Invoice History</CardTitle>
              </CardHeader>
              <CardContent>
                {householdInvoices.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No invoices found for this household.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10" />
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Paid Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {householdInvoices
                        .sort((a, b) => b.date.localeCompare(a.date))
                        .map((invoice) => (
                          <InvoiceRow key={invoice.id} invoice={invoice} />
                        ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Overrides Tab */}
          <TabsContent value="overrides">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Billing Overrides</CardTitle>
                  <Dialog
                    open={overrideDialogOpen}
                    onOpenChange={setOverrideDialogOpen}
                  >
                    <DialogTrigger
                      render={
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Add Override
                        </Button>
                      }
                    />
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Billing Override</DialogTitle>
                        <DialogDescription>
                          Apply a manual adjustment to this household&apos;s
                          billing. All changes are logged with an audit trail.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="override-amount">New Amount ($)</Label>
                          <Input
                            id="override-amount"
                            type="number"
                            placeholder="0.00"
                            value={overrideAmount}
                            onChange={(e) => setOverrideAmount(e.target.value)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="override-reason">Reason</Label>
                          <Textarea
                            id="override-reason"
                            placeholder="Explain why this adjustment is being made..."
                            value={overrideReason}
                            onChange={(e) => setOverrideReason(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setOverrideDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => {
                            setOverrideDialogOpen(false)
                            setOverrideAmount("")
                            setOverrideReason("")
                          }}
                        >
                          Apply Override
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {overrides.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No billing overrides for this household.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Invoice</TableHead>
                        <TableHead className="text-right">
                          Original Amount
                        </TableHead>
                        <TableHead className="text-right">
                          New Amount
                        </TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Changed By</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {overrides.map((override) => (
                        <TableRow key={override.id}>
                          <TableCell>{formatDate(override.createdAt)}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {override.invoiceId.toUpperCase()}
                          </TableCell>
                          <TableCell className="text-right font-[family-name:var(--font-geist-mono)] tabular-nums line-through text-muted-foreground">
                            {formatCurrency(override.originalAmount)}
                          </TableCell>
                          <TableCell className="text-right font-[family-name:var(--font-geist-mono)] tabular-nums font-medium">
                            {formatCurrency(override.newAmount)}
                          </TableCell>
                          <TableCell className="max-w-[300px] truncate">
                            {override.reason}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {override.createdBy}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Rules Tab */}
          <TabsContent value="rules">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Billing Rules for {householdName} Household
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">
                    Enrolled Students & Classes
                  </h3>
                  <div className="space-y-4">
                    {students.map((student) => (
                      <div key={student.id}>
                        <p className="text-sm font-medium">
                          {student.firstName} {student.lastName}
                          <Badge variant="outline" className="ml-2">
                            {student.enrollmentStatus}
                          </Badge>
                        </p>
                        <div className="mt-1.5 space-y-1">
                          {student.enrolledClassIds.map((classId) => {
                            const cls = getClassById(classId)
                            return cls ? (
                              <div
                                key={classId}
                                className="flex items-center justify-between text-sm text-muted-foreground pl-4"
                              >
                                <span>{cls.name}</span>
                                <span className="font-[family-name:var(--font-geist-mono)] tabular-nums">
                                  {formatCurrency(cls.monthlyRate)}/mo
                                </span>
                              </div>
                            ) : null
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    Estimated Monthly Total
                  </p>
                  <p className="text-lg font-bold font-[family-name:var(--font-geist-mono)] tabular-nums">
                    {formatCurrency(monthlyTotal)}
                  </p>
                </div>

                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tuition Rate
                    </p>
                    <p className="text-sm font-medium mt-1">
                      $95/hr, prorated to class duration
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Monthly Cap
                    </p>
                    <p className="text-sm font-medium mt-1">
                      $570 (6 hrs/wk)
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Billing Cycle
                    </p>
                    <p className="text-sm font-medium mt-1">
                      Monthly, 1st of each month
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Payment Due Date
                    </p>
                    <p className="text-sm font-medium mt-1">
                      15th of each month
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Auto-Pay
                    </p>
                    <p className="text-sm font-medium mt-1">
                      {household.paymentMethod ? "Enabled" : "Not configured"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Late Fee
                    </p>
                    <p className="text-sm font-medium mt-1">
                      $25 after due date
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
