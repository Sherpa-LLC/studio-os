import { describe, it, expect, vi, beforeEach } from "vitest"

// ── Mocks ───────────────────────────────────────────────────────────────────

const mockDb = {
  lead: {
    create: vi.fn(),
    update: vi.fn(),
  },
}

vi.mock("@/lib/db", () => ({ db: mockDb }))
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))

const { createLead, updateLeadStage } = await import("@/lib/actions/leads")

// ── Helpers ─────────────────────────────────────────────────────────────────

function makeFormData(entries: Record<string, string>): FormData {
  const fd = new FormData()
  for (const [key, value] of Object.entries(entries)) {
    fd.set(key, value)
  }
  return fd
}

// ── createLead ──────────────────────────────────────────────────────────────

describe("createLead", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("parses FormData and creates a lead with correct enum mapping", async () => {
    mockDb.lead.create.mockResolvedValue({ id: "lead-1" })

    const fd = makeFormData({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@test.com",
      phone: "555-0100",
      childName: "Lily",
      childAge: "8",
      discipline: "hip-hop",
      source: "walk-in",
    })

    const result = await createLead(fd)

    expect(mockDb.lead.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@test.com",
        phone: "555-0100",
        childName: "Lily",
        childAge: 8,
        interestDiscipline: "hip_hop",
        source: "walk_in",
        stage: "new_lead",
      }),
    })
    expect(result).toBe("lead-1")
  })

  it("maps discipline with underscores correctly", async () => {
    mockDb.lead.create.mockResolvedValue({ id: "lead-2" })

    const fd = makeFormData({
      firstName: "A",
      lastName: "B",
      email: "a@b.com",
      phone: "555",
      childName: "C",
      childAge: "5",
      discipline: "musical-theatre",
      source: "website",
    })

    await createLead(fd)

    expect(mockDb.lead.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        interestDiscipline: "musical_theatre",
        source: "website",
      }),
    })
  })
})

// ── updateLeadStage ─────────────────────────────────────────────────────────

describe("updateLeadStage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("updates stage and lastContactedAt", async () => {
    mockDb.lead.update.mockResolvedValue({})

    await updateLeadStage("lead-1", "contacted")

    expect(mockDb.lead.update).toHaveBeenCalledWith({
      where: { id: "lead-1" },
      data: {
        stage: "contacted",
        lastContactedAt: expect.any(Date),
      },
    })
  })

  it("maps 'new' stage to 'new_lead'", async () => {
    mockDb.lead.update.mockResolvedValue({})

    await updateLeadStage("lead-1", "new")

    expect(mockDb.lead.update).toHaveBeenCalledWith({
      where: { id: "lead-1" },
      data: {
        stage: "new_lead",
        lastContactedAt: expect.any(Date),
      },
    })
  })

  it("converts hyphenated stages to underscored", async () => {
    mockDb.lead.update.mockResolvedValue({})

    await updateLeadStage("lead-1", "trial-scheduled")

    expect(mockDb.lead.update).toHaveBeenCalledWith({
      where: { id: "lead-1" },
      data: {
        stage: "trial_scheduled",
        lastContactedAt: expect.any(Date),
      },
    })
  })
})
