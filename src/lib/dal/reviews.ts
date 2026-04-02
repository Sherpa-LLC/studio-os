import { db } from "@/lib/db"
import type { Review } from "@/lib/types"

function mapReview(r: any): Review {
  return {
    id: r.id, platform: r.platform, author: r.author, rating: r.rating as 1|2|3|4|5,
    body: r.body, date: r.date.toISOString().split("T")[0],
    responded: r.responded, responseBody: r.responseBody ?? undefined,
  }
}

export async function getReviews() {
  const rows = await db.review.findMany({ orderBy: { date: "desc" } })
  return rows.map(mapReview)
}
export async function getAverageRating() {
  const result = await db.review.aggregate({ _avg: { rating: true } })
  return result._avg.rating ?? 0
}
export async function getResponseRate() {
  const total = await db.review.count()
  const responded = await db.review.count({ where: { responded: true } })
  return total > 0 ? Math.round((responded / total) * 100) : 0
}
export async function getReviewsThisMonth() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  return db.review.count({ where: { date: { gte: start } } })
}
