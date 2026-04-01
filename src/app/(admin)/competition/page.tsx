"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { teams } from "@/data/competition"
import { DISCIPLINE_LABELS, DISCIPLINE_COLORS, AGE_GROUP_LABELS } from "@/lib/constants"
import { Plus, Users, Trophy, User } from "lucide-react"
import type { Discipline } from "@/lib/types"
import { toast } from "sonner"

export default function CompetitionTeamsPage() {
  const [createOpen, setCreateOpen] = useState(false)

  function handleCreateTeam(e: React.FormEvent) {
    e.preventDefault()
    setCreateOpen(false)
    toast.success("Competition team created successfully")
  }

  return (
    <>
      <Header title="Competition Teams" />
      <div className="flex-1 p-6 space-y-6">
        <PageHeader
          title="Competition Teams"
          description="Manage travel and competition teams"
        >
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger
              render={
                <Button>
                  <Plus data-icon="inline-start" />
                  Create Team
                </Button>
              }
            />
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create Competition Team</DialogTitle>
                <DialogDescription>
                  Set up a new competition or travel team
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateTeam} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="team-name">Team Name</Label>
                  <Input
                    id="team-name"
                    placeholder="e.g. Senior Jazz Company"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Primary Discipline</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(DISCIPLINE_LABELS) as Discipline[]).map(
                          (d) => (
                            <SelectItem key={d} value={d}>
                              {DISCIPLINE_LABELS[d]}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Age Group</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {(
                          Object.keys(AGE_GROUP_LABELS) as Array<
                            keyof typeof AGE_GROUP_LABELS
                          >
                        ).map((ag) => (
                          <SelectItem key={ag} value={ag}>
                            {AGE_GROUP_LABELS[ag]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="team-coach">Head Coach</Label>
                  <Input
                    id="team-coach"
                    placeholder="e.g. Marcus Chen"
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="submit">Create Team</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </PageHeader>

        {/* Team count */}
        <p className="text-sm text-muted-foreground">
          {teams.length} team{teams.length !== 1 ? "s" : ""}
        </p>

        {/* Team Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => {
            const upcomingCount = team.competitions.length

            return (
              <Link
                key={team.id}
                href={`/competition/${team.id}`}
                className="group block"
              >
                <Card className="h-full transition-shadow group-hover:shadow-md overflow-hidden">
                  {/* Multi-discipline color bar */}
                  <div className="h-1 flex">
                    {team.disciplines.map((d) => (
                      <div
                        key={d}
                        className="flex-1"
                        style={{ backgroundColor: DISCIPLINE_COLORS[d] }}
                      />
                    ))}
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <CardTitle className="leading-snug line-clamp-2">
                          {team.name}
                        </CardTitle>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                          <User className="size-3.5 shrink-0" />
                          {team.headCoach}
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="shrink-0 bg-sky-50 text-sky-700 border-sky-200"
                      >
                        {AGE_GROUP_LABELS[team.ageGroup]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Discipline tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {team.disciplines.map((d) => (
                        <Badge
                          key={d}
                          variant="outline"
                          className="text-xs"
                          style={{
                            borderColor: DISCIPLINE_COLORS[d],
                            color: DISCIPLINE_COLORS[d],
                          }}
                        >
                          {DISCIPLINE_LABELS[d]}
                        </Badge>
                      ))}
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Users className="size-3.5" />
                        {team.studentCount} dancers
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Trophy className="size-3.5 text-amber-500" />
                        <span className="font-medium">
                          {upcomingCount} competition
                          {upcomingCount !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    {/* Season */}
                    <div className="flex items-center justify-between pt-1 border-t">
                      <span className="text-xs text-muted-foreground">
                        Season
                      </span>
                      <span className="text-xs font-medium">{team.season}</span>
                    </div>
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
