"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { trialSlots } from "@/data/trial-slots"
import { formatTime } from "@/lib/format"
import { DISCIPLINE_LABELS } from "@/lib/constants"
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import type { TrialSlot, Discipline } from "@/lib/types"

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatDateDisplay(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
}

function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
}

function getUniqueDates(): string[] {
  return [...new Set(trialSlots.map((s) => s.date))].sort()
}

const DISCIPLINE_BADGE_COLORS: Partial<Record<Discipline, string>> = {
  ballet: "bg-pink-50 text-pink-700 border-pink-200",
  jazz: "bg-violet-50 text-violet-700 border-violet-200",
  tap: "bg-amber-50 text-amber-700 border-amber-200",
  contemporary: "bg-cyan-50 text-cyan-700 border-cyan-200",
  "hip-hop": "bg-red-50 text-red-700 border-red-200",
  lyrical: "bg-indigo-50 text-indigo-700 border-indigo-200",
  acro: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "musical-theatre": "bg-orange-50 text-orange-700 border-orange-200",
  pointe: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
}

// ── Component ───────────────────────────────────────────────────────────────

type Step = "select" | "form" | "confirmed"

export default function TrialBookingPage() {
  const [step, setStep] = useState<Step>("select")
  const [selectedDate, setSelectedDate] = useState<string>(getUniqueDates()[0] ?? "")
  const [selectedSlot, setSelectedSlot] = useState<TrialSlot | null>(null)

  const dates = getUniqueDates()
  const dateIndex = dates.indexOf(selectedDate)

  const slotsForDate = useMemo(
    () => trialSlots.filter((s) => s.date === selectedDate && s.availableSpots > 0),
    [selectedDate]
  )

  function handleSelectSlot(slot: TrialSlot) {
    setSelectedSlot(slot)
    setStep("form")
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStep("confirmed")
  }

  function handleBack() {
    if (step === "form") {
      setStep("select")
      setSelectedSlot(null)
    }
  }

  // ── Confirmation screen ──────────────────
  if (step === "confirmed" && selectedSlot) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle className="size-8 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Trial Class Booked!</h1>
            <p className="text-muted-foreground mt-1">
              You&apos;re all set. We can&apos;t wait to meet your dancer!
            </p>
          </div>
          <Card>
            <CardContent className="space-y-3 text-left">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="size-4 text-muted-foreground" />
                <span className="font-medium">{formatDateDisplay(selectedSlot.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="size-4 text-muted-foreground" />
                <span>{formatTime(selectedSlot.startTime)} – {formatTime(selectedSlot.endTime)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="size-4 text-muted-foreground" />
                <span>{selectedSlot.room}</span>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-semibold">{selectedSlot.className}</p>
                <p className="text-xs text-muted-foreground">with {selectedSlot.instructorName}</p>
              </div>
            </CardContent>
          </Card>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Please arrive 10 minutes early.</p>
            <p>Wear comfortable clothing and bring a water bottle.</p>
            <p>A confirmation text has been sent to your phone.</p>
          </div>
          <Button
            onClick={() => {
              setStep("select")
              setSelectedSlot(null)
            }}
            variant="outline"
          >
            Book Another Trial
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold">Book a Free Trial Class</h1>
          <p className="text-muted-foreground mt-1">
            Choose a date and class to try. No commitment required!
          </p>
        </div>

        {step === "select" && (
          <>
            {/* Date selector */}
            <div>
              <h2 className="text-sm font-semibold mb-3">Select a Date</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8 shrink-0"
                  disabled={dateIndex <= 0}
                  onClick={() => setSelectedDate(dates[dateIndex - 1])}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <div className="flex gap-2 overflow-x-auto flex-1 pb-1">
                  {dates.map((date) => {
                    const isActive = date === selectedDate
                    const dateObj = new Date(date + "T00:00:00")
                    const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" })
                    const dayNum = dateObj.getDate()
                    const month = dateObj.toLocaleDateString("en-US", { month: "short" })
                    return (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`flex flex-col items-center px-3 py-2 rounded-lg border transition-colors shrink-0 ${
                          isActive
                            ? "bg-foreground text-background border-foreground"
                            : "bg-background text-foreground border-border hover:border-foreground/30"
                        }`}
                      >
                        <span className="text-[10px] uppercase">{dayName}</span>
                        <span className="text-lg font-bold">{dayNum}</span>
                        <span className="text-[10px]">{month}</span>
                      </button>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8 shrink-0"
                  disabled={dateIndex >= dates.length - 1}
                  onClick={() => setSelectedDate(dates[dateIndex + 1])}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>

            {/* Available slots */}
            <div>
              <h2 className="text-sm font-semibold mb-3">
                Available Classes — {formatDateShort(selectedDate)}
              </h2>
              {slotsForDate.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No available trial slots on this date. Try another day!
                </p>
              ) : (
                <div className="space-y-3">
                  {slotsForDate.map((slot) => (
                    <Card
                      key={slot.id}
                      className="cursor-pointer hover:shadow-md hover:border-foreground/20 transition-all"
                      onClick={() => handleSelectSlot(slot)}
                    >
                      <CardContent className="flex items-center gap-4">
                        <div className="text-center shrink-0 w-16">
                          <p className="text-sm font-semibold">{formatTime(slot.startTime)}</p>
                          <p className="text-[10px] text-muted-foreground">{formatTime(slot.endTime)}</p>
                        </div>
                        <Separator orientation="vertical" className="h-12" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold">{slot.className}</p>
                            <Badge
                              variant="outline"
                              className={DISCIPLINE_BADGE_COLORS[slot.discipline] ?? ""}
                            >
                              {DISCIPLINE_LABELS[slot.discipline]}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            with {slot.instructorName} &middot; {slot.room}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <Badge
                            variant="outline"
                            className={
                              slot.availableSpots <= 2
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }
                          >
                            {slot.availableSpots} {slot.availableSpots === 1 ? "spot" : "spots"} left
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Booking form */}
        {step === "form" && selectedSlot && (
          <div>
            <button
              onClick={handleBack}
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4"
            >
              <ChevronLeft className="size-3.5" /> Back to classes
            </button>

            <Card className="mb-4">
              <CardContent className="flex items-center gap-4">
                <div className="text-center shrink-0 w-16">
                  <p className="text-sm font-semibold">{formatTime(selectedSlot.startTime)}</p>
                  <p className="text-[10px] text-muted-foreground">{formatTime(selectedSlot.endTime)}</p>
                </div>
                <Separator orientation="vertical" className="h-12" />
                <div>
                  <p className="text-sm font-semibold">{selectedSlot.className}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateDisplay(selectedSlot.date)} &middot; {selectedSlot.room} &middot; {selectedSlot.instructorName}
                  </p>
                </div>
              </CardContent>
            </Card>

            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-sm font-semibold">Your Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="parentFirst">Parent First Name</Label>
                  <Input id="parentFirst" placeholder="Jane" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="parentLast">Parent Last Name</Label>
                  <Input id="parentLast" placeholder="Smith" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="jane@email.com" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" placeholder="(555) 123-4567" required />
                </div>
              </div>

              <Separator />

              <h2 className="text-sm font-semibold">Child Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="childName">Child&apos;s Name</Label>
                  <Input id="childName" placeholder="Emma" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="childAge">Child&apos;s Age</Label>
                  <Input id="childAge" type="number" min="3" max="18" placeholder="7" required />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="experience">Dance Experience</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No experience</SelectItem>
                      <SelectItem value="beginner">Beginner (less than 1 year)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                      <SelectItem value="advanced">Advanced (3+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                <Calendar className="size-4 mr-2" />
                Book Trial Class
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
