import { describe, it, expect, vi, beforeEach } from "vitest"

// ── Mocks ───────────────────────────────────────────────────────────────────

const mockDb = {
  attendanceRecord: {
    upsert: vi.fn(),
  },
  $transaction: vi.fn(),
}

vi.mock("@/lib/db", () => ({ db: mockDb }))
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))

const { markAttendance, bulkMarkAttendance } = await import(
  "@/lib/actions/attendance"
)

// ── markAttendance ──────────────────────────────────────────────────────────

describe("markAttendance", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("upserts an attendance record with correct composite key", async () => {
    mockDb.attendanceRecord.upsert.mockResolvedValue({})

    await markAttendance("class-1", "student-1", "2026-04-01", "present")

    expect(mockDb.attendanceRecord.upsert).toHaveBeenCalledWith({
      where: {
        classId_studentId_date: {
          classId: "class-1",
          studentId: "student-1",
          date: expect.any(Date),
        },
      },
      update: {
        status: "present",
        markedAt: expect.any(Date),
      },
      create: expect.objectContaining({
        classId: "class-1",
        studentId: "student-1",
        status: "present",
        markedBy: "system",
      }),
    })
  })

  it("handles absent status", async () => {
    mockDb.attendanceRecord.upsert.mockResolvedValue({})

    await markAttendance("class-1", "student-2", "2026-04-01", "absent")

    expect(mockDb.attendanceRecord.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({ status: "absent" }),
      })
    )
  })
})

// ── bulkMarkAttendance ──────────────────────────────────────────────────────

describe("bulkMarkAttendance", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("creates upsert operations in a transaction for all records", async () => {
    mockDb.$transaction.mockResolvedValue([])

    const records = [
      { studentId: "s1", status: "present" },
      { studentId: "s2", status: "absent" },
      { studentId: "s3", status: "tardy" },
    ]

    await bulkMarkAttendance("class-1", "2026-04-01", records)

    // $transaction receives an array of upsert promises
    expect(mockDb.$transaction).toHaveBeenCalledTimes(1)
    const transactionArg = mockDb.$transaction.mock.calls[0][0]
    expect(transactionArg).toHaveLength(3)
  })

  it("handles empty records array", async () => {
    mockDb.$transaction.mockResolvedValue([])

    await bulkMarkAttendance("class-1", "2026-04-01", [])

    expect(mockDb.$transaction).toHaveBeenCalledWith([])
  })
})
