"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const STEPS = [
  { number: 1, label: "Account" },
  { number: 2, label: "Children" },
  { number: 3, label: "Classes" },
  { number: 4, label: "Waiver" },
  { number: 5, label: "Payment" },
  { number: 6, label: "Confirmation" },
]

interface StepIndicatorProps {
  currentStep: number
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Registration progress" className="mb-8">
      <ol className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const isCompleted = step.number < currentStep
          const isCurrent = step.number === currentStep
          const isFuture = step.number > currentStep

          return (
            <li
              key={step.number}
              className={cn(
                "flex flex-1 items-center",
                index < STEPS.length - 1 && "after:mx-2 after:h-px after:flex-1 after:content-['']",
                isCompleted && "after:bg-primary",
                isCurrent && "after:bg-border",
                isFuture && "after:bg-border"
              )}
            >
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                    isCompleted &&
                      "border-primary bg-primary text-primary-foreground",
                    isCurrent &&
                      "border-primary bg-primary/10 text-primary",
                    isFuture &&
                      "border-muted-foreground/30 bg-background text-muted-foreground/50"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={cn(
                    "hidden text-xs font-medium sm:block",
                    isCompleted && "text-primary",
                    isCurrent && "text-primary",
                    isFuture && "text-muted-foreground/60"
                  )}
                >
                  {step.label}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
