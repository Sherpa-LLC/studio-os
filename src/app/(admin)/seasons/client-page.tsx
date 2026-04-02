"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
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
import { formatDate } from "@/lib/format"
import { Plus, ArrowRightLeft } from "lucide-react"
import { toast } from "sonner"
import type { Season } from "@/lib/types"

// ── Badge styling per season status ─────────────────────────────────────────

const STATUS_BADGE_CLASSES: Record<Season["status"], string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  upcoming: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-gray-100 text-gray-600 border-gray-200",
}

const STATUS_LABELS: Record<Season["status"], string> = {
  active: "Active",
  upcoming: "Upcoming",
  completed: "Completed",
}

// ── Pre-staged display data (prototype mock) ────────────────────────────────

interface SeasonRow {
  id: string
  name: string
  startDate: string
  endDate: string
  status: Season["status"]
  classCount: number
  studentCount: number
  canRollover: boolean
}

const seasonRows: SeasonRow[] = [
  {
    id: "season-spring-2026",
    name: "Spring 2026",
    startDate: "2026-01-06",
    endDate: "2026-05-14",
    status: "active",
    classCount: 83,
    studentCount: 1024,
    canRollover: true,
  },
  {
    id: "season-summer-2026",
    name: "Summer 2026",
    startDate: "2026-06-02",
    endDate: "2026-07-25",
    status: "upcoming",
    classCount: 0,
    studentCount: 0,
    canRollover: false,
  },
  {
    id: "season-fall-2025",
    name: "Fall 2025",
    startDate: "2025-08-18",
    endDate: "2025-12-19",
    status: "completed",
    classCount: 78,
    studentCount: 998,
    canRollover: false,
  },
]

interface Props {
  seasons: Season[]
}

export default function ClientPage({ seasons }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false)

  function handleCreateSeason() {
    setDialogOpen(false)
    toast.success("Season created successfully")
  }

  return (
    <>
      <Header title="Seasons" />
      <div className="flex-1 p-6 space-y-6">
        <PageHeader
          title="Seasons"
          description="Manage studio seasons, terms, and rollover"
        >
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger
              render={
                <Button>
                  <Plus data-icon="inline-start" />
                  Create Season
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Season</DialogTitle>
                <DialogDescription>
                  Add a new season to the schedule. Classes and enrollments can
                  be configured after creation.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="season-name">Season Name</Label>
                  <Input
                    id="season-name"
                    placeholder="e.g. Fall 2026"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input id="start-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input id="end-date" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billing-rate">Billing Rate ($/hr)</Label>
                  <Input
                    id="billing-rate"
                    type="number"
                    placeholder="95"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateSeason}>Create Season</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PageHeader>

        {/* Table */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Season</TableHead>
                <TableHead>Date Range</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Classes</TableHead>
                <TableHead className="text-center">Students</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {seasonRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(row.startDate)} &ndash;{" "}
                    {formatDate(row.endDate)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={STATUS_BADGE_CLASSES[row.status]}
                    >
                      {STATUS_LABELS[row.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {row.classCount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    {row.studentCount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.canRollover ? (
                      <Link href="/seasons/rollover">
                        <Button variant="outline" size="sm">
                          <ArrowRightLeft className="size-4 mr-1.5" />
                          Start Rollover
                        </Button>
                      </Link>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        &mdash;
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
}
