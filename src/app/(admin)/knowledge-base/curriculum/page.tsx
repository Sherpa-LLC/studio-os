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
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getArticlesByCategory } from "@/data/knowledge-base"
import { formatDate } from "@/lib/format"
import {
  Plus,
  ArrowLeft,
  FileText,
  BookOpen,
  Target,
  LinkIcon,
} from "lucide-react"
import { toast } from "sonner"

// ── Discipline tab configuration ─────────────────────────────────────────────

interface DisciplineTab {
  value: string
  label: string
}

const DISCIPLINE_TABS: DisciplineTab[] = [
  { value: "ballet", label: "Ballet" },
  { value: "jazz", label: "Jazz" },
  { value: "tap", label: "Tap" },
  { value: "hip-hop", label: "Hip Hop" },
  { value: "contemporary", label: "Contemporary" },
  { value: "tumbling", label: "Tumbling" },
]

type Level = "beginner" | "intermediate" | "advanced"

interface LessonPlanCard {
  articleId: string
  title: string
  discipline: string
  level: Level
  objectivesPreview: string
  classLinkage?: string
  updatedAt: string
}

const LEVEL_BADGE: Record<Level, string> = {
  beginner: "bg-emerald-50 text-emerald-700 border-emerald-200",
  intermediate: "bg-amber-50 text-amber-700 border-amber-200",
  advanced: "bg-red-50 text-red-700 border-red-200",
}

const LEVEL_LABELS: Record<Level, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
}

// ── Map curriculum articles to lesson plan cards per discipline ──────────────

function buildLessonPlanCards(): Record<string, LessonPlanCard[]> {
  const curriculumArticles = getArticlesByCategory("curriculum-lesson-plans")

  const cards: Record<string, LessonPlanCard[]> = {
    ballet: [],
    jazz: [],
    tap: [],
    "hip-hop": [],
    contemporary: [],
    tumbling: [],
  }

  for (const article of curriculumArticles) {
    const titleLower = article.title.toLowerCase()

    let discipline = ""
    let level: Level = "beginner"
    let classLinkage: string | undefined
    let objectivesPreview = ""

    // Determine discipline from title
    if (titleLower.includes("ballet")) {
      discipline = "ballet"
    } else if (titleLower.includes("jazz")) {
      discipline = "jazz"
    } else if (titleLower.includes("tap")) {
      discipline = "tap"
    } else if (titleLower.includes("hip hop")) {
      discipline = "hip-hop"
    } else if (
      titleLower.includes("contemporary") ||
      titleLower.includes("lyrical")
    ) {
      discipline = "contemporary"
    } else if (titleLower.includes("tumbling")) {
      discipline = "tumbling"
    } else if (titleLower.includes("musical theatre")) {
      discipline = "jazz" // group with jazz
    }

    if (!discipline || !cards[discipline]) continue

    // Determine level
    if (
      titleLower.includes(" iii") ||
      titleLower.includes("advanced") ||
      titleLower.includes("pointe")
    ) {
      level = "advanced"
    } else if (
      titleLower.includes(" ii") ||
      titleLower.includes("intermediate")
    ) {
      level = "intermediate"
    } else {
      level = "beginner"
    }

    // Extract a short objectives preview from body
    const objectivesMatch = article.body.match(/Objectives?:\n([\s\S]*?)(?:\n\n|\nWarm)/i)
    if (objectivesMatch) {
      objectivesPreview = objectivesMatch[1]
        .split("\n")
        .map((line) => line.replace(/^-\s*/, "").trim())
        .filter(Boolean)
        .slice(0, 2)
        .join(". ")
    } else {
      // Fallback: first 120 chars of body
      objectivesPreview =
        article.body.slice(0, 120).replace(/\n/g, " ").trim() + "..."
    }

    // Class linkage from linkedClassIds
    if (article.linkedClassIds && article.linkedClassIds.length > 0) {
      if (article.linkedClassIds.includes("cls-001")) {
        classLinkage = "Used in: Ballet I Mon 4:00"
      } else if (article.linkedClassIds.includes("cls-002")) {
        classLinkage = "Used in: Ballet II Wed 5:00"
      } else if (article.linkedClassIds.includes("cls-005")) {
        classLinkage = "Used in: Jazz I Tue 4:30"
      }
    }

    cards[discipline].push({
      articleId: article.id,
      title: article.title,
      discipline,
      level,
      objectivesPreview,
      classLinkage,
      updatedAt: article.updatedAt,
    })
  }

  // Sort each discipline by level order
  const levelOrder: Level[] = ["beginner", "intermediate", "advanced"]
  for (const disc of Object.keys(cards)) {
    cards[disc].sort(
      (a, b) => levelOrder.indexOf(a.level) - levelOrder.indexOf(b.level)
    )
  }

  return cards
}

