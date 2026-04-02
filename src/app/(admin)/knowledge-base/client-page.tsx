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
import { Separator } from "@/components/ui/separator"

import { formatDate } from "@/lib/format"
import {
  Plus,
  Search,
  Book,
  FileText,
  Settings,
  UserCheck,
  Briefcase,
  Clock,
} from "lucide-react"
import { toast } from "sonner"
import type { KnowledgeBaseArticle, ArticleCategory } from "@/lib/types"


const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Book: <Book className="size-6 text-indigo-600" />,
  FileText: <FileText className="size-6 text-violet-600" />,
  Settings: <Settings className="size-6 text-slate-600" />,
  UserCheck: <UserCheck className="size-6 text-emerald-600" />,
  Briefcase: <Briefcase className="size-6 text-amber-600" />,
}

const CATEGORY_BADGE_COLORS: Record<ArticleCategory, string> = {
  "policies-procedures": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "curriculum-lesson-plans": "bg-violet-50 text-violet-700 border-violet-200",
  "studio-operations": "bg-slate-100 text-slate-700 border-slate-200",
  "sub-handbook": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "hr-staff": "bg-amber-50 text-amber-700 border-amber-200",
}

interface CategoryMeta {
  id: ArticleCategory
  label: string
  description: string
  icon: string
  articleCount: number
}

interface KnowledgeBaseClientPageProps {
  categories: CategoryMeta[]
  recentArticles: KnowledgeBaseArticle[]
}

export default function KnowledgeBaseClientPage({
  categories,
  recentArticles,
}: KnowledgeBaseClientPageProps) {
  const [newArticleOpen, setNewArticleOpen] = useState(false)

  function handleCreateArticle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setNewArticleOpen(false)
    toast.success("Article created", {
      description: "Your new knowledge base article has been published.",
    })
  }

  return (
    <>
      <Header title="Knowledge Base" />
      <div className="flex-1 p-6 space-y-6">
        <PageHeader
          title="Knowledge Base"
          description="Policies, lesson plans, and operational guides for your team"
        >
          <Dialog open={newArticleOpen} onOpenChange={setNewArticleOpen}>
            <DialogTrigger
              render={
                <Button>
                  <Plus data-icon="inline-start" />
                  New Article
                </Button>
              }
            />
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>New Article</DialogTitle>
                <DialogDescription>
                  Create a new knowledge base article for your team.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateArticle} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="article-title">Title</Label>
                  <Input
                    id="article-title"
                    placeholder="e.g. New Hire Orientation Guide"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="article-body">Content</Label>
                  <Textarea
                    id="article-body"
                    placeholder="Write your article content here..."
                    rows={8}
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="submit">Publish Article</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </PageHeader>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            className="pl-9"
          />
        </div>

        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category Cards */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Browse by Category
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={
                    cat.id === "curriculum-lesson-plans"
                      ? "/knowledge-base/curriculum"
                      : `/knowledge-base?category=${cat.id}`
                  }
                  className="group block"
                >
                  <Card className="h-full transition-shadow group-hover:shadow-md">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-muted p-2.5">
                          {CATEGORY_ICONS[cat.icon]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base leading-snug">
                            {cat.label}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground mt-1">
                            {cat.articleCount} article{cat.articleCount !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {cat.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Recently Updated Sidebar */}
          <div className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Recently Updated
            </h2>
            <div className="space-y-3">
              {recentArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/knowledge-base/${article.id}`}
                  className="group block"
                >
                  <Card className="transition-shadow group-hover:shadow-md">
                    <CardContent className="pt-4 pb-3 space-y-2">
                      <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors">
                        {article.title}
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${CATEGORY_BADGE_COLORS[article.category]}`}
                        >
                          {categories.find((c) => c.id === article.category)?.label}
                        </Badge>
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Clock className="size-3" />
                          {formatDate(article.updatedAt)}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        by {article.author}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
