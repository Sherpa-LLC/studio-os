"use client"

import { useState } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/shared/page-header"
import { StepIndicator } from "@/components/registration/step-indicator"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Pencil, Trash2, UserRound } from "lucide-react"

interface ChildForm {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
}

interface Child extends ChildForm {
  id: string
}

const EMPTY_CHILD: ChildForm = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
}

export default function RegisterChildrenPage() {
  const [children, setChildren] = useState<Child[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ChildForm>(EMPTY_CHILD)

  function update(field: keyof ChildForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleAdd() {
    if (!form.firstName || !form.lastName || !form.dateOfBirth || !form.gender) return

    if (editingId) {
      setChildren((prev) =>
        prev.map((c) => (c.id === editingId ? { ...form, id: editingId } : c))
      )
      setEditingId(null)
    } else {
      setChildren((prev) => [...prev, { ...form, id: crypto.randomUUID() }])
    }
    setForm(EMPTY_CHILD)
    setShowForm(false)
  }

  function handleEdit(child: Child) {
    setForm({
      firstName: child.firstName,
      lastName: child.lastName,
      dateOfBirth: child.dateOfBirth,
      gender: child.gender,
    })
    setEditingId(child.id)
    setShowForm(true)
  }

  function handleRemove(id: string) {
    setChildren((prev) => prev.filter((c) => c.id !== id))
    if (editingId === id) {
      setEditingId(null)
      setForm(EMPTY_CHILD)
      setShowForm(false)
    }
  }

  function handleCancel() {
    setForm(EMPTY_CHILD)
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <StepIndicator currentStep={2} />
      <PageHeader
        title="Add Children"
        description="Add your children who will be attending classes"
      />

      {children.length > 0 && (
        <div className="space-y-3">
          {children.map((child) => (
            <Card key={child.id} size="sm">
              <CardContent className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <UserRound className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {child.firstName} {child.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      DOB: {child.dateOfBirth} &middot;{" "}
                      {child.gender.charAt(0).toUpperCase() + child.gender.slice(1)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleEdit(child)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleRemove(child.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showForm ? (
        <Card>
          <CardContent className="space-y-4">
            <p className="text-sm font-medium">
              {editingId ? "Edit Child" : "New Child"}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="childFirst">First Name</Label>
                <Input
                  id="childFirst"
                  placeholder="Emma"
                  value={form.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="childLast">Last Name</Label>
                <Input
                  id="childLast"
                  placeholder="Anderson"
                  value={form.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="childDob">Date of Birth</Label>
                <Input
                  id="childDob"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => update("dateOfBirth", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={form.gender} onValueChange={(val) => update("gender", val ?? "")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd}>
                {editingId ? "Save Changes" : "Add Child"}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button variant="outline" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Child
        </Button>
      )}

      <div className="flex items-center justify-between pt-4">
        <Link href="/register">
          <Button variant="outline">Back</Button>
        </Link>
        <Link href="/register/classes">
          <Button disabled={children.length === 0}>Continue</Button>
        </Link>
      </div>
    </div>
  )
}
