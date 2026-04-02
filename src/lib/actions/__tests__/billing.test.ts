import { describe, it, expect, vi, beforeEach } from "vitest"

// ── Mocks ───────────────────────────────────────────────────────────────────

const mockDb = {
  invoice: {
    create: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  invoiceLineItem: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
  },
  billingOverride: {
    create: vi.fn(),
  },
  $transaction: vi.fn(),
}

vi.mock("@/lib/db", () => ({ db: mockDb }))
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))
vi.mock("@/lib/dal/billing", () => ({
  getActiveBillingConfig: vi.fn().mockResolvedValue({
    monthlyCap: 380,
    hourlyRate: 95,
    registrationFee: 50,
    lateFee: 25,
    lateFeeGraceDays: 7,
    siblingDiscount: 10,
    trialFee: 15,
  }),
}))

const { createInvoice, applyOverride, markInvoicePaid } = await import(
  "@/lib/actions/billing"
)

// ── Helpers ─────────────────────────────────────────────────────────────────

function makeFormData(entries: Record<string, string>): FormData {
  const fd = new FormData()
  for (const [key, value] of Object.entries(entries)) {
    fd.set(key, value)
  }
  return fd
}

// ── createInvoice ───────────────────────────────────────────────────────────

describe("createInvoice", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("parses FormData and creates an invoice with pending status", async () => {
    mockDb.invoice.create.mockResolvedValue({ id: "inv-1" })

    const fd = makeFormData({
      date: "2026-04-01",
      dueDate: "2026-04-15",
    })

    const result = await createInvoice("hh-1", fd)

    expect(mockDb.invoice.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        householdId: "hh-1",
        subtotal: 0,
        total: 0,
        status: "pending",
      }),
    })
    expect(result).toEqual({ id: "inv-1" })
  })

  it("throws when date or dueDate is missing", async () => {
    const fd = makeFormData({ date: "2026-04-01" }) // missing dueDate

    await expect(createInvoice("hh-1", fd)).rejects.toThrow(
      "date and dueDate are required"
    )
  })
})

// ── applyOverride ───────────────────────────────────────────────────────────

describe("applyOverride", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("creates an immutable BillingOverride record via transaction", async () => {
    const mockTx = {
      invoiceLineItem: {
        findUnique: vi.fn().mockResolvedValue({
          id: "li-1",
          amount: 100,
          invoiceId: "inv-1",
        }),
        findMany: vi.fn().mockResolvedValue([]),
      },
      billingOverride: {
        create: vi.fn().mockResolvedValue({ id: "ovr-1" }),
      },
      invoice: {
        update: vi.fn(),
      },
    }
    // Mock $transaction to execute the callback with our mock tx
    mockDb.$transaction.mockImplementation(async (cb: Function) => cb(mockTx))

    const fd = makeFormData({
      newAmount: "75",
      reason: "Sibling discount",
      createdBy: "admin-1",
    })

    const result = await applyOverride("li-1", fd)

    expect(mockTx.billingOverride.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        lineItemId: "li-1",
        originalAmount: 100,
        newAmount: 75,
        reason: "Sibling discount",
        createdBy: "admin-1",
      }),
    })
    expect(result).toEqual({ id: "ovr-1" })
  })

  it("throws when required fields are missing", async () => {
    const fd = makeFormData({ newAmount: "75" }) // missing reason, createdBy

    await expect(applyOverride("li-1", fd)).rejects.toThrow(
      "newAmount, reason, and createdBy are required"
    )
  })

  it("throws when newAmount is negative", async () => {
    const fd = makeFormData({
      newAmount: "-10",
      reason: "test",
      createdBy: "admin-1",
    })

    await expect(applyOverride("li-1", fd)).rejects.toThrow(
      "newAmount must be a non-negative number"
    )
  })
})

// ── markInvoicePaid ─────────────────────────────────────────────────────────

describe("markInvoicePaid", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("updates status to paid and sets paidDate", async () => {
    mockDb.invoice.findUnique.mockResolvedValue({
      id: "inv-1",
      status: "pending",
      householdId: "hh-1",
    })
    mockDb.invoice.update.mockResolvedValue({})

    const result = await markInvoicePaid("inv-1")

    expect(mockDb.invoice.update).toHaveBeenCalledWith({
      where: { id: "inv-1" },
      data: {
        status: "paid",
        paidDate: expect.any(Date),
      },
    })
    expect(result).toEqual({ success: true })
  })

  it("throws when invoice is not found", async () => {
    mockDb.invoice.findUnique.mockResolvedValue(null)

    await expect(markInvoicePaid("nonexistent")).rejects.toThrow(
      "Invoice nonexistent not found"
    )
  })

  it("throws when invoice is already paid", async () => {
    mockDb.invoice.findUnique.mockResolvedValue({
      id: "inv-1",
      status: "paid",
      householdId: "hh-1",
    })

    await expect(markInvoicePaid("inv-1")).rejects.toThrow(
      "Invoice inv-1 is already paid"
    )
  })
})

// ── Immutability check ──────────────────────────────────────────────────────

describe("billing immutability", () => {
  it("does NOT export updateOverride or deleteOverride", async () => {
    const mod = await import("@/lib/actions/billing")
    expect(mod).not.toHaveProperty("updateOverride")
    expect(mod).not.toHaveProperty("deleteOverride")
  })
})
