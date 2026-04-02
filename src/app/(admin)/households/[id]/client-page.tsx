"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  formatCurrency,
  formatDate,
  formatPhone,
  formatAge,
  getInitials,
} from "@/lib/format"
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Clock,
  BookOpen,
  Pencil,
  Save,
  X,
  UserPlus,
  Trash2,
  Cake,
  Calendar,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Guardian, Household, Student, Class, Invoice } from "@/lib/types"

const STATUS_BADGE_CLASSES: Record<Household["status"], string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  inactive: "bg-amber-50 text-amber-700 border-amber-200",
  archived: "bg-gray-100 text-gray-600 border-gray-200",
}

const ENROLLMENT_BADGE_CLASSES: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  waitlisted: "bg-amber-50 text-amber-700 border-amber-200",
  trial: "bg-sky-50 text-sky-700 border-sky-200",
  withdrawn: "bg-gray-100 text-gray-600 border-gray-200",
  graduated: "bg-violet-50 text-violet-700 border-violet-200",
}

const PAYMENT_BADGE_CLASSES: Record<string, string> = {
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  overdue: "bg-red-50 text-red-700 border-red-200",
  failed: "bg-red-50 text-red-700 border-red-200",
  refunded: "bg-gray-100 text-gray-600 border-gray-200",
}

const CARD_TYPE_LABELS: Record<string, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
}

const SAMPLE_ACTIVITY = [
  { id: "act-1", date: "2026-03-25", description: "March invoice payment received", type: "payment" },
  { id: "act-2", date: "2026-03-15", description: "Attendance recorded for all enrolled classes", type: "attendance" },
  { id: "act-3", date: "2026-03-01", description: "March invoice generated", type: "billing" },
  { id: "act-4", date: "2026-02-20", description: "Email communication sent: Spring Recital Information", type: "communication" },
  { id: "act-5", date: "2026-02-14", description: "February invoice payment received", type: "payment" },
  { id: "act-6", date: "2026-02-01", description: "February invoice generated", type: "billing" },
]

interface HouseholdDetailPageProps {
  household: Household | undefined
  students: Student[]
  classes: Class[]
  invoices: Invoice[]
}

