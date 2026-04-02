import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockDb } = vi.hoisted(() => ({
  mockDb: {
    invoice: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}))

vi.mock("@/lib/db", () => ({ db: mockDb }))

// Mock the data import used by compatibility exports
vi.mock("@/data/invoices", () => ({
  invoices: [
    { total: 200, status: "paid" },
    { total: 150, status: "pending" },
    { total: 50, status: "failed" },
  ],
}))

import {
  getInvoices,
  getInvoiceById,
  getInvoicesByHousehold,
  getInvoicesByStatus,
  getOverdueInvoices,
} from "@/lib/dal/invoices"

describe("invoices DAL", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const makeLineItem = (overrides: Record<string, unknown> = {}) => ({
    id: "li-1",
    studentId: "stu-1",
    classId: "cls-1",
    description: "Ballet — Juniors",
    amount: 95,
    overrides: [],
    ...overrides,
  })

  const makeOverride = (overrides: Record<string, unknown> = {}) => ({
    id: "ovr-1",
    originalAmount: 95,
    newAmount: 75,
    reason: "Sibling discount",
    createdBy: "admin-1",
    createdAt: new Date("2026-03-15T10:00:00Z"),
    ...overrides,
  })

  const makePrismaInvoice = (overrides: Record<string, unknown> = {}) => ({
    id: "inv-1",
    householdId: "hh-1",
    date: new Date("2026-03-01"),
    dueDate: new Date("2026-03-15"),
    lineItems: [makeLineItem()],
    subtotal: 95,
    total: 95,
    status: "paid",
    paidDate: new Date("2026-03-10"),
    ...overrides,
  })

  // ── getInvoices ─────────────────────────────────────────────────────────

  it("returns mapped invoices with Decimal->number and Date->string conversions", async () => {
    mockDb.invoice.findMany.mockResolvedValue([makePrismaInvoice()])

    const result = await getInvoices()

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      id: "inv-1",
      householdId: "hh-1",
      date: "2026-03-01",
      dueDate: "2026-03-15",
      lineItems: [
        {
          id: "li-1",
          studentId: "stu-1",
          classId: "cls-1",
          description: "Ballet — Juniors",
          amount: 95,
          override: undefined,
        },
      ],
      subtotal: 95,
      total: 95,
      status: "paid",
      paidDate: "2026-03-10",
    })
  })

  it("returns empty array when no invoices exist", async () => {
    mockDb.invoice.findMany.mockResolvedValue([])
    const result = await getInvoices()
    expect(result).toEqual([])
  })

  // ── Line items with overrides ─────────────────────────────────────────

  it("maps line items with override — latest override wins", async () => {
    const lineItemWithOverride = makeLineItem({
      overrides: [
        makeOverride(),
        makeOverride({ id: "ovr-old", createdAt: new Date("2026-03-01T10:00:00Z") }),
      ],
    })
    mockDb.invoice.findMany.mockResolvedValue([
      makePrismaInvoice({ lineItems: [lineItemWithOverride] }),
    ])

    const result = await getInvoices()
    const override = result[0].lineItems[0].override

    expect(override).toBeDefined()
    expect(override!.id).toBe("ovr-1")
    expect(override!.originalAmount).toBe(95)
    expect(override!.newAmount).toBe(75)
    expect(override!.reason).toBe("Sibling discount")
    expect(override!.createdAt).toBe("2026-03-15T10:00:00.000Z")
  })

  // ── getInvoiceById ────────────────────────────────────────────────────

  it("returns a single mapped invoice by ID", async () => {
    mockDb.invoice.findUnique.mockResolvedValue(makePrismaInvoice())

    const result = await getInvoiceById("inv-1")

    expect(result).not.toBeNull()
    expect(result!.id).toBe("inv-1")
  })

  it("returns null when invoice not found", async () => {
    mockDb.invoice.findUnique.mockResolvedValue(null)

    const result = await getInvoiceById("nonexistent")

    expect(result).toBeNull()
  })

  // ── getInvoicesByHousehold ────────────────────────────────────────────

  it("filters invoices by householdId", async () => {
    mockDb.invoice.findMany.mockResolvedValue([makePrismaInvoice()])

    const result = await getInvoicesByHousehold("hh-1")

    expect(result).toHaveLength(1)
    expect(mockDb.invoice.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { householdId: "hh-1" },
      })
    )
  })

  // ── getInvoicesByStatus ───────────────────────────────────────────────

  it("filters invoices by payment status", async () => {
    const overdueInvoice = makePrismaInvoice({ status: "overdue", paidDate: null })
    mockDb.invoice.findMany.mockResolvedValue([overdueInvoice])

    const result = await getInvoicesByStatus("overdue")

    expect(result).toHaveLength(1)
    expect(result[0].status).toBe("overdue")
    expect(result[0].paidDate).toBeUndefined()
  })

  // ── getOverdueInvoices ────────────────────────────────────────────────

  it("fetches invoices that are overdue or past due date", async () => {
    mockDb.invoice.findMany.mockResolvedValue([
      makePrismaInvoice({ id: "inv-overdue", status: "overdue", paidDate: null }),
    ])

    const result = await getOverdueInvoices()

    expect(result).toHaveLength(1)
    expect(mockDb.invoice.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { status: "overdue" },
            { status: "pending", dueDate: { lt: expect.any(Date) } },
          ],
        },
      })
    )
  })

  // ── Null paidDate ─────────────────────────────────────────────────────

  it("maps paidDate as undefined when null", async () => {
    mockDb.invoice.findMany.mockResolvedValue([
      makePrismaInvoice({ paidDate: null }),
    ])

    const result = await getInvoices()

    expect(result[0].paidDate).toBeUndefined()
  })
})
