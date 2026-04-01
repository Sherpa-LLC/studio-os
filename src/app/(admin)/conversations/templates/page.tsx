"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { textTemplates } from "@/data/text-templates"
import { Plus, Search, Copy, Pencil, FileText } from "lucide-react"
import type { TextTemplate, TemplateCategory } from "@/lib/types"

// ── Category config ─────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<TemplateCategory, { label: string; color: string }> = {
  welcome: { label: "Welcome", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  "follow-up": { label: "Follow-up", color: "bg-blue-50 text-blue-700 border-blue-200" },
  reminder: { label: "Reminder", color: "bg-amber-50 text-amber-700 border-amber-200" },
  billing: { label: "Billing", color: "bg-red-50 text-red-700 border-red-200" },
  general: { label: "General", color: "bg-gray-100 text-gray-600 border-gray-200" },
}

const CATEGORY_FILTERS: (TemplateCategory | "all")[] = ["all", "welcome", "follow-up", "reminder", "billing", "general"]

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<TextTemplate | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<TemplateCategory | "all">("all")

  const filtered = useMemo(() => {
    let list = textTemplates
    if (categoryFilter !== "all") {
      list = list.filter((t) => t.category === categoryFilter)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.body.toLowerCase().includes(q) ||
          t.shortcut?.toLowerCase().includes(q)
      )
    }
    return list
  }, [categoryFilter, searchQuery])

  return (
    <>
      <Header title="Conversations" />
      <div className="flex-1 p-6 space-y-6">
        <PageHeader
          title="Text Templates"
          description="Saved message snippets for quick replies"
        >
          <Button>
            <Plus data-icon="inline-start" />
            New Template
          </Button>
        </PageHeader>

        {/* Search & filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  categoryFilter === cat
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-muted-foreground border-border hover:border-foreground/30"
                }`}
              >
                {cat === "all" ? "All" : CATEGORY_CONFIG[cat].label}
              </button>
            ))}
          </div>
        </div>

        {/* Template grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground col-span-full text-center py-8">
              No templates found
            </p>
          ) : (
            filtered.map((tpl) => (
              <Card
                key={tpl.id}
                className="cursor-pointer hover:shadow-md hover:border-foreground/20 transition-all"
                onClick={() => setSelectedTemplate(tpl)}
              >
                <CardContent className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-muted p-1.5">
                        <FileText className="size-4 text-muted-foreground" />
                      </div>
                      <h3 className="text-sm font-semibold">{tpl.name}</h3>
                    </div>
                    <Badge variant="outline" className={CATEGORY_CONFIG[tpl.category].color}>
                      {CATEGORY_CONFIG[tpl.category].label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {tpl.body}
                  </p>
                  {tpl.shortcut && (
                    <div className="flex items-center gap-1">
                      <code className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {tpl.shortcut}
                      </code>
                      <span className="text-[10px] text-muted-foreground">shortcut</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Template detail sheet */}
      <Sheet
        open={selectedTemplate !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedTemplate(null)
        }}
      >
        <SheetContent className="sm:max-w-lg">
          {selectedTemplate && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedTemplate.name}</SheetTitle>
                <SheetDescription>
                  Template details and preview
                </SheetDescription>
              </SheetHeader>

              <div className="px-4 space-y-5">
                {/* Category & shortcut */}
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={CATEGORY_CONFIG[selectedTemplate.category].color}>
                    {CATEGORY_CONFIG[selectedTemplate.category].label}
                  </Badge>
                  {selectedTemplate.shortcut && (
                    <code className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {selectedTemplate.shortcut}
                    </code>
                  )}
                </div>

                <Separator />

                {/* Preview */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Message Preview
                  </p>
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {selectedTemplate.body}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Variables like {"{{parentName}}"} will be replaced with actual contact data when sent.
                  </p>
                </div>

                <Separator />

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Copy className="size-4 mr-2" />
                    Copy Text
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Pencil className="size-4 mr-2" />
                    Edit Template
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