export default function CurriculumPage() {
  const [addPlanOpen, setAddPlanOpen] = useState(false)
  const lessonPlans = buildLessonPlanCards()

  function handleAddLessonPlan(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setAddPlanOpen(false)
    toast.success("Lesson plan created", {
      description: "The new lesson plan has been added to the curriculum.",
    })
  }

  function renderLevelGroup(plans: LessonPlanCard[], level: Level) {
    const filtered = plans.filter((p) => p.level === level)
    if (filtered.length === 0) return null

    return (
      <div key={level} className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">
          {LEVEL_LABELS[level]}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((plan) => (
            <Link
              key={plan.articleId}
              href={`/knowledge-base/${plan.articleId}`}
              className="group block"
            >
              <Card className="h-full transition-shadow group-hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <BookOpen className="size-4 text-violet-500 mt-0.5 shrink-0" />
                      <CardTitle className="text-sm leading-snug line-clamp-2">
                        {plan.title}
                      </CardTitle>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] shrink-0 ${LEVEL_BADGE[plan.level]}`}
                    >
                      {LEVEL_LABELS[plan.level]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                    <Target className="size-3 mt-0.5 shrink-0" />
                    <span className="line-clamp-2">
                      {plan.objectivesPreview}
                    </span>
                  </div>
                  {plan.classLinkage && (
                    <div className="flex items-center gap-1.5 text-xs text-primary">
                      <LinkIcon className="size-3 shrink-0" />
                      <span>{plan.classLinkage}</span>
                    </div>
                  )}
                  <p className="text-[11px] text-muted-foreground">
                    Updated {formatDate(plan.updatedAt)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  function renderDisciplineContent(discipline: string) {
    const plans = lessonPlans[discipline] || []

    if (plans.length === 0) {
      return (
        <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
          <FileText className="size-8 mx-auto mb-2 text-muted-foreground/50" />
          <p>No lesson plans yet for this discipline.</p>
          <p className="mt-1">
            Click &quot;Add Lesson Plan&quot; to create one.
          </p>
        </div>
      )
    }

    const levels: Level[] = ["beginner", "intermediate", "advanced"]

    return (
      <div className="space-y-6">
        {levels.map((level) => renderLevelGroup(plans, level))}
      </div>
    )
  }

  return (
    <>
      <Header title="Curriculum" />
      <div className="flex-1 p-6 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link
            href="/knowledge-base"
            className="hover:text-foreground transition-colors"
          >
            Knowledge Base
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">
            Curriculum & Lesson Plans
          </span>
        </nav>

        <PageHeader
          title="Curriculum & Lesson Plans"
          description="Structured lesson plans organized by discipline and level"
        >
          <Link href="/knowledge-base">
            <Button variant="outline">
              <ArrowLeft data-icon="inline-start" />
              All Articles
            </Button>
          </Link>
          <Dialog open={addPlanOpen} onOpenChange={setAddPlanOpen}>
            <DialogTrigger
              render={
                <Button>
                  <Plus data-icon="inline-start" />
                  Add Lesson Plan
                </Button>
              }
            />
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Lesson Plan</DialogTitle>
                <DialogDescription>
                  Create a new lesson plan for a specific discipline and level.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddLessonPlan} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="lp-title">Title</Label>
                  <Input
                    id="lp-title"
                    placeholder="e.g. Tap II: Syncopation & Rhythm Changes"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Discipline</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {DISCIPLINE_TABS.map((d) => (
                          <SelectItem key={d.value} value={d.value}>
                            {d.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lp-objectives">Objectives</Label>
                  <Textarea
                    id="lp-objectives"
                    placeholder="List the key objectives for this lesson plan..."
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lp-body">Lesson Content</Label>
                  <Textarea
                    id="lp-body"
                    placeholder="Warm-up, exercises, combinations, cool-down..."
                    rows={6}
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="submit">Create Lesson Plan</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </PageHeader>

        <Separator />

        {/* Discipline Tabs */}
        <Tabs defaultValue="ballet">
          <TabsList>
            {DISCIPLINE_TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {DISCIPLINE_TABS.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <div className="mt-4">
                {renderDisciplineContent(tab.value)}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  )
}
