"use client"

import Link from "next/link"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { recitals } from "@/data/recitals"
import { formatDate } from "@/lib/format"
import { Plus, MapPin, Calendar, Music } from "lucide-react"
import type { RecitalStatus } from "@/lib/types"

const STATUS_CONFIG: Record<RecitalStatus, { label: string; className: string }> = {
  planning: { label: "Planning", className: "bg-blue-50 text-blue-700 border-blue-200" },
  ordering: { label: "Ordering", className: "bg-amber-50 text-amber-700 border-amber-200" },
  rehearsals: { label: "Rehearsals", className: "bg-purple-50 text-purple-700 border-purple-200" },
  "show-week": { label: "Show Week", className: "bg-red-50 text-red-700 border-red-200" },
  completed: { label: "Completed", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
}

function getOrderProgress(routines: { costume: { orderStatus: string } }[]) {
  if (routines.length === 0) return 0
  const ordered = routines.filter(
    (r) => r.costume.orderStatus !== "not-ordered"
  ).length
  return Math.round((ordered / routines.length) * 100)
}

export default function RecitalsPage() {
  return (
    <>
      <Header title="Recitals" />
      <div className="flex-1 p-6 space-y-6">
        <PageHeader
          title="Recitals"
          description="Manage shows, costumes, and lineup"
        >
          <Link href="/recitals/new">
            <Button>
              <Plus data-icon="inline-start" />
              Create Recital
            </Button>
          </Link>
        </PageHeader>

        {/* Recital Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recitals.map((recital) => {
            const statusConfig = STATUS_CONFIG[recital.status]
            const orderProgress = getOrderProgress(recital.routines)

            return (
              <Link
                key={recital.id}
                href={`/recitals/${recital.id}`}
                className="group block"
              >
                <Card className="h-full transition-shadow group-hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="leading-snug line-clamp-2">
                        {recital.name}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className={`shrink-0 ${statusConfig.className}`}
                      >
                        {statusConfig.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Date */}
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Calendar className="size-3.5 shrink-0" />
                      <span>{formatDate(recital.date)}</span>
                    </div>

                    {/* Venue */}
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="size-3.5 shrink-0" />
                      <span>{recital.venue}</span>
                    </div>

                    {/* Routine count */}
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Music className="size-3.5 shrink-0" />
                      <span>
                        {recital.routines.length} routine
                        {recital.routines.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {/* Costume order progress */}
                    {recital.routines.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            Costume Orders
                          </span>
                          <span className="font-medium">{orderProgress}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              orderProgress === 100
                                ? "bg-emerald-500"
                                : orderProgress >= 50
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                            }`}
                            style={{ width: `${orderProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
