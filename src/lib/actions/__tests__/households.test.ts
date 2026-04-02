import { describe, it, expect, vi, beforeEach } from "vitest"

// ── Mocks ───────────────────────────────────────────────────────────────────

const mockDb = {
  household: {
    create: vi.fn(),
    update: vi.fn(),
  },
}

vi.mock("@/lib/db", () => ({ db: mockDb }))
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))

const { createHousehold, archiveHousehold } = await import(
  "@/lib/actions/households"
)

// ── Helpers ─────────────────────────────────────────────────────────────────

function makeFormData(entries: Record<string, string>): FormData {
  const fd = new FormData()
  for (const [key, value] of Object.entries(entries)) {
    fd.set(key, value)
  }
  return fd
}

// ── createHousehold ─────────────────────────────────────────────────────────

describe("createHousehold", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("parses FormData and creates a household, returning its ID", async () => {
    mockDb.household.create.mockResolvedValue({ id: "hh-1" })

    const fd = makeFormData({
      street: "123 Main St",
      city: "Springfield",
      state: "IL",
      zip: "62701",
    })

    const result = await createHousehold(fd)

    expect(mockDb.household.create).toHaveBeenCalledWith({
      data: {
        street: "123 Main St",
        city: "Springfield",
        state: "IL",
        zip: "62701",
        status: "active",
      },
    })
    expect(result).toBe("hh-1")
  })
})

// ── archiveHousehold ────────────────────────────────────────────────────────

describe("archiveHousehold", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("sets household status to archived", async () => {
    mockDb.household.update.mockResolvedValue({})

    await archiveHousehold("hh-1")

    expect(mockDb.household.update).toHaveBeenCalledWith({
      where: { id: "hh-1" },
      data: { status: "archived" },
    })
  })
})
