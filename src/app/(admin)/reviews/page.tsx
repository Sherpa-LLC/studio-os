"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { reviews, getAverageRating, getResponseRate, getReviewsThisMonth } from "@/data/reviews"
import { formatDate } from "@/lib/format"
import {
  Star,
  MessageSquare,
  Send,
  TrendingUp,
  CheckCircle,
  Globe,
} from "lucide-react"
import type { Review, ReviewPlatform } from "@/lib/types"

// ── Config ──────────────────────────────────────────────────────────────────

const PLATFORM_CONFIG: Record<ReviewPlatform, { label: string; color: string }> = {
  google: { label: "Google", color: "bg-blue-50 text-blue-700 border-blue-200" },
  facebook: { label: "Facebook", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  yelp: { label: "Yelp", color: "bg-red-50 text-red-700 border-red-200" },
}

const PLATFORM_FILTERS: (ReviewPlatform | "all")[] = ["all", "google", "facebook", "yelp"]

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const starSize = size === "lg" ? "size-5" : "size-3.5"
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${starSize} ${
            i < rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  )
}

export default function ReviewsPage() {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [platformFilter, setPlatformFilter] = useState<ReviewPlatform | "all">("all")
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all")

  const avgRating = getAverageRating()
  const responseRate = getResponseRate()
  const thisMonth = getReviewsThisMonth()

  const filtered = useMemo(() => {
    let list = reviews
    if (platformFilter !== "all") {
      list = list.filter((r) => r.platform === platformFilter)
    }
    if (ratingFilter !== "all") {
      list = list.filter((r) => r.rating === ratingFilter)
    }
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [platformFilter, ratingFilter])

  return (
    <>
      <Header title="Reviews" />
      <div className="flex-1 p-6 space-y-6">
        <PageHeader
          title="Reputation Management"
          description="Monitor and respond to reviews across platforms"
        >
          <Button>
            <Send data-icon="inline-start" />
            Send Review Request
          </Button>
        </PageHeader>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card size="sm">
            <CardContent className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-50 p-2">
                <Star className="size-5 text-amber-500 fill-amber-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Average Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-semibold">{avgRating}</p>
                  <StarRating rating={Math.round(avgRating)} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardContent className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <Globe className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Reviews</p>
                <p className="text-xl font-semibold">{reviews.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardContent className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-50 p-2">
                <TrendingUp className="size-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">This Month</p>
                <p className="text-xl font-semibold">{thisMonth}</p>
              </div>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardContent className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-50 p-2">
                <CheckCircle className="size-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Response Rate</p>
                <p className="text-xl font-semibold">{responseRate}%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-1">
            {PLATFORM_FILTERS.map((p) => (
              <button
                key={p}
                onClick={() => setPlatformFilter(p)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  platformFilter === p
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-muted-foreground border-border hover:border-foreground/30"
                }`}
              >
                {p === "all" ? "All Platforms" : PLATFORM_CONFIG[p].label}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {(["all", 5, 4, 3] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRatingFilter(r)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors flex items-center gap-1 ${
                  ratingFilter === r
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-muted-foreground border-border hover:border-foreground/30"
                }`}
              >
                {r === "all" ? (
                  "All Ratings"
                ) : (
                  <>{r} <Star className="size-3 fill-current" /></>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Review list */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No reviews match your filters
            </p>
          ) : (
            filtered.map((review) => (
              <Card
                key={review.id}
                className="cursor-pointer hover:shadow-md hover:border-foreground/20 transition-all"
                onClick={() => setSelectedReview(review)}
              >
                <CardContent className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <StarRating rating={review.rating} />
                        <span className="text-sm font-semibold">{review.author}</span>
                      </div>
                      <Badge variant="outline" className={PLATFORM_CONFIG[review.platform].color}>
                        {PLATFORM_CONFIG[review.platform].label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {review.responded && (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                          <MessageSquare className="size-3 mr-1" /> Replied
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">{formatDate(review.date)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{review.body}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Review detail sheet */}
      <Sheet
        open={selectedReview !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedReview(null)
        }}
      >
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          {selectedReview && (
            <>
              <SheetHeader>
                <SheetTitle>Review from {selectedReview.author}</SheetTitle>
                <SheetDescription>
                  {PLATFORM_CONFIG[selectedReview.platform].label} &middot; {formatDate(selectedReview.date)}
                </SheetDescription>
              </SheetHeader>

              <div className="px-4 space-y-5">
                {/* Rating */}
                <div className="flex items-center gap-3">
                  <StarRating rating={selectedReview.rating} size="lg" />
                  <span className="text-lg font-semibold">{selectedReview.rating}/5</span>
                </div>

                <Separator />

                {/* Review body */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Review
                  </p>
                  <p className="text-sm leading-relaxed">{selectedReview.body}</p>
                </div>

                {selectedReview.responded && selectedReview.responseBody && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Your Response
                      </p>
                      <div className="rounded-lg border bg-muted/30 p-3">
                        <p className="text-sm leading-relaxed">{selectedReview.responseBody}</p>
                      </div>
                    </div>
                  </>
                )}

                {!selectedReview.responded && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Write a Response
                      </p>
                      <Textarea
                        placeholder="Thank them for their feedback..."
                        className="min-h-[100px]"
                      />
                      <Button size="sm">
                        <Send className="size-3.5 mr-1.5" /> Post Response
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
