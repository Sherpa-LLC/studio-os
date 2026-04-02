"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import type { KnowledgeBaseArticle, ArticleCategory } from "@/lib/types"
import { formatDate } from "@/lib/format"
import {
  ArrowLeft,
  ChevronRight,
  Pencil,
  Clock,
  User,
  FileText,
} from "lucide-react"
import { toast } from "sonner"

const CATEGORY_BADGE_COLORS: Record<ArticleCategory, string> = {
  "policies-procedures": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "curriculum-lesson-plans": "bg-violet-50 text-violet-700 border-violet-200",
  "studio-operations": "bg-slate-100 text-slate-700 border-slate-200",
  "sub-handbook": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "hr-staff": "bg-amber-50 text-amber-700 border-amber-200",
}

interface ArticlePageProps {
  article: KnowledgeBaseArticle | undefined
  categoryMeta: { id: string; label: string; description: string; icon: string; articleCount: number } | undefined
  relatedArticles: KnowledgeBaseArticle[]
}

export default function ArticlePage({
  article,
  categoryMeta,
  relatedArticles,
}: ArticlePageProps) {
  const [editOpen, setEditOpen] = useState(false)

  if (!article) {
    return (
      <>
        <Header title="Article Not Found" />
        <div className="flex-1 p-6 space-y-6">
          <h1 className="text-2xl font-bold tracking-tight">
            Article Not Found
          </h1>
          <p className="text-sm text-muted-foreground">
            The requested article could not be found.
          </p>
          <Link href="/knowledge-base">
            <Button variant="outline">
              <ArrowLeft data-icon="inline-start" />
              Back to Knowledge Base
            </Button>
          </Link>
        </div>
      </>
    )
  }

  function handleEditArticle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setEditOpen(false)
    toast.success("Article updated", {
      description: "Your changes have been saved.",
    })
  }

  return (
    <>
      <Header title={article.title} />
      <div className="flex-1 p-6 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link
            href="/knowledge-base"
            className="hover:text-foreground transition-colors"
          >
            Knowledge Base
          </Link>
          <ChevronRight className="size-3.5" />
          <span>{categoryMeta?.label}</span>
          <ChevronRight className="size-3.5" />
          <span className="text-foreground font-medium truncate max-w-[300px]">
            {article.title}
          </span>
        </nav>

        {/* Header row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <Link href="/knowledge-base">
              <Button variant="ghost" size="icon">
                <ArrowLeft />
              </Button>
            </Link>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">
                {article.title}
              </h1>
              {/* Metadata bar */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  Last updated {formatDate(article.updatedAt)}
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="size-3.5" />
                  {article.author}
                </div>
                <Badge
                  variant="outline"
                  className={CATEGORY_BADGE_COLORS[article.category]}
                >
                  {categoryMeta?.label}
                </Badge>
              </div>
            </div>
          </div>

          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger
              render={
                <Button variant="outline">
                  <Pencil data-icon="inline-start" />
                  Edit Article
                </Button>
              }
            />
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Edit Article</DialogTitle>
                <DialogDescription>
                  Make changes to &quot;{article.title}&quot;
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditArticle} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-body">Content</Label>
                  <Textarea
                    id="edit-body"
                    defaultValue={article.body}
                    rows={12}
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Separator />

        {/* Content area with optional sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Article body */}
          <div className="lg:col-span-2">
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {article.body}
              </div>
            </div>
          </div>

          {/* Related Articles sidebar */}
          {relatedArticles.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Related Articles
              </h2>
              <div className="space-y-3">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.id}
                    href={`/knowledge-base/${related.id}`}
                    className="group block"
                  >
                    <Card className="transition-shadow group-hover:shadow-md">
                      <CardContent className="pt-4 pb-3 space-y-2">
                        <div className="flex items-start gap-2.5">
                          <FileText className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors">
                              {related.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(related.updatedAt)} &middot;{" "}
                              {related.author}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
