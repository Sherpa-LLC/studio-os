import { describe, it, expect, vi, beforeEach } from "vitest"

// ── Mocks ───────────────────────────────────────────────────────────────────

const mockDb = {
  class: {
    findUnique: vi.fn(),
  },
  enrollment: {
    upsert: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    update: vi.fn(),
  },
}

vi.mock("@/lib/db", () => ({ db: mockDb }))
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))

// Import after mocks are declared
const { enrollStudent, withdrawStudent } = await import("@/lib/actions/enrollment")

// ── Tests ───────────────────────────────────────────────────────────────────

describe("enrollStudent", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("creates an active enrollment when class has capacity", async () => {
    mockDb.class.findUnique.mockResolvedValue({
      capacity: 20,
      _count: { enrollments: 10 },
    })
    mockDb.enrollment.upsert.mockResolvedValue({
      id: "enroll-1",
      status: "active",
    })

    const result = await enrollStudent("student-1", "class-1")

    expect(mockDb.class.findUnique).toHaveBeenCalledWith({
      where: { id: "class-1" },
      select: {
        capacity: true,
        _count: { select: { enrollments: { where: { status: "active" } } } },
      },
    })
    expect(mockDb.enrollment.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { studentId_classId: { studentId: "student-1", classId: "class-1" } },
        create: expect.objectContaining({ status: "active" }),
      })
    )
    expect(result).toEqual({ id: "enroll-1", status: "active" })
  })

  it("auto-waitlists when class is full", async () => {
    mockDb.class.findUnique.mockResolvedValue({
      capacity: 10,
      _count: { enrollments: 10 },
    })
    mockDb.enrollment.upsert.mockResolvedValue({
      id: "enroll-2",
      status: "waitlisted",
    })

    const result = await enrollStudent("student-2", "class-1")

    expect(mockDb.enrollment.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({ status: "waitlisted" }),
      })
    )
    expect(result.status).toBe("waitlisted")
  })

  it("throws when class does not exist", async () => {
    mockDb.class.findUnique.mockResolvedValue(null)

    await expect(enrollStudent("student-1", "nonexistent")).rejects.toThrow(
      "Class nonexistent not found"
    )
  })
})

describe("withdrawStudent", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("sets enrollment status to withdrawn and promotes waitlisted student", async () => {
    mockDb.enrollment.findUnique.mockResolvedValue({
      id: "enroll-1",
      studentId: "student-1",
      classId: "class-1",
      status: "active",
    })
    mockDb.enrollment.update.mockResolvedValue({})
    mockDb.enrollment.findFirst.mockResolvedValue({
      id: "enroll-wait-1",
      status: "waitlisted",
    })

    await withdrawStudent("student-1", "class-1")

    // Should update the withdrawn enrollment
    expect(mockDb.enrollment.update).toHaveBeenCalledWith({
      where: { id: "enroll-1" },
      data: { status: "withdrawn" },
    })
    // Should promote the waitlisted student
    expect(mockDb.enrollment.update).toHaveBeenCalledWith({
      where: { id: "enroll-wait-1" },
      data: { status: "active" },
    })
  })

  it("does not promote when no waitlisted students exist", async () => {
    mockDb.enrollment.findUnique.mockResolvedValue({
      id: "enroll-1",
      studentId: "student-1",
      classId: "class-1",
      status: "active",
    })
    mockDb.enrollment.update.mockResolvedValue({})
    mockDb.enrollment.findFirst.mockResolvedValue(null)

    await withdrawStudent("student-1", "class-1")

    // Only one update call (the withdrawal), no promotion
    expect(mockDb.enrollment.update).toHaveBeenCalledTimes(1)
  })

  it("throws when enrollment does not exist", async () => {
    mockDb.enrollment.findUnique.mockResolvedValue(null)

    await expect(withdrawStudent("student-1", "class-1")).rejects.toThrow(
      "No enrollment found for student student-1 in class class-1"
    )
  })
})
