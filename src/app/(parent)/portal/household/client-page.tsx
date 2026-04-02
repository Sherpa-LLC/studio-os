"use client"

import { useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { DISCIPLINE_COLORS } from "@/lib/constants"
import { formatPhone, formatAge, formatDate } from "@/lib/format"
import { toast } from "sonner"
import {
  Mail,
  MapPin,
  Pencil,
  Phone,
  UserRound,
  Ruler,
  Heart,
  ShieldAlert,
} from "lucide-react"
import type { Household, Student, Class } from "@/lib/types"

// Mock emergency contact
const EMERGENCY_CONTACT = {
  name: "Susan Anderson",
  phone: "5552341099",
  relationship: "Grandmother",
}

// Mock medical notes for the kids
const MEDICAL_NOTES: Record<string, string> = {
  "stu-001": "Mild asthma - carries inhaler in dance bag",
  "stu-002": "No known allergies or conditions",
}

// Mock measurements for kids
const MEASUREMENTS: Record<string, Record<string, string>> = {
  "stu-001": {
    height: "4'11\"",
    chest: "28\"",
    waist: "24\"",
    hips: "29\"",
    inseam: "26\"",
  },
  "stu-002": {
    height: "4'4\"",
    chest: "25\"",
    waist: "22\"",
    hips: "26\"",
    inseam: "22\"",
  },
}

interface MyHouseholdClientProps {
  household: Household
  students: Student[]
  classes: Class[]
}

export default function MyHouseholdClient({
  household,
  students: householdStudents,
  classes,
}: MyHouseholdClientProps) {
  const [guardianDialogOpen, setGuardianDialogOpen] = useState(false)
  const [editingChildId, setEditingChildId] = useState<string | null>(null)
  const [emergencyDialogOpen, setEmergencyDialogOpen] = useState(false)

  const guardian = household.guardians[0]
  const secondGuardian = household.guardians[1]

  function handleSaveGuardian() {
    setGuardianDialogOpen(false)
    toast.success("Guardian information updated")
  }

  function handleSaveChild() {
    setEditingChildId(null)
    toast.success("Child information updated")
  }

  function handleSaveEmergency() {
    setEmergencyDialogOpen(false)
    toast.success("Emergency contact updated")
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Household"
        description="Manage your family information"
      />

      {/* Guardian info */}
      <Card>
        <CardHeader>
          <CardTitle>Guardian Information</CardTitle>
          <CardAction>
            <Dialog open={guardianDialogOpen} onOpenChange={setGuardianDialogOpen}>
              <DialogTrigger
                render={<Button variant="outline" size="sm" />}
              >
                <Pencil className="h-3 w-3 mr-1" />
                Edit
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Guardian Info</DialogTitle>
                  <DialogDescription>
                    Update your contact information.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="g-first">First Name</Label>
                      <Input id="g-first" defaultValue={guardian.firstName} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="g-last">Last Name</Label>
                      <Input id="g-last" defaultValue={guardian.lastName} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="g-email">Email</Label>
                    <Input id="g-email" type="email" defaultValue={guardian.email} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="g-phone">Phone</Label>
                    <Input id="g-phone" defaultValue={guardian.phone} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="g-street">Street Address</Label>
                    <Input id="g-street" defaultValue={household.address.street} />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="g-city">City</Label>
                      <Input id="g-city" defaultValue={household.address.city} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="g-state">State</Label>
                      <Input id="g-state" defaultValue={household.address.state} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="g-zip">Zip</Label>
                      <Input id="g-zip" defaultValue={household.address.zip} />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSaveGuardian}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <UserRound className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {guardian.firstName} {guardian.lastName}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{guardian.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{formatPhone(guardian.phone)}</span>
              </div>
            </div>
            <div>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="text-muted-foreground">
                  <p>{household.address.street}</p>
                  <p>
                    {household.address.city}, {household.address.state} {household.address.zip}
                  </p>
                </div>
              </div>
              {secondGuardian && (
                <div className="flex items-center gap-2 text-sm mt-3">
                  <UserRound className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {secondGuardian.firstName} {secondGuardian.lastName} ({secondGuardian.relationship})
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Children */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Children</h2>
        {householdStudents.map((child) => {
          const enrolledClasses = classes.filter((cls) =>
            child.enrolledClassIds.includes(cls.id),
          )
          const age = formatAge(child.dateOfBirth)
          const medical = MEDICAL_NOTES[child.id]
          const measurements = MEASUREMENTS[child.id]

          return (
            <Card key={child.id}>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <UserRound className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {child.firstName} {child.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Age {age} &middot; DOB: {formatDate(child.dateOfBirth)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30">
                      Active
                    </Badge>
                    <Dialog
                      open={editingChildId === child.id}
                      onOpenChange={(open) => setEditingChildId(open ? child.id : null)}
                    >
                      <DialogTrigger
                        render={<Button variant="outline" size="sm" />}
                      >
                        <Pencil className="h-3 w-3 mr-1" />
                        Edit
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit {child.firstName}&apos;s Info</DialogTitle>
                          <DialogDescription>
                            Update details and measurements.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label>First Name</Label>
                              <Input defaultValue={child.firstName} />
                            </div>
                            <div className="space-y-1.5">
                              <Label>Last Name</Label>
                              <Input defaultValue={child.lastName} />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <Label>Date of Birth</Label>
                            <Input type="date" defaultValue={child.dateOfBirth} />
                          </div>
                          <div className="space-y-1.5">
                            <Label>Medical Notes</Label>
                            <Input defaultValue={medical ?? ""} placeholder="None" />
                          </div>
                          <Separator />
                          <p className="text-xs font-medium text-muted-foreground">Measurements</p>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="space-y-1">
                              <Label className="text-xs">Height</Label>
                              <Input defaultValue={measurements?.height ?? ""} placeholder="--" />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Chest</Label>
                              <Input defaultValue={measurements?.chest ?? ""} placeholder="--" />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Waist</Label>
                              <Input defaultValue={measurements?.waist ?? ""} placeholder="--" />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Hips</Label>
                              <Input defaultValue={measurements?.hips ?? ""} placeholder="--" />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Inseam</Label>
                              <Input defaultValue={measurements?.inseam ?? ""} placeholder="--" />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleSaveChild}>Save Changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <Separator />

                {/* Medical notes */}
                {medical && (
                  <div className="flex items-start gap-2 text-sm">
                    <Heart className="h-4 w-4 text-rose-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-0.5">Medical Notes</p>
                      <p className="text-muted-foreground">{medical}</p>
                    </div>
                  </div>
                )}

                {/* Measurements */}
                {measurements && (
                  <div className="flex items-start gap-2 text-sm">
                    <Ruler className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Measurements</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span>Height: <span className="font-medium text-foreground">{measurements.height}</span></span>
                        <span>Chest: <span className="font-medium text-foreground">{measurements.chest}</span></span>
                        <span>Waist: <span className="font-medium text-foreground">{measurements.waist}</span></span>
                        <span>Hips: <span className="font-medium text-foreground">{measurements.hips}</span></span>
                        <span>Inseam: <span className="font-medium text-foreground">{measurements.inseam}</span></span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enrolled classes */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Enrolled Classes ({enrolledClasses.length})
                  </p>
                  <div className="space-y-2">
                    {enrolledClasses.map((cls) => (
                      <div key={cls.id} className="flex items-center gap-2 text-sm">
                        <div
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: DISCIPLINE_COLORS[cls.discipline] }}
                        />
                        <span>{cls.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Emergency contact */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
          <CardAction>
            <Dialog open={emergencyDialogOpen} onOpenChange={setEmergencyDialogOpen}>
              <DialogTrigger
                render={<Button variant="outline" size="sm" />}
              >
                <Pencil className="h-3 w-3 mr-1" />
                Edit
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Emergency Contact</DialogTitle>
                  <DialogDescription>
                    Update your emergency contact information.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="ec-name">Full Name</Label>
                    <Input id="ec-name" defaultValue={EMERGENCY_CONTACT.name} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="ec-phone">Phone Number</Label>
                    <Input id="ec-phone" defaultValue={EMERGENCY_CONTACT.phone} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="ec-rel">Relationship</Label>
                    <Input id="ec-rel" defaultValue={EMERGENCY_CONTACT.relationship} />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSaveEmergency}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <ShieldAlert className="h-5 w-5 text-amber-600" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">{EMERGENCY_CONTACT.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatPhone(EMERGENCY_CONTACT.phone)} &middot; {EMERGENCY_CONTACT.relationship}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
