import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockDb } = vi.hoisted(() => ({
  mockDb: {
    billingConfig: { findFirst: vi.fn() },
    billingOverride: { findMany: vi.fn(), findUnique: vi.fn() },
  },
}))

vi.mock("@/lib/db", () => ({ db: mockDb }))

import {
  getActiveBillingConfig,
  getOverridesByLineItem,
  getOverrideById,
  getAllOverrides,
  calculateMonthlyTotal,
  calculateLateFee,
} from "@/lib/dal/billing"

describe("billing DAL", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const makeBillingConfigRow = (overrides: Record<string, unknown> = {}) => ({
    id: "cfg-1",
    hourlyRate: 95,
    monthlyCap: 380,
    registrationFee: 50,
    lateFee: 25,
    lateFeeGraceDays: 7,
    siblingDiscount: 10,
    trialFee: 0,
    isActive: true,
    createdAt: new Date("2026-01-01"),
    ...overrides,
  })

  const makeOverrideRow = (overrides: Record<string, unknown> = {}) => ({
    id: "ovr-1",
    originalAmount: 95,
    newAmount: 75,
    reason: "Sibling discount",
    createdBy: "admin-1",
    createdAt: new Date("2026-03-15T10:00:00Z"),
    ...overrides,
  })

  // ── getActiveBillingConfig ────────────────────────────────────────────

  it("returns mapped billing config when one exists", async () => {
    mockDb.billingConfig.findFirst.mockResolvedValue(makeBillingConfigRow())

    const result = await getActiveBillingConfig()

    expect(result).toEqual({
      id: "cfg-1",
      hourlyRate: 95,
      monthlyCap: 380,
      registrationFee: 50,
      lateFee: 25,
      lateFeeGraceDays: 7,
      siblingDiscount: 10,
      trialFee: 0,
    })
  })

  it("throws when no active billing config exists", async () => {
    mockDb.billingConfig.findFirst.mockResolvedValue(null)

    await expect(getActiveBillingConfig()).rejects.toThrow(
      "No active BillingConfig found"
    )
  })

  // ── getOverridesByLineItem ────────────────────────────────────────────

  it("returns mapped overrides for a line item", async () => {
    mockDb.billingOverride.findMany.mockResolvedValue([makeOverrideRow()])

    const result = await getOverridesByLineItem("li-1")

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      id: "ovr-1",
      originalAmount: 95,
      newAmount: 75,
      reason: "Sibling discount",
      createdBy: "admin-1",
      createdAt: "2026-03-15T10:00:00.000Z",
    })
    expect(mockDb.billingOverride.findMany).toHaveBeenCalledWith({
      where: { lineItemId: "li-1" },
      orderBy: { createdAt: "desc" },
    })
  })

  // ── getOverrideById ───────────────────────────────────────────────────

  it("returns a mapped override by ID", async () => {
    mockDb.billingOverride.findUnique.mockResolvedValue(makeOverrideRow())

    const result = await getOverrideById("ovr-1")

    expect(result).not.toBeNull()
    expect(result!.id).toBe("ovr-1")
  })

  it("returns null when override not found", async () => {
    mockDb.billingOverride.findUnique.mockResolvedValue(null)

    const result = await getOverrideById("nonexistent")

    expect(result).toBeNull()
  })

  // ── getAllOverrides ───────────────────────────────────────────────────

  it("returns all overrides sorted newest first", async () => {
    mockDb.billingOverride.findMany.mockResolvedValue([
      makeOverrideRow(),
      makeOverrideRow({ id: "ovr-2", createdAt: new Date("2026-03-10T10:00:00Z") }),
    ])

    const result = await getAllOverrides()

    expect(result).toHaveLength(2)
    expect(mockDb.billingOverride.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: "desc" },
    })
  })

  // ── calculateMonthlyTotal ─────────────────────────────────────────────

  it("returns raw total when below monthly cap", async () => {
    mockDb.billingConfig.findFirst.mockResolvedValue(makeBillingConfigRow())

    const result = await calculateMonthlyTotal([95, 95])

    expect(result).toBe(190)
  })

  it("returns monthly cap when total equals cap", async () => {
    mockDb.billingConfig.findFirst.mockResolvedValue(makeBillingConfigRow())

    const result = await calculateMonthlyTotal([190, 190])

    expect(result).toBe(380)
  })

  it("caps total at monthly cap when total exceeds it", async () => {
    mockDb.billingConfig.findFirst.mockResolvedValue(makeBillingConfigRow())

    const result = await calculateMonthlyTotal([95, 95, 95, 95, 95])

    expect(result).toBe(380)
  })

  it("returns 0 for empty class rates array", async () => {
    mockDb.billingConfig.findFirst.mockResolvedValue(makeBillingConfigRow())

    const result = await calculateMonthlyTotal([])

    expect(result).toBe(0)
  })

  // ── calculateLateFee ──────────────────────────────────────────────────

  it("returns the flat late fee from billing config", async () => {
    mockDb.billingConfig.findFirst.mockResolvedValue(makeBillingConfigRow())

    const result = await calculateLateFee(200)

    expect(result).toBe(25)
  })
})
