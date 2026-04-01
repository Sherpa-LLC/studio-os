import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export interface RecitalDetails {
  name: string
  date: string
  venue: string
  theme: string
  description: string
}

interface StepDetailsProps {
  data: RecitalDetails
  onChange: (data: RecitalDetails) => void
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <div className="h-4 w-1 rounded-full bg-primary" />
      <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
        {children}
      </h2>
    </div>
  )
}

export function StepDetails({ data, onChange }: StepDetailsProps) {
  function update(field: keyof RecitalDetails, value: string) {
    onChange({ ...data, [field]: value })
  }

  return (
    <div>
      <SectionHeader>Recital Details</SectionHeader>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="recital-name">Recital Name *</Label>
          <Input
            id="recital-name"
            className="h-10"
            placeholder="e.g. Spring Showcase 2026"
            value={data.name}
            onChange={(e) => update("name", e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="recital-date">Date *</Label>
            <Input
              id="recital-date"
              className="h-10"
              type="date"
              value={data.date}
              onChange={(e) => update("date", e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="recital-venue">Venue *</Label>
            <Input
              id="recital-venue"
              className="h-10"
              placeholder="e.g. Performing Arts Center"
              value={data.venue}
              onChange={(e) => update("venue", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="recital-theme">Theme</Label>
          <Input
            id="recital-theme"
            className="h-10"
            placeholder="e.g. Enchanted, Under the Sea"
            value={data.theme}
            onChange={(e) => update("theme", e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="recital-description">Description</Label>
          <Textarea
            id="recital-description"
            rows={3}
            placeholder="Notes about this recital..."
            value={data.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
