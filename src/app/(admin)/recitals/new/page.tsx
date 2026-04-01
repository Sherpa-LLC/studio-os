"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { WizardStepIndicator } from "@/components/recitals/wizard-step-indicator"
import { StepDetails, type RecitalDetails } from "@/components/recitals/step-details"
import { StepRoutines, type RoutineSelection } from "@/components/recitals/step-routines"
import { StepCostumes, type CostumeConfig } from "@/components/recitals/step-costumes"
import { StepReview } from "@/components/recitals/step-review"
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react"
import { toast } from "sonner"

const STEPS = [
  { label: "Details" },
  { label: "Routines" },
  { label: "Costumes" },
  { label: "Review" },
]

export default function CreateRecitalPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)

  // Step 1: Details
  const [details, setDetails] = useState<RecitalDetails>({
    name: "",
    date: "",
    venue: "",
    theme: "",
    description: "",
  })

  // Step 2: Routines
  const [routines, setRoutines] = useState<RoutineSelection[]>([])

  // Step 3: Costumes
  const [costumes, setCostumes] = useState<CostumeConfig[]>([])

  // ── Step navigation ────────────────────────────────────────────────────────

  function canAdvance(): boolean {
    switch (currentStep) {
      case 1:
        return Boolean(details.name && details.date && details.venue)
      case 2:
        return routines.length > 0
      case 3:
        return true
      case 4:
        return true
      default:
        return false
    }
  }

  function handleNext() {
    if (currentStep === 2) {
      // Sync costumes array when moving from routines to costumes step
      // Add new entries for newly selected routines, remove deselected ones
      setCostumes((prev) => {
        const existing = new Map(prev.map((c) => [c.classId, c]))
        return routines.map((r) =>
          existing.get(r.classId) ?? {
            classId: r.classId,
            costumeName: "",
            description: "",
            supplier: "",
            unitCost: 0,
            salePrice: 0,
          }
        )
      })
    }
    setCurrentStep((s) => Math.min(s + 1, STEPS.length))
  }

  function handleBack() {
    setCurrentStep((s) => Math.max(s - 1, 1))
  }

  function handleCreate() {
    toast.success("Recital created successfully", {
      description: `${details.name} has been set up with ${routines.length} routine${routines.length !== 1 ? "s" : ""}.`,
    })
    router.push("/recitals")
  }

  // ── Summary text for sticky bar ────────────────────────────────────────────

  const summaryParts = [details.name, details.venue, details.date].filter(Boolean)
  const summaryText =
    summaryParts.length > 0
      ? summaryParts.join(" \u00b7 ")
      : "Fill in the details above"

  return (
    <>
      <Header title="Create Recital" />
      <div className="flex-1 p-6 pb-28 space-y-6">
        <PageHeader
          title="Create Recital"
          description="Set up a new recital with routines, costumes, and lineup"
        >
          <Link href="/recitals">
            <Button variant="outline">
              <ArrowLeft data-icon="inline-start" />
              Back to Recitals
            </Button>
          </Link>
        </PageHeader>

        {/* Step indicator */}
        <div className="max-w-[640px] mx-auto">
          <WizardStepIndicator steps={STEPS} currentStep={currentStep} />
        </div>

        <Separator />

        {/* Step content */}
        <div className="max-w-[960px] mx-auto">
          {currentStep === 1 && (
            <StepDetails data={details} onChange={setDetails} />
          )}
          {currentStep === 2 && (
            <StepRoutines routines={routines} onChange={setRoutines} />
          )}
          {currentStep === 3 && (
            <StepCostumes
              routines={routines}
              costumes={costumes}
              onChange={setCostumes}
            />
          )}
          {currentStep === 4 && (
            <StepReview
              routines={routines}
              costumes={costumes}
              onReorder={setRoutines}
            />
          )}
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-10 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 py-3">
        <div className="max-w-[960px] mx-auto flex items-center justify-between">
          <p className="text-xs text-muted-foreground hidden sm:block truncate max-w-[300px]">
            {summaryText}
          </p>
          <div className="flex items-center gap-3 ml-auto">
            {currentStep > 1 ? (
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft data-icon="inline-start" />
                Back
              </Button>
            ) : (
              <Link href="/recitals">
                <Button variant="outline">Cancel</Button>
              </Link>
            )}
            {currentStep < STEPS.length ? (
              <Button onClick={handleNext} disabled={!canAdvance()}>
                Next
                <ArrowRight data-icon="inline-end" />
              </Button>
            ) : (
              <Button onClick={handleCreate} disabled={!canAdvance()}>
                <Sparkles data-icon="inline-start" />
                Create Recital
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
