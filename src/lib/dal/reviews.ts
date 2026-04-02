import { reviews as _reviews, getAverageRating as _getAverageRating, getResponseRate as _getResponseRate, getReviewsThisMonth as _getReviewsThisMonth } from "@/data/reviews"

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const reviews = _reviews

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getAverageRating = _getAverageRating

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getResponseRate = _getResponseRate

// @ts-expect-error - DAL wrapper, will be replaced with Prisma
export const getReviewsThisMonth = _getReviewsThisMonth
