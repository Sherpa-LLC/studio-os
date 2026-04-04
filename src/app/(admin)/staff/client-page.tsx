"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatCurrency, getInitials } from "@/lib/format"
import { DISCIPLINE_LABELS, DISCIPLINE_COLORS } from "@/lib/constants"
import { Plus, MoreHorizontal } from "lucide-react"
import { toast } from "sonner"
import type { Discipline, StaffRole, StaffStatus, StaffMember } from "@/lib/types"

const ROLE_BADGE_CLASSES: Record<StaffRole, string> = {
  instructor: "bg-blue-50 text-blue-700 border-blue-200",
  assistant: "bg-purple-50 text-purple-700 border-purple-200",
  sub: "bg-amber-50 text-amber-700 border-amber-200",
  admin: "bg-gray-100 text-gray-600 border-gray-200",
}

const ROLE_LABELS: Record<StaffRole, string> = {
  instructor: "Instructor",
  assistant: "Assistant",
  sub: "Sub",
  admin: "Admin",
}

const STATUS_BADGE_CLASSES: Record<StaffStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "on-leave": "bg-amber-50 text-amber-700 border-amber-200",
  inactive: "bg-gray-100 text-gray-600 border-gray-200",
}

const STATUS_LABELS: Record<StaffStatus, string> = {
  active: "Active",
  "on-leave": "On Leave",
  inactive: "Inactive",
}

interface Props {
  staffMembers: StaffMember[]
}

export default function ClientPage({ staffMembers }: Props) {
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [disciplineFilter, setDisciplineFilter] = useState<string>("all")
  const [dialogOpen, setDialogOpen] = useState(false)

  const filtered = useMemo(() => {
    return staffMembers.filter((s) => {
      if (roleFilter !== "all" && s.role !== roleFilter) return false
      if (
        disciplineFilter !== "all" &&
        !s.disciplines.includes(disciplineFilter as Discipline)
      )
        return false
      return true
    })
  }, [roleFilter, disciplineFilter, staffMembers])

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
  } = usePagination(filtered)

  function handleAddStaff(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setDialogOpen(false)
    toast.success("Staff member added successfully")
  }

  return (
    <>
      <Header title="Staff & Instructors" />
      <div className="flex-1 p-6 space-y-6">
        <PageHeader
          title="Staff & Instructors"
          description="Manage your teaching staff, assistants, and subs"
        >
          <Button onClick={() => setDialogOpen(true)}>
            <Plus data-icon="inline-start" />
            Add Staff Member
          </Button>
        </PageHeader>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            value={roleFilter}
            onValueChange={(val) => setRoleFilter(val ?? "all")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="instructor">Instructor</SelectItem>
              <SelectItem value="assistant">Assistant</SelectItem>
              <SelectItem value="sub">Sub</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={disciplineFilter}
            onValueChange={(val) => setDisciplineFilter(val ?? "all")}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Disciplines" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Disciplines</SelectItem>
              {Object.entries(DISCIPLINE_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          {filtered.length} staff member{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Table */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Disciplines</TableHead>
                <TableHead className="text-center">Classes</TableHead>
                <TableHead className="text-right">Weekly Hrs</TableHead>
                <TableHead className="text-right">Pay Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-muted-foreground py-8"
                  >
                    No staff members found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedItems.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell>
                      <Link
                        href={`/staff/${staff.id}`}
                        className="flex items-center gap-2.5"
                      >
                        <Avatar size="sm">
                          <AvatarFallback className="text-[10px]">
                            {getInitials(staff.firstName, staff.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground hover:underline">
                          {staff.firstName} {staff.lastName}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={ROLE_BADGE_CLASSES[staff.role]}
                      >
                        {ROLE_LABELS[staff.role]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {staff.disciplines.map((d) => (
                          <Badge
                            key={d}
                            variant="outline"
                            className="text-[10px] px-1.5 py-0"
                            style={{
                              borderColor: DISCIPLINE_COLORS[d],
                              color: DISCIPLINE_COLORS[d],
                            }}
                          >
                            {DISCIPLINE_LABELS[d]}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {staff.classIds.length}
                    </TableCell>
                    <TableCell className="text-right">
                      {staff.weeklyHours}h
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(staff.payRate)}/
                      {staff.payType === "per-class" ? "class" : "hr"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={STATUS_BADGE_CLASSES[staff.status]}
                      >
                        {STATUS_LABELS[staff.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link href={`/staff/${staff.id}`}>
                        <Button variant="ghost" size="icon-xs">
                          <MoreHorizontal />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
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
          />
        </div>
      </div>

      {/* Add Staff Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Staff Member</DialogTitle>
            <DialogDescription>
              Enter details for the new staff member.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddStaff} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="staff-first">First Name</Label>
                <Input id="staff-first" placeholder="First name" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="staff-last">Last Name</Label>
                <Input id="staff-last" placeholder="Last name" required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="staff-email">Email</Label>
              <Input id="staff-email" type="email" placeholder="email@example.com" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="staff-phone">Phone</Label>
              <Input id="staff-phone" type="tel" placeholder="(555) 123-4567" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Select defaultValue="instructor">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instructor">Instructor</SelectItem>
                    <SelectItem value="assistant">Assistant</SelectItem>
                    <SelectItem value="sub">Sub</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="staff-rate">Pay Rate ($/hr)</Label>
                <Input id="staff-rate" type="number" placeholder="45" required />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Staff Member</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
