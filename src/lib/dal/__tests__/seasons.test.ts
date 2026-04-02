import { describe, it, expect, vi, beforeEach } from "vitest"
import { createMockDb } from "@/lib/__tests__/helpers/mock-db"

// vi.mock factory is hoisted, so we use vi.hoisted to declare mockDb
// before the hoisted mock factory runs
const { mockDb } = vi.hoisted(() => {
  // We can't call createMockDb here because it's not hoisted.
  // Instead, create the mock shape inline.
  return {
    mockDb: {
      season: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        findFirst: vi.fn(),
      },
    },
  }
})

vi.mock("@/lib/db", () => ({ db: mockDb }))

// Mock enum-mappers to avoid pulling in Prisma enums at import time
vi.mock("@/lib/dal/enum-mappers", () => ({
  mapBillingType: (v: string) => v.replace(/_/g, "-"),
  mapSeasonStatus: (v: string) => v,
  toNumber: (v: unknown) => Number(v),
  toISODate: (d: Date) => d.toISOString().split("T")[0],
}))

import {
  getSeasons,
  getSeasonById,
  getActiveSeason,
  getSeasonsByStatus,
} from "@/lib/dal/seasons"

describe("seasons DAL", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const makePrismaRow = (overrides: Record<string, unknown> = {}) => ({
    id: "s1",
    name: "Spring 2026",
    startDate: new Date("2026-01-15"),
    endDate: new Date("2026-05-31"),
    billingRate: 95,
    billingType: "monthly",
    status: "active",
    ...overrides,
  })

  // ── getSeasons ──────────────────────────────────────────────────────────

  it("returns mapped seasons from findMany", async () => {
    mockDb.season.findMany.mockResolvedValue([
      makePrismaRow(),
      makePrismaRow({ id: "s2", name: "Summer 2026", status: "upcoming" }),
    ])

    const result = await getSeasons()

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      id: "s1",
      name: "Spring 2026",
      startDate: "2026-01-15",
      endDate: "2026-05-31",
      billingRate: 95,
      billingType: "monthly",
      status: "active",
    })
    expect(mockDb.season.findMany).toHaveBeenCalledWith({
      orderBy: { startDate: "desc" },
    })
  })

  it("returns an empty array when no seasons exist", async () => {
    mockDb.season.findMany.mockResolvedValue([])

    const result = await getSeasons()

    expect(result).toEqual([])
  })

  // ── getSeasonById ─────────────────────────────────────────────────────

  it("returns a mapped season for a valid ID", async () => {
    mockDb.season.findUnique.mockResolvedValue(makePrismaRow())

    const result = await getSeasonById("s1")

    expect(result).toBeDefined()
    expect(result!.id).toBe("s1")
    expect(result!.name).toBe("Spring 2026")
    expect(mockDb.season.findUnique).toHaveBeenCalledWith({ where: { id: "s1" } })
  })

  it("returns undefined when season not found", async () => {
    mockDb.season.findUnique.mockResolvedValue(null)

    const result = await getSeasonById("nonexistent")

    expect(result).toBeUndefined()
  })

  // ── getActiveSeason ───────────────────────────────────────────────────

  it("returns the first active season", async () => {
    mockDb.season.findFirst.mockResolvedValue(makePrismaRow())

    const result = await getActiveSeason()

    expect(result).toBeDefined()
    expect(result!.status).toBe("active")
    expect(mockDb.season.findFirst).toHaveBeenCalledWith({
      where: { status: "active" },
    })
  })

  it("returns undefined when no active season exists", async () => {
    mockDb.season.findFirst.mockResolvedValue(null)

    const result = await getActiveSeason()

    expect(result).toBeUndefined()
  })

  // ── getSeasonsByStatus ────────────────────────────────────────────────

  it("filters seasons by status", async () => {
    const upcomingRow = makePrismaRow({ id: "s3", status: "upcoming" })
    mockDb.season.findMany.mockResolvedValue([upcomingRow])

    const result = await getSeasonsByStatus("upcoming")

    expect(result).toHaveLength(1)
    expect(result[0].status).toBe("upcoming")
    expect(mockDb.season.findMany).toHaveBeenCalledWith({
      where: { status: "upcoming" },
      orderBy: { startDate: "desc" },
    })
  })

  it("returns empty array when no seasons match the status", async () => {
    mockDb.season.findMany.mockResolvedValue([])

    const result = await getSeasonsByStatus("completed")

    expect(result).toEqual([])
  })
})
