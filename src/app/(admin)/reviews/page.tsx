import {
  getReviews,
  getAverageRating,
  getResponseRate,
  getReviewsThisMonth,
} from "@/lib/dal/reviews"
import ReviewsClientPage from "./client-page"

export default async function ReviewsPage() {
  const [reviews, avgRating, responseRate, thisMonth] = await Promise.all([
    getReviews(),
    getAverageRating(),
    getResponseRate(),
    getReviewsThisMonth(),
  ])

  return (
    <ReviewsClientPage
      reviews={reviews}
      avgRating={avgRating}
      responseRate={responseRate}
      thisMonth={thisMonth}
    />
  )
}
