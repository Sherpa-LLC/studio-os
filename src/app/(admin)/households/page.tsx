"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { households } from "@/data/households"
import { students } from "@/data/students"
import { formatCurrency } from "@/lib/format"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Search, MoreHorizontal } from "lucide-react"
import { toast } from "sonner"
import type { Household } from "@/lib/types"

const STATUS_BADGE_CLASSES: Record<Household["status"], string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  inactive: "bg-amber-50 text-amber-700 border-amber-200",
  archived: "bg-gray-100 text-gray-600 border-gray-200",
}

const STATUS_LABELS: Record<Household["status"], string> = {
  active: "Active",
  inactive: "Inactive",
  archived: "Archived",
}

function getHouseholdName(household: Household): string {
  const primary = household.guardians[0]
  return primary ? `${primary.lastName} Family` : "Unknown"
}

function getGuardianSummary(household: Household): string {
  return household.guardians
    .map((g) => `${g.firstName} ${g.lastName}`)
    .join(", ")
}

function getStudentCount(household: Household): number {
  return students.filter((s) => s.householdId === household.id).length
}

export default function HouseholdsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim()
    return households.filter((hh) => {
      // Status filter
      if (statusFilter !== "all" && hh.status !== statusFilter) return false

      // Search filter
      if (query) {
        const guardianNames = hh.guardians
          .map((g) => `${g.firstName} ${g.lastName}`.toLowerCase())
          .join(" ")
        const guardianEmails = hh.guardians
          .map((g) => g.email.toLowerCase())
          .join(" ")
        const address =
          `${hh.address.street} ${hh.address.city} ${hh.address.state} ${hh.address.zip}`.toLowerCase()

        return (
          guardianNames.includes(query) ||
          guardianEmails.includes(query) ||
          address.includes(query)
        )
      }

      return true
    })
  }, [search, statusFilter])

  return (
    <>
      <Header title="Households" />
      <div className="flex-1 p-6 space-y-6">
        <PageHeader
          title="Households"
          description="Manage family accounts and billing"
        >
          <Dialog>
            <DialogTrigger render={<Button />}>
              <Plus data-icon="inline-start" />
              Add Household
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Household</DialogTitle>
                <DialogDescription>
                  Create a new family account with guardian and student info.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Primary Guardian</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="g-first">First Name</Label>
                      <Input id="g-first" placeholder="Jane" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="g-last">Last Name</Label>
                      <Input id="g-last" placeholder="Doe" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="g-email">Email</Label>
                    <Input id="g-email" type="email" placeholder="jane@example.com" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="g-phone">Phone</Label>
                    <Input id="g-phone" type="tel" placeholder="(555) 123-4567" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Address</h4>
                  <div className="space-y-1.5">
                    <Label htmlFor="addr-street">Street</Label>
                    <Input id="addr-street" placeholder="123 Main St" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5 col-span-1">
                      <Label htmlFor="addr-city">City</Label>
                      <Input id="addr-city" placeholder="Springfield" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="addr-state">State</Label>
                      <Input id="addr-state" placeholder="IL" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="addr-zip">Zip</Label>
                      <Input id="addr-zip" placeholder="62701" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Child</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="c-first">First Name</Label>
                      <Input id="c-first" placeholder="Emily" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="c-last">Last Name</Label>
                      <Input id="c-last" placeholder="Doe" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="c-dob">Date of Birth</Label>
                    <Input id="c-dob" type="date" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Payment Method</h4>
                  <div className="space-y-1.5">
                    <Label htmlFor="card-num">Card Number</Label>
                    <Input id="card-num" placeholder="•••• •••• •••• ••••" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="card-exp">Expiry</Label>
                      <Input id="card-exp" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="card-cvv">CVV</Label>
                      <Input id="card-cvv" placeholder="•••" />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => toast.success("Household created successfully")}
                >
                  Save Household
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PageHeader>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(val) => setStatusFilter(val ?? "all")}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          {filtered.length} household{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Table */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Household</TableHead>
                <TableHead>Guardians</TableHead>
                <TableHead className="text-center">Students</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground py-8"
                  >
                    No households found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((hh) => {
                  const studentCount = getStudentCount(hh)
                  return (
                    <TableRow key={hh.id}>
                      <TableCell>
                        <Link
                          href={`/households/${hh.id}`}
                          className="font-medium text-foreground hover:underline"
                        >
                          {getHouseholdName(hh)}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-[240px] truncate">
                        {getGuardianSummary(hh)}
                      </TableCell>
                      <TableCell className="text-center">
                        {studentCount}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={STATUS_BADGE_CLASSES[hh.status]}
                        >
                          {STATUS_LABELS[hh.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {hh.balance > 0 ? (
                          <span className="text-red-600">
                            {formatCurrency(hh.balance)}
                          </span>
                        ) : hh.balance < 0 ? (
                          <span className="text-emerald-600">
                            {formatCurrency(hh.balance)} credit
                          </span>
                        ) : (
                          <span className="text-muted-foreground">$0.00</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Link href={`/households/${hh.id}`}>
                          <Button variant="ghost" size="icon-xs">
                            <MoreHorizontal />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
}
