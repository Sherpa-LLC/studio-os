"use client"

import Link from "next/link"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  subRequests,
  qualifiedSubCandidates,
  subHistory,
} from "@/data/staff"
import { formatDate, getInitials } from "@/lib/format"
import { DISCIPLINE_LABELS, DISCIPLINE_COLORS } from "@/lib/constants"
import { AlertCircle, ArrowLeft, UserCheck, Clock, XCircle } from "lucide-react"
import { toast } from "sonner"

const AVAILABILITY_BADGE: Record<
  "available" | "check" | "unavailable",
  { className: string; label: string }
> = {
  available: {
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    label: "Available",
  },
  check: {
    className: "bg-amber-50 text-amber-700 border-amber-200",
    label: "Check Schedule",
  },
  unavailable: {
    className: "bg-red-50 text-red-700 border-red-200",
    label: "Unavailable",
  },
}

const HISTORY_STATUS_BADGE: Record<string, string> = {
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-gray-100 text-gray-600 border-gray-200",
}

export default function SubManagementPage() {
  const activeRequest = subRequests.find((r) => r.status === "open")

  function handleRequestSub(name: string) {
    toast.success(`Sub request sent to ${name}`)
  }

  return (
    <>
      <Header title="Sub Management" />
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/staff">
            <Button variant="ghost" size="icon">
              <ArrowLeft />
            </Button>
          </Link>
          <PageHeader
            title="Sub Management"
            description="Manage substitute instructor requests and coverage"
          />
        </div>

        {/* Active Sub Request Alert */}
        {activeRequest && (
          <Card className="border-amber-200 bg-amber-50/50">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="size-5 text-amber-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-amber-900">
                    Active Sub Request
                  </p>
                  <p className="text-sm text-amber-800 mt-1">
                    {activeRequest.originalInstructor} needs coverage for{" "}
                    <span className="font-medium">
                      {activeRequest.className}
                    </span>{" "}
                    on {formatDate(activeRequest.date)} at{" "}
                    {activeRequest.time}.
                  </p>
                  <Badge
                    variant="outline"
                    className="mt-2 bg-amber-100 text-amber-800 border-amber-300"
                  >
                    Open
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Qualified Subs */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Qualified Substitutes</h2>
          <p className="text-sm text-muted-foreground">
            Instructors qualified in{" "}
            <span className="font-medium">Jazz</span> who can cover this class.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {qualifiedSubCandidates.map((candidate) => {
              const badge = AVAILABILITY_BADGE[candidate.availabilityMatch]
              const initials = candidate.name.split(" ")
              return (
                <Card key={candidate.staffId}>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {getInitials(
                            initials[0] ?? "",
                            initials[1] ?? ""
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">
                          {candidate.name}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {candidate.disciplines.map((d) => (
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
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={badge.className}>
                        {candidate.availabilityMatch === "available" && (
                          <UserCheck className="size-3 mr-1" />
                        )}
                        {candidate.availabilityMatch === "check" && (
                          <Clock className="size-3 mr-1" />
                        )}
                        {candidate.availabilityMatch === "unavailable" && (
                          <XCircle className="size-3 mr-1" />
                        )}
                        {badge.label}
                      </Badge>
                      <Button
                        size="sm"
                        variant={
                          candidate.availabilityMatch === "unavailable"
                            ? "outline"
                            : "default"
                        }
                        onClick={() => handleRequestSub(candidate.name)}
                      >
                        Request Sub
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <Separator />

        {/* Past Sub History */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Sub History</h2>
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Original Instructor</TableHead>
                  <TableHead>Substitute</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subHistory.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{formatDate(entry.date)}</TableCell>
                    <TableCell>
                      <Link
                        href={`/classes/${entry.classId}`}
                        className="font-medium text-foreground hover:underline"
                      >
                        {entry.className}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {entry.originalInstructor}
                    </TableCell>
                    <TableCell className="font-medium">
                      {entry.subName}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          HISTORY_STATUS_BADGE[entry.status] ??
                          "bg-gray-100 text-gray-600 border-gray-200"
                        }
                      >
                        {entry.status.charAt(0).toUpperCase() +
                          entry.status.slice(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  )
}
