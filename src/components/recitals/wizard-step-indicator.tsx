import { Check } from "lucide-react"

interface Step {
  label: string
}

interface WizardStepIndicatorProps {
  steps: Step[]
  currentStep: number
}

export function WizardStepIndicator({ steps, currentStep }: WizardStepIndicatorProps) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const isCompleted = stepNumber < currentStep
        const isActive = stepNumber === currentStep
        return (
          <div key={stepNumber} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5 min-w-[80px]">
              <div
                className={`flex items-center justify-center size-9 rounded-full text-sm font-semibold transition-colors ${
                  isCompleted
                    ? "bg-emerald-500 text-white"
                    : isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {isCompleted ? <Check className="size-4" /> : stepNumber}
              </div>
              <span
                className={`text-xs font-medium text-center ${
                  isCompleted
                    ? "text-emerald-700"
                    : isActive
                      ? "text-foreground"
                      : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 mt-[-20px] ${
                  isCompleted ? "bg-emerald-400" : "bg-muted"
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
