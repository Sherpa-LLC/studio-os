"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
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
import type { CompetitionTeam, CompetitionEvent } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/format"
import { DISCIPLINE_LABELS, DISCIPLINE_COLORS } from "@/lib/constants"
import {
  ArrowLeft,
  Plus,
  UserPlus,
  Trophy,
  DollarSign,
  MessageSquare,
  MapPin,
  Calendar,
  Clock,
  Send,
} from "lucide-react"
import { toast } from "sonner"

// ── Badge style maps ─────────────────────────────────────────────────────────

const FEE_STATUS_CLASSES: Record<string, string> = {
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  overdue: "bg-red-50 text-red-700 border-red-200",
}

const WAIVER_STATUS_CLASSES: Record<string, string> = {
  signed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "not-signed": "bg-red-50 text-red-700 border-red-200",
}

const COMPETITION_STATUS_CLASSES: Record<string, string> = {
  registered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  upcoming: "bg-sky-50 text-sky-700 border-sky-200",
}

// ── Page component ───────────────────────────────────────────────────────────

interface CompetitionDetailPageProps {
  team: CompetitionTeam | undefined
}

export default function CompetitionDetailPage({
  team,
}: CompetitionDetailPageProps) {

  const [addMemberOpen, setAddMemberOpen] = useState(false)
  const [registerCompOpen, setRegisterCompOpen] = useState(false)
  const [selectedComp, setSelectedComp] = useState<CompetitionEvent | null>(null)
  const [compSheetOpen, setCompSheetOpen] = useState(false)

  if (!team) {
    return (
      <>
        <Header title="Team Not Found" />
        <div className="flex-1 p-6 space-y-6">
          <PageHeader title="Team Not Found" />
          <p className="text-sm text-muted-foreground">
            The requested team could not be found.
          </p>
          <Link href="/competition">
            <Button variant="outline">
              <ArrowLeft data-icon="inline-start" />
              Back to Competition Teams
            </Button>
          </Link>
        </div>
      </>
    )
  }

  function handleAddMember(e: React.FormEvent) {
    e.preventDefault()
    setAddMemberOpen(false)
    toast.success("Student added to team roster")
  }

  function handleRegisterComp(e: React.FormEvent) {
    e.preventDefault()
    setRegisterCompOpen(false)
    toast.success("Registered for competition")
  }

  function openCompDetail(comp: CompetitionEvent) {
    setSelectedComp(comp)
    setCompSheetOpen(true)
  }

  // ── Per-competition cost breakdown ─────────────────────────────────────
  const competitionCosts = team.competitions.map((comp) => {
    const total = comp.entryFees + comp.travelCost + comp.hotelCost
    const perStudent = team.studentCount > 0 ? total / team.studentCount : 0
    return { ...comp, total, perStudent }
  })

  return (
    <>
      <Header title={team.name} />
      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link href="/competition">
              <Button variant="ghost" size="icon">
                <ArrowLeft />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight">
                  {team.name}
                </h1>
                {team.disciplines.map((d) => (
                  <Badge
                    key={d}
                    variant="outline"
                    style={{
                      borderColor: DISCIPLINE_COLORS[d],
                      color: DISCIPLINE_COLORS[d],
                    }}
                  >
                    {DISCIPLINE_LABELS[d]}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                Head Coach: {team.headCoach} &middot; Season {team.season}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="roster">
          <TabsList>
            <TabsTrigger value="roster">Roster</TabsTrigger>
            <TabsTrigger value="competitions">Competitions</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
          </TabsList>

          {/* ─── Roster Tab ─────────────────────────────────────────────── */}
          <TabsContent value="roster">
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {team.roster.length} team member
                  {team.roster.length !== 1 ? "s" : ""}
                </p>
                <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
                  <DialogTrigger
                    render={
                      <Button size="sm">
                        <UserPlus data-icon="inline-start" />
                        Add to Team
                      </Button>
                    }
                  />
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add Student to Team</DialogTitle>
                      <DialogDescription>
                        Select a student to add to {team.name}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddMember} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="student-name">Student Name</Label>
                        <Input
                          id="student-name"
                          placeholder="Search students..."
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="parent-name">Parent/Guardian Name</Label>
                        <Input
                          id="parent-name"
                          placeholder="Parent name"
                          required
                        />
                      </div>
                      <DialogFooter>
                        <Button type="submit">Add to Team</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="rounded-lg border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Parent</TableHead>
                      <TableHead>Team Fee</TableHead>
                      <TableHead>Waiver</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {team.roster.map((member) => (
                      <TableRow key={member.studentId}>
                        <TableCell className="font-medium">
                          {member.studentName}
                        </TableCell>
                        <TableCell>{member.age}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {member.parentName}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={FEE_STATUS_CLASSES[member.feeStatus]}
                          >
                            {member.feeStatus.charAt(0).toUpperCase() +
                              member.feeStatus.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              WAIVER_STATUS_CLASSES[member.waiverStatus]
                            }
                          >
                            {member.waiverStatus === "signed"
                              ? "Signed"
                              : "Not Signed"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          {/* ─── Competitions Tab ───────────────────────────────────────── */}
          <TabsContent value="competitions">
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {team.competitions.length} competition
                  {team.competitions.length !== 1 ? "s" : ""}
                </p>
                <Dialog
                  open={registerCompOpen}
                  onOpenChange={setRegisterCompOpen}
                >
                  <DialogTrigger
                    render={
                      <Button size="sm">
                        <Plus data-icon="inline-start" />
                        Register for Competition
                      </Button>
                    }
                  />
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Register for Competition</DialogTitle>
                      <DialogDescription>
                        Add a new competition for {team.name}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleRegisterComp} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="comp-name">Competition Name</Label>
                        <Input
                          id="comp-name"
                          placeholder="e.g. Starbound Nationals"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="comp-date">Date</Label>
                          <Input id="comp-date" type="date" required />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="comp-deadline">Entry Deadline</Label>
                          <Input id="comp-deadline" type="date" required />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="comp-location">Location</Label>
                        <Input
                          id="comp-location"
                          placeholder="e.g. Atlanta, GA"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="comp-entry-fee">Entry Fee ($)</Label>
                        <Input
                          id="comp-entry-fee"
                          type="number"
                          min="0"
                          step="50"
                          placeholder="900"
                          required
                        />
                      </div>
                      <DialogFooter>
                        <Button type="submit">Register</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="rounded-lg border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Competition</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {team.competitions.map((comp) => (
                      <TableRow
                        key={comp.id}
                        className="cursor-pointer"
                        onClick={() => openCompDetail(comp)}
                      >
                        <TableCell className="font-medium">
                          {comp.name}
                        </TableCell>
                        <TableCell>{formatDate(comp.date)}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {comp.location}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(comp.entryDeadline)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              COMPETITION_STATUS_CLASSES[comp.status]
                            }
                          >
                            {comp.status.charAt(0).toUpperCase() +
                              comp.status.slice(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          {/* ─── Financials Tab ─────────────────────────────────────────── */}
          <TabsContent value="financials">
            <div className="mt-4 space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card size="sm">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <DollarSign className="size-4" />
                      Total Team Fees Collected
                    </div>
                    <p className="font-semibold text-lg text-emerald-600">
                      {formatCurrency(team.financials.totalFeesCollected)}
                    </p>
                  </CardContent>
                </Card>
                <Card size="sm">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Trophy className="size-4" />
                      Total Competition Costs
                    </div>
                    <p className="font-semibold text-lg text-red-600">
                      {formatCurrency(team.financials.totalCompetitionCosts)}
                    </p>
                  </CardContent>
                </Card>
                <Card size="sm">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <DollarSign className="size-4" />
                      Net Position
                    </div>
                    <p
                      className={`font-semibold text-lg ${
                        team.financials.netPosition >= 0
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {team.financials.netPosition >= 0 ? "+" : ""}
                      {formatCurrency(team.financials.netPosition)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Per-competition cost breakdown */}
              <div>
                <h3 className="text-sm font-medium mb-3">
                  Competition Cost Breakdown
                </h3>
                <div className="rounded-lg border bg-card">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Competition</TableHead>
                        <TableHead className="text-right">Entry Fees</TableHead>
                        <TableHead className="text-right">Travel</TableHead>
                        <TableHead className="text-right">Hotel</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">
                          Per Student
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {competitionCosts.map((comp) => (
                        <TableRow key={comp.id}>
                          <TableCell className="font-medium">
                            {comp.name}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(comp.entryFees)}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {comp.travelCost > 0
                              ? formatCurrency(comp.travelCost)
                              : "\u2014"}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {comp.hotelCost > 0
                              ? formatCurrency(comp.hotelCost)
                              : "\u2014"}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(comp.total)}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {formatCurrency(comp.perStudent)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Per-student fee breakdown */}
              <div>
                <h3 className="text-sm font-medium mb-3">
                  Student Fee Breakdown
                </h3>
                <div className="rounded-lg border bg-card">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead className="text-right">Team Fee</TableHead>
                        <TableHead className="text-right">
                          Competition Fees
                        </TableHead>
                        <TableHead className="text-right">
                          Costume Fees
                        </TableHead>
                        <TableHead className="text-right">
                          Total Owed
                        </TableHead>
                        <TableHead className="text-right">
                          Total Paid
                        </TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {team.roster.map((member) => {
                        const balance = member.totalOwed - member.totalPaid
                        return (
                          <TableRow
                            key={member.studentId}
                            className={balance > 0 ? "bg-red-50/50" : ""}
                          >
                            <TableCell className="font-medium">
                              {member.studentName}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(member.teamFee)}
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground">
                              {formatCurrency(member.competitionFees)}
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground">
                              {formatCurrency(member.costumeFees)}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(member.totalOwed)}
                            </TableCell>
                            <TableCell className="text-right text-emerald-600">
                              {formatCurrency(member.totalPaid)}
                            </TableCell>
                            <TableCell
                              className={`text-right font-semibold ${
                                balance > 0
                                  ? "text-red-600"
                                  : "text-emerald-600"
                              }`}
                            >
                              {balance > 0
                                ? formatCurrency(balance)
                                : "$0.00"}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ─── Communication Tab ──────────────────────────────────────── */}
          <TabsContent value="communication">
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {team.messages.length} message
                  {team.messages.length !== 1 ? "s" : ""}
                </p>
                <Button
                  size="sm"
                  onClick={() => toast("Message compose opened")}
                >
                  <Send data-icon="inline-start" />
                  Message Team
                </Button>
              </div>

              <div className="space-y-1">
                {team.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="flex items-start gap-3 rounded-lg border px-4 py-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="mt-0.5">
                      <MessageSquare className="size-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{msg.subject}</p>
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                        {msg.body}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(msg.sentAt.split("T")[0])}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Sent by {msg.sentBy}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* ─── Competition Detail Sheet ────────────────────────────────────── */}
      <Sheet open={compSheetOpen} onOpenChange={setCompSheetOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedComp?.name ?? "Competition"}</SheetTitle>
            <SheetDescription>
              Competition details and logistics
            </SheetDescription>
          </SheetHeader>
          {selectedComp && (
            <div className="px-4 space-y-5 mt-2">
              {/* Status */}
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={
                    COMPETITION_STATUS_CLASSES[selectedComp.status]
                  }
                >
                  {selectedComp.status.charAt(0).toUpperCase() +
                    selectedComp.status.slice(1)}
                </Badge>
              </div>

              {/* Date & Location */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="size-4 text-muted-foreground" />
                  <span>{formatDate(selectedComp.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="size-4 text-muted-foreground" />
                  <span>{selectedComp.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="size-4 text-muted-foreground" />
                  <span>
                    Entry deadline: {formatDate(selectedComp.entryDeadline)}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Registered Routines */}
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Registered Routines
                </p>
                <ul className="space-y-1">
                  {selectedComp.routines.map((routine, idx) => (
                    <li
                      key={idx}
                      className="text-sm flex items-center gap-2"
                    >
                      <div className="size-1.5 rounded-full bg-primary" />
                      {routine}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Fees */}
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Fees & Costs
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Entry Fees</span>
                    <span className="font-medium">
                      {formatCurrency(selectedComp.entryFees)}
                    </span>
                  </div>
                  {selectedComp.travelCost > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Travel</span>
                      <span className="font-medium">
                        {formatCurrency(selectedComp.travelCost)}
                      </span>
                    </div>
                  )}
                  {selectedComp.hotelCost > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Hotel</span>
                      <span className="font-medium">
                        {formatCurrency(selectedComp.hotelCost)}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Total</span>
                    <span className="font-semibold">
                      {formatCurrency(
                        selectedComp.entryFees +
                          selectedComp.travelCost +
                          selectedComp.hotelCost
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Logistics */}
              {selectedComp.logistics && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                      Travel Logistics
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedComp.logistics}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
