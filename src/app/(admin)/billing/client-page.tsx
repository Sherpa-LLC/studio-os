"use client"

import { useMemo } from "react"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TablePagination } from "@/components/ui/table-pagination"
import { Separator } from "@/components/ui/separator"
import { usePagination } from "@/hooks/use-pagination"
import { formatCurrency, formatDate } from "@/lib/format"


import { useRouter } from "next/navigation"
import {
  DollarSign,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronRight,
  Clock,
  Settings,
} from "lucide-react"
import type { PaymentStatus, Household, Invoice } from "@/lib/types"



function getHouseholdName(householdId: string, households: Household[]): string {
  const hh = households.find((h) => h.id === householdId)
  if (!hh) return "Unknown"
  return hh.guardians[0].lastName
}

function getStatusBadge(status: PaymentStatus) {
  switch (status) {
    case "paid":
      return (
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200" variant="outline">
          Paid
        </Badge>
      )
    case "pending":
      return (
        <Badge className="bg-amber-50 text-amber-700 border-amber-200" variant="outline">
          Pending
        </Badge>
      )
    case "overdue":
      return (
        <Badge className="bg-red-50 text-red-700 border-red-200" variant="outline">
          Overdue
        </Badge>
      )
    case "failed":
      return <Badge variant="destructive">Failed</Badge>
    case "refunded":
      return (
        <Badge className="bg-gray-50 text-gray-700 border-gray-200" variant="outline">
          Refunded
        </Badge>
      )
  }
}

interface BillingClientPageProps {
  invoices: Invoice[]
  households: Household[]
  totalBilled: number
  totalCollected: number
  totalOutstanding: number
  totalFailed: number
}

export default function BillingClientPage({
  invoices,
  households,
  totalBilled,
  totalCollected,
  totalOutstanding,
  totalFailed,
}: BillingClientPageProps) {
  const router = useRouter()

  const sortedInvoices = useMemo(
    () => [...invoices].sort((a, b) => b.date.localeCompare(a.date)),
    [invoices]
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
  } = usePagination(sortedInvoices)

  return (
    <>
      <Header title="Billing" />
      <div className="flex-1 p-6 space-y-6">
        <PageHeader
          title="Billing"
          description="Invoices and tuition management for March 2026"
        />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Billed
                </p>
                <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-bold tracking-tight font-[family-name:var(--font-geist-mono)] tabular-nums">
                {formatCurrency(totalBilled)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Collected
                </p>
                <div className="h-9 w-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-bold tracking-tight font-[family-name:var(--font-geist-mono)] tabular-nums">
                {formatCurrency(totalCollected)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {totalBilled > 0
                  ? `${((totalCollected / totalBilled) * 100).toFixed(0)}% collection rate`
                  : "No invoices yet"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Outstanding
                </p>
                <div className="h-9 w-9 rounded-lg bg-amber-100 flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-bold tracking-tight font-[family-name:var(--font-geist-mono)] tabular-nums">
                {formatCurrency(totalOutstanding)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Pending + overdue
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Failed Payments
                </p>
                <div className="h-9 w-9 rounded-lg bg-red-100 flex items-center justify-center">
                  <XCircle className="h-4 w-4 text-red-600" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-bold tracking-tight font-[family-name:var(--font-geist-mono)] tabular-nums">
                {formatCurrency(totalFailed)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Requires attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Billing Rules */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Billing Configuration
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Rate Structure</p>
                <p className="text-sm font-medium mt-1">
                  Per-class monthly rate
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  $75 - $165/mo depending on class level
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Multi-Class Discount
                </p>
                <p className="text-sm font-medium mt-1">
                  No automatic cap
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Override available per household
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Terms</p>
                <p className="text-sm font-medium mt-1">Due by the 15th</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Auto-charged on file if card present
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Invoices Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Household</TableHead>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedItems.map((invoice) => (
                  <TableRow
                    key={invoice.id}
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(`/billing/${invoice.householdId}`)
                    }
                  >
                    <TableCell className="font-medium">
                      {getHouseholdName(invoice.householdId, households)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {invoice.id.toUpperCase()}
                    </TableCell>
                    <TableCell>{formatDate(invoice.date)}</TableCell>
                    <TableCell className="text-right font-[family-name:var(--font-geist-mono)] tabular-nums">
                      {formatCurrency(invoice.total)}
                    </TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/billing/${invoice.householdId}`)
                        }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
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
    </>
  )
}
