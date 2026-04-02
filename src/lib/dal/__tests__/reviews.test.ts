import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockDb } = vi.hoisted(() => ({
  mockDb: {
    review: {
      findMany: vi.fn(),
      count: vi.fn(),
      aggregate: vi.fn(),
    },
  },
}))

vi.mock("@/lib/db", () => ({ db: mockDb }))

import {
  getReviews,
  getAverageRating,
  getResponseRate,
  getReviewsThisMonth,
} from "@/lib/dal/reviews"

describe("reviews DAL", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const makeReviewRow = (overrides: Record<string, unknown> = {}) => ({
    id: "rev-1",
    platform: "google",
    author: "Jane Smith",
    rating: 5,
    body: "Great studio!",
    date: new Date("2026-03-20"),
    responded: true,
    responseBody: "Thank you, Jane!",
    ...overrides,
  })

  // ── getReviews ────────────────────────────────────────────────────────

  it("returns mapped reviews with Date->string conversion", async () => {
    mockDb.review.findMany.mockResolvedValue([makeReviewRow()])

    const result = await getReviews()

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      id: "rev-1",
      platform: "google",
      author: "Jane Smith",
      rating: 5,
      body: "Great studio!",
      date: "2026-03-20",
      responded: true,
      responseBody: "Thank you, Jane!",
    })
    expect(mockDb.review.findMany).toHaveBeenCalledWith({
      orderBy: { date: "desc" },
    })
  })

  it("maps responseBody as undefined when null", async () => {
    mockDb.review.findMany.mockResolvedValue([
      makeReviewRow({ responseBody: null }),
    ])

    const result = await getReviews()

    expect(result[0].responseBody).toBeUndefined()
  })

  it("returns empty array when no reviews exist", async () => {
    mockDb.review.findMany.mockResolvedValue([])
    const result = await getReviews()
    expect(result).toEqual([])
  })

  // ── getAverageRating ──────────────────────────────────────────────────

  it("returns the average rating from aggregate", async () => {
    mockDb.review.aggregate.mockResolvedValue({ _avg: { rating: 4.5 } })

    const result = await getAverageRating()

    expect(result).toBe(4.5)
    expect(mockDb.review.aggregate).toHaveBeenCalledWith({
      _avg: { rating: true },
    })
  })

  it("returns 0 when no reviews exist for average", async () => {
    mockDb.review.aggregate.mockResolvedValue({ _avg: { rating: null } })

    const result = await getAverageRating()

    expect(result).toBe(0)
  })

  // ── getResponseRate ───────────────────────────────────────────────────

  it("computes response rate as a percentage", async () => {
    mockDb.review.count
      .mockResolvedValueOnce(10) // total
      .mockResolvedValueOnce(7) // responded

    const result = await getResponseRate()

    expect(result).toBe(70)
  })

  it("returns 0 when there are no reviews", async () => {
    mockDb.review.count
      .mockResolvedValueOnce(0) // total
      .mockResolvedValueOnce(0) // responded

    const result = await getResponseRate()

    expect(result).toBe(0)
  })

  it("rounds response rate to nearest integer", async () => {
    mockDb.review.count
      .mockResolvedValueOnce(3) // total
      .mockResolvedValueOnce(1) // responded

    const result = await getResponseRate()

    expect(result).toBe(33) // Math.round(1/3 * 100) = 33
  })

  // ── getReviewsThisMonth ───────────────────────────────────────────────

  it("uses a date filter for the current month", async () => {
    mockDb.review.count.mockResolvedValue(5)

    const result = await getReviewsThisMonth()

    expect(result).toBe(5)
    expect(mockDb.review.count).toHaveBeenCalledWith({
      where: {
        date: { gte: expect.any(Date) },
      },
    })
  })

  it("returns 0 when no reviews this month", async () => {
    mockDb.review.count.mockResolvedValue(0)

    const result = await getReviewsThisMonth()

    expect(result).toBe(0)
  })
})
