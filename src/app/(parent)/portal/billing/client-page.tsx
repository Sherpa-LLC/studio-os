"use client"

import { Fragment, useMemo, useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TablePagination } from "@/components/ui/table-pagination"
import { usePagination } from "@/hooks/use-pagination"
import { formatCurrency, formatDate } from "@/lib/format"
import { toast } from "sonner"
import { CreditCard, CheckCircle2, Clock, ChevronDown, ChevronUp, Pencil } from "lucide-react"
import type { Household, Invoice, Student, Class } from "@/lib/types"

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "paid":
      return (
        <Badge variant="secondary" className="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Paid
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="secondary" className="text-amber-600 bg-amber-50 dark:bg-amber-900/30">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      )
    case "overdue":
      return (
        <Badge variant="destructive">
          Overdue
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

interface MyBillingClientProps {
  household: Household
  invoices: Invoice[]
  students: Student[]
  classes: Class[]
}

export default function MyBillingClient({
  household,
  invoices: householdInvoices,
  students,
  classes,
}: MyBillingClientProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)

  const sortedInvoices = useMemo(
    () =>
      [...householdInvoices].sort(
        (a, b) => b.date.localeCompare(a.date)
      ),
    [householdInvoices]
  )

  const {
    page,
    pageSize,
    pageCount,
    totalItems,
    paginatedItems,
    setPage,
    setPageSize,
    startIndex,
    endIndex,
  } = usePagination(sortedInvoices, { initialPageSize: 10 })

  function getStudentName(studentId: string): string {
    const student = students.find((s) => s.id === studentId)
    return student ? `${student.firstName} ${student.lastName}` : studentId
  }

  function getClassName(classId: string): string {
    const cls = classes.find((c) => c.id === classId)
    return cls?.name ?? classId
  }

  const paymentMethodLabel = household.paymentMethod
    ? `${household.paymentMethod.type.charAt(0).toUpperCase() + household.paymentMethod.type.slice(1)} ending in ${household.paymentMethod.last4}`
    : "No payment method"

  function handleUpdatePayment() {
    setPaymentDialogOpen(false)
    toast.success("Payment method updated successfully")
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Billing"
        description="Invoices and payment history"
      />

      {/* Account summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card size="sm">
          <CardContent className="space-y-1">
            <p className="text-xs text-muted-foreground">Current Balance</p>
            <p className={`text-2xl font-bold ${household.balance === 0 ? "text-emerald-600" : "text-red-600"}`}>
              {formatCurrency(household.balance)}
            </p>
            <p className="text-xs text-muted-foreground">
              {household.balance === 0 ? "Paid in Full" : "Outstanding balance"}
            </p>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardContent className="space-y-1">
            <p className="text-xs text-muted-foreground">Payment Method</p>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">
                {paymentMethodLabel}
              </span>
            </div>
            <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
              <DialogTrigger
                render={
                  <Button variant="link" size="sm" className="h-auto p-0 text-xs" />
                }
              >
                <Pencil className="h-3 w-3 mr-1" />
                Update Payment Method
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Payment Method</DialogTitle>
                  <DialogDescription>
                    Enter your new card details below.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input id="card-number" placeholder="4242 4242 4242 4242" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="card-expiry">Expiry</Label>
                      <Input id="card-expiry" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="card-cvc">CVC</Label>
                      <Input id="card-cvc" placeholder="123" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="card-name">Cardholder Name</Label>
                    <Input id="card-name" placeholder="Jennifer Anderson" />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleUpdatePayment}>
                    Save Card
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardContent className="space-y-1">
            <p className="text-xs text-muted-foreground">Next Billing Date</p>
            <p className="text-2xl font-bold">
              {formatDate("2026-04-01")}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(475)} due
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Invoice history */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="hidden sm:table-cell">Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedItems.map((inv) => {
                const isExpanded = expandedId === inv.id
                const monthLabel = new Date(inv.date + "T00:00:00").toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })

                return (
                  <Fragment key={inv.id}>
                    <TableRow
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setExpandedId(isExpanded ? null : inv.id)}
                    >
                      <TableCell>{formatDate(inv.date)}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {monthLabel} Tuition
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(inv.total)}
                      </TableCell>
                      <TableCell className="text-right">
                        <StatusBadge status={inv.status} />
                      </TableCell>
                      <TableCell>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow>
                        <TableCell colSpan={5} className="bg-muted/30 p-0">
                          <div className="px-4 py-3 space-y-2">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Line Items
                            </p>
                            {inv.lineItems.map((item) => (
                              <div key={item.id} className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                  {item.description}
                                </span>
                                <span className="font-medium">
                                  {formatCurrency(item.amount)}
                                </span>
                              </div>
                            ))}
                            <Separator />
                            <div className="flex items-center justify-between text-sm font-medium">
                              <span>Total</span>
                              <span>{formatCurrency(inv.total)}</span>
                            </div>
                            {inv.paidDate && (
                              <p className="text-xs text-muted-foreground">
                                Paid on {formatDate(inv.paidDate)}
                              </p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                )
              })}
            </TableBody>
          </Table>
          <TablePagination
            page={page}
            pageCount={pageCount}
            pageSize={pageSize}
            totalItems={totalItems}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            className="px-4"
          />
        </CardContent>
      </Card>
    </div>
  )
}