export default function HouseholdDetailPage({
  household,
  students: householdStudents,
  classes,
  invoices,
}: HouseholdDetailPageProps) {
  const id = household?.id ?? ""

  const householdInvoices = useMemo(
    () =>
      [...invoices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [invoices],
  )

  // ── Household edit state ──────────────────────────────────────────────
  const [editingHousehold, setEditingHousehold] = useState(false)
  const [editGuardians, setEditGuardians] = useState<Guardian[]>([])
  const [editAddress, setEditAddress] = useState({ street: "", city: "", state: "", zip: "" })
  const [editStatus, setEditStatus] = useState<Household["status"]>("active")

  // ── Child edit state ──────────────────────────────────────────────────
  const [editingChildId, setEditingChildId] = useState<string | null>(null)
  const [editChild, setEditChild] = useState<{
    firstName: string
    lastName: string
    dateOfBirth: string
    gender: string
    medicalNotes: string
  }>({ firstName: "", lastName: "", dateOfBirth: "", gender: "", medicalNotes: "" })

  if (!household) {
    return (
      <>
        <Header title="Household Not Found" />
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <p className="text-sm text-muted-foreground">
            No household found with ID &quot;{id}&quot;.
          </p>
          <Link href="/households">
            <Button variant="outline">
              <ArrowLeft data-icon="inline-start" />
              Back to Households
            </Button>
          </Link>
        </div>
      </>
    )
  }

  function startEditingHousehold() {
    if (!household) return
    setEditGuardians(household.guardians.map((g) => ({ ...g })))
    setEditAddress({ ...household.address })
    setEditStatus(household.status)
    setEditingHousehold(true)
  }

  function cancelEditingHousehold() {
    setEditingHousehold(false)
  }

  function saveHousehold() {
    // Prototype: just close edit mode
    setEditingHousehold(false)
  }

  function updateGuardian(index: number, field: keyof Guardian, value: string) {
    setEditGuardians((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  function addGuardian() {
    setEditGuardians((prev) => [
      ...prev,
      { id: `g-new-${Date.now()}`, firstName: "", lastName: "", email: "", phone: "", relationship: "guardian" as const },
    ])
  }

  function removeGuardian(index: number) {
    if (editGuardians.length <= 1) return
    setEditGuardians((prev) => prev.filter((_, i) => i !== index))
  }

  function startEditingChild(student: Student) {
    setEditingChildId(student.id)
    setEditChild({
      firstName: student.firstName,
      lastName: student.lastName,
      dateOfBirth: student.dateOfBirth,
      gender: student.gender,
      medicalNotes: student.medicalNotes ?? "",
    })
  }

  function cancelEditingChild() {
    setEditingChildId(null)
  }

  function saveChild() {
    // Prototype: just close edit mode
    setEditingChildId(null)
  }

  const primaryGuardian = household.guardians[0]
  const householdName = primaryGuardian ? `${primaryGuardian.lastName} Family` : "Unknown"

  // Which data to display — edited or original
  const displayGuardians = editingHousehold ? editGuardians : household.guardians
  const displayAddress = editingHousehold ? editAddress : household.address
  const displayStatus = editingHousehold ? editStatus : household.status

  return (
    <>
      <Header title={householdName} />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link href="/households">
              <Button variant="ghost" size="icon">
                <ArrowLeft />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">{householdName}</h1>
                {!editingHousehold ? (
                  <Badge variant="outline" className={STATUS_BADGE_CLASSES[household.status]}>
                    {household.status.charAt(0).toUpperCase() + household.status.slice(1)}
                  </Badge>
                ) : (
                  <Select value={editStatus} onValueChange={(v) => setEditStatus(v as Household["status"])}>
                    <SelectTrigger className="w-32 h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                Member since {formatDate(household.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!editingHousehold ? (
              <Button variant="outline" onClick={startEditingHousehold}>
                <Pencil className="size-3.5 mr-1.5" /> Edit Household
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={cancelEditingHousehold}>
                  <X className="size-3.5 mr-1.5" /> Cancel
                </Button>
                <Button onClick={saveHousehold}>
                  <Save className="size-3.5 mr-1.5" /> Save Changes
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Guardians Card */}
          <Card size="sm" className={cn(editingHousehold && "ring-2 ring-primary/20")}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Guardians</CardTitle>
                {editingHousehold && (
                  <Button type="button" variant="outline" size="sm" className="h-6 text-xs px-2" onClick={addGuardian}>
                    <UserPlus className="size-3 mr-1" /> Add
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {displayGuardians.map((guardian, idx) => (
                <div key={guardian.id} className={cn("space-y-1", editingHousehold && "rounded-lg border p-3 bg-muted/30")}>
                  {!editingHousehold ? (
                    <>
                      <p className="font-medium text-sm">
                        {guardian.firstName} {guardian.lastName}
                        <span className="text-muted-foreground font-normal ml-1.5 capitalize">
                          ({guardian.relationship})
                        </span>
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Mail className="size-3" />
                        {guardian.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Phone className="size-3" />
                        {formatPhone(guardian.phone)}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground">Guardian {idx + 1}</span>
                        {editGuardians.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeGuardian(idx)}
                            className="p-0.5 rounded hover:bg-red-50 text-red-500 transition-colors"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <Input
                          value={guardian.firstName}
                          onChange={(e) => updateGuardian(idx, "firstName", e.target.value)}
                          placeholder="First name"
                          className="text-xs h-7"
                        />
                        <Input
                          value={guardian.lastName}
                          onChange={(e) => updateGuardian(idx, "lastName", e.target.value)}
                          placeholder="Last name"
                          className="text-xs h-7"
                        />
                        <Input
                          value={guardian.email}
                          onChange={(e) => updateGuardian(idx, "email", e.target.value)}
                          placeholder="Email"
                          type="email"
                          className="text-xs h-7"
                        />
                        <Input
                          value={guardian.phone}
                          onChange={(e) => updateGuardian(idx, "phone", e.target.value)}
                          placeholder="Phone"
                          type="tel"
                          className="text-xs h-7"
                        />
                      </div>
                      <Select
                        value={guardian.relationship}
                        onValueChange={(v) => v && updateGuardian(idx, "relationship", v)}
                      >
                        <SelectTrigger className="text-xs h-7 mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mother">Mother</SelectItem>
                          <SelectItem value="father">Father</SelectItem>
                          <SelectItem value="guardian">Guardian</SelectItem>
                          <SelectItem value="grandparent">Grandparent</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Address Card */}
          <Card size="sm" className={cn(editingHousehold && "ring-2 ring-primary/20")}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Address</CardTitle>
            </CardHeader>
            <CardContent>
              {!editingHousehold ? (
                <div className="flex items-start gap-2">
                  <MapPin className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="text-sm">
                    <p>{household.address.street}</p>
                    <p>{household.address.city}, {household.address.state} {household.address.zip}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Street</Label>
                    <Input
                      value={editAddress.street}
                      onChange={(e) => setEditAddress((a) => ({ ...a, street: e.target.value }))}
                      className="text-xs h-7"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <div className="space-y-1">
                      <Label className="text-xs">City</Label>
                      <Input
                        value={editAddress.city}
                        onChange={(e) => setEditAddress((a) => ({ ...a, city: e.target.value }))}
                        className="text-xs h-7"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">State</Label>
                      <Input
                        value={editAddress.state}
                        onChange={(e) => setEditAddress((a) => ({ ...a, state: e.target.value }))}
                        className="text-xs h-7"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">ZIP</Label>
                      <Input
                        value={editAddress.zip}
                        onChange={(e) => setEditAddress((a) => ({ ...a, zip: e.target.value }))}
                        className="text-xs h-7"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment & Balance Card */}
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Payment & Balance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {household.paymentMethod ? (
                <div className="flex items-center gap-2">
                  <CreditCard className="size-4 text-muted-foreground" />
                  <span className="text-sm">
                    {CARD_TYPE_LABELS[household.paymentMethod.type]} ending in {household.paymentMethod.last4}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Exp {household.paymentMethod.expiry}
                  </span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No payment method on file</p>
              )}
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Balance</span>
                <span className={cn(
                  "text-sm font-semibold",
                  household.balance > 0 ? "text-red-600" : household.balance < 0 ? "text-emerald-600" : "text-muted-foreground",
                )}>
                  {household.balance > 0
                    ? formatCurrency(household.balance)
                    : household.balance < 0
                      ? `${formatCurrency(Math.abs(household.balance))} credit`
                      : "$0.00"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="children">
          <TabsList>
            <TabsTrigger value="children">Children</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Children Tab */}
          <TabsContent value="children">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {householdStudents.length === 0 ? (
                <p className="text-sm text-muted-foreground col-span-2">
                  No students registered in this household.
                </p>
              ) : (
                householdStudents.map((student) => {
                  const enrolledClasses = classes.filter((c) => student.enrolledClassIds.includes(c.id))
                  const isEditingThis = editingChildId === student.id
                  const calculatedAge = formatAge(student.dateOfBirth)

                  return (
                    <Card key={student.id} className={cn(isEditingThis && "ring-2 ring-primary/20")}>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <Avatar size="lg">
                            <AvatarFallback>
                              {getInitials(
                                isEditingThis ? editChild.firstName || student.firstName : student.firstName,
                                isEditingThis ? editChild.lastName || student.lastName : student.lastName,
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            {!isEditingThis ? (
                              <>
                                <div className="flex items-center gap-2">
                                  <CardTitle>{student.firstName} {student.lastName}</CardTitle>
                                  <Badge variant="outline" className={ENROLLMENT_BADGE_CLASSES[student.enrollmentStatus]}>
                                    {student.enrollmentStatus.charAt(0).toUpperCase() + student.enrollmentStatus.slice(1)}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-3 mt-0.5">
                                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Cake className="size-3" />
                                    Age {calculatedAge}
                                  </span>
                                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Calendar className="size-3" />
                                    {formatDate(student.dateOfBirth)}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-1.5">
                                  <Input
                                    value={editChild.firstName}
                                    onChange={(e) => setEditChild((c) => ({ ...c, firstName: e.target.value }))}
                                    placeholder="First name"
                                    className="text-sm h-8"
                                  />
                                  <Input
                                    value={editChild.lastName}
                                    onChange={(e) => setEditChild((c) => ({ ...c, lastName: e.target.value }))}
                                    placeholder="Last name"
                                    className="text-sm h-8"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-1.5">
                                  <div className="space-y-0.5">
                                    <Label className="text-xs">Date of Birth</Label>
                                    <Input
                                      type="date"
                                      value={editChild.dateOfBirth}
                                      onChange={(e) => setEditChild((c) => ({ ...c, dateOfBirth: e.target.value }))}
                                      className="text-xs h-7"
                                    />
                                  </div>
                                  <div className="space-y-0.5">
                                    <Label className="text-xs">Gender</Label>
                                    <Select
                                      value={editChild.gender}
                                      onValueChange={(v) => v && setEditChild((c) => ({ ...c, gender: v }))}
                                    >
                                      <SelectTrigger className="text-xs h-7">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="space-y-0.5">
                                  <Label className="text-xs">Medical Notes</Label>
                                  <Input
                                    value={editChild.medicalNotes}
                                    onChange={(e) => setEditChild((c) => ({ ...c, medicalNotes: e.target.value }))}
                                    placeholder="Allergies, conditions, etc."
                                    className="text-xs h-7"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                          {/* Edit/Save/Cancel buttons */}
                          <div className="shrink-0">
                            {!isEditingThis ? (
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => startEditingChild(student)}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <Pencil className="size-3.5" />
                              </Button>
                            ) : (
                              <div className="flex flex-col gap-1">
                                <Button size="icon-sm" onClick={saveChild}>
                                  <Save className="size-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon-sm" onClick={cancelEditingChild}>
                                  <X className="size-3.5" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {student.medicalNotes && !isEditingThis && (
                            <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2.5 py-1.5 mb-2">
                              <strong>Medical:</strong> {student.medicalNotes}
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                            <BookOpen className="size-3.5" />
                            Enrolled Classes ({enrolledClasses.length})
                          </div>
                          {enrolledClasses.length === 0 ? (
                            <p className="text-sm text-muted-foreground pl-5">
                              Not currently enrolled in any classes.
                            </p>
                          ) : (
                            <ul className="space-y-1 pl-5">
                              {enrolledClasses.map((cls) => (
                                <li key={cls.id} className="text-sm">
                                  <Link href={`/classes/${cls.id}`} className="text-foreground hover:underline">
                                    {cls.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <div className="mt-4 rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Paid Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {householdInvoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No invoices found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    householdInvoices.map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell className="font-medium">{inv.id.toUpperCase()}</TableCell>
                        <TableCell>{formatDate(inv.date)}</TableCell>
                        <TableCell>{formatDate(inv.dueDate)}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(inv.total)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={PAYMENT_BADGE_CLASSES[inv.status]}>
                            {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {inv.paidDate ? formatDate(inv.paidDate) : "\u2014"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <div className="mt-4 space-y-1">
              {SAMPLE_ACTIVITY.map((event) => (
                <div key={event.id} className="flex items-start gap-3 rounded-lg px-3 py-2.5 hover:bg-muted/50">
                  <div className="mt-0.5">
                    <Clock className="size-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{event.description}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{formatDate(event.date)}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">{event.type}</Badge>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
