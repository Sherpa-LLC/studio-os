import { describe, it, expect, vi, afterEach } from "vitest"
import {
  dbToFrontend,
  frontendToDb,
  mapDiscipline,
  mapDisciplines,
  toPrismaDiscipline,
  mapAgeGroup,
  mapBillingType,
  mapStaffRole,
  toPrismaStaffRole,
  mapStaffStatus,
  mapRoom,
  mapSeasonStatus,
  mapHouseholdStatus,
  mapEnrollmentStatus,
  mapLeadStage,
  mapGuardianRelationship,
  mapGender,
  computeAge,
  toNumber,
  toISODate,
  toISODateTime,
  mapTemplateCategory,
  mapLeadSource,
} from "../enum-mappers"

// ── Generic converters ─────────────────────────────────────────────────────────

describe("dbToFrontend", () => {
  it("replaces underscores with hyphens", () => {
    expect(dbToFrontend("hip_hop")).toBe("hip-hop")
  })

  it("handles multiple underscores", () => {
    expect(dbToFrontend("a_b_c")).toBe("a-b-c")
  })

  it("returns the same string if no underscores", () => {
    expect(dbToFrontend("ballet")).toBe("ballet")
  })

  it("handles empty string", () => {
    expect(dbToFrontend("")).toBe("")
  })
})

describe("frontendToDb", () => {
  it("replaces hyphens with underscores", () => {
    expect(frontendToDb("hip-hop")).toBe("hip_hop")
  })

  it("handles multiple hyphens", () => {
    expect(frontendToDb("a-b-c")).toBe("a_b_c")
  })

  it("returns the same string if no hyphens", () => {
    expect(frontendToDb("ballet")).toBe("ballet")
  })

  it("handles empty string", () => {
    expect(frontendToDb("")).toBe("")
  })
})

// ── Discipline ─────────────────────────────────────────────────────────────────

describe("mapDiscipline", () => {
  const cases: Array<[string, string]> = [
    ["ballet", "ballet"],
    ["jazz", "jazz"],
    ["tap", "tap"],
    ["contemporary", "contemporary"],
    ["hip_hop", "hip-hop"],
    ["lyrical", "lyrical"],
    ["acro", "acro"],
    ["musical_theatre", "musical-theatre"],
    ["pointe", "pointe"],
  ]

  it.each(cases)("maps %s -> %s", (prisma, frontend) => {
    expect(mapDiscipline(prisma as any)).toBe(frontend)
  })
})

describe("mapDisciplines", () => {
  it("maps an array of disciplines", () => {
    expect(mapDisciplines(["hip_hop", "ballet"] as any[])).toEqual([
      "hip-hop",
      "ballet",
    ])
  })

  it("handles empty array", () => {
    expect(mapDisciplines([])).toEqual([])
  })
})

describe("toPrismaDiscipline", () => {
  it("converts hip-hop back to hip_hop", () => {
    expect(toPrismaDiscipline("hip-hop" as any)).toBe("hip_hop")
  })

  it("converts musical-theatre back to musical_theatre", () => {
    expect(toPrismaDiscipline("musical-theatre" as any)).toBe("musical_theatre")
  })

  it("leaves ballet unchanged", () => {
    expect(toPrismaDiscipline("ballet" as any)).toBe("ballet")
  })
})

describe("bidirectional discipline consistency", () => {
  const prismaValues = [
    "ballet", "jazz", "tap", "contemporary", "hip_hop",
    "lyrical", "acro", "musical_theatre", "pointe",
  ] as const

  it("round-trips every Prisma discipline through map and back", () => {
    for (const prisma of prismaValues) {
      const frontend = mapDiscipline(prisma as any)
      const backToPrisma = toPrismaDiscipline(frontend as any)
      expect(backToPrisma).toBe(prisma)
    }
  })
})

// ── AgeGroup ───────────────────────────────────────────────────────────────────

describe("mapAgeGroup", () => {
  const cases: Array<[string, string]> = [
    ["tiny_tots", "tiny-tots"],
    ["minis", "minis"],
    ["juniors", "juniors"],
    ["teens", "teens"],
    ["seniors", "seniors"],
    ["adults", "adults"],
  ]

  it.each(cases)("maps %s -> %s", (prisma, frontend) => {
    expect(mapAgeGroup(prisma as any)).toBe(frontend)
  })
})

// ── BillingType ────────────────────────────────────────────────────────────────

describe("mapBillingType", () => {
  const cases: Array<[string, string]> = [
    ["monthly", "monthly"],
    ["per_session", "per-session"],
    ["per_camp", "per-camp"],
  ]

  it.each(cases)("maps %s -> %s", (prisma, frontend) => {
    expect(mapBillingType(prisma as any)).toBe(frontend)
  })
})

// ── StaffRole ──────────────────────────────────────────────────────────────────

describe("mapStaffRole", () => {
  const cases: Array<[string, string]> = [
    ["instructor", "instructor"],
    ["assistant", "assistant"],
    ["sub", "sub"],
    ["staff_admin", "admin"],
  ]

  it.each(cases)("maps %s -> %s", (prisma, frontend) => {
    expect(mapStaffRole(prisma as any)).toBe(frontend)
  })
})

describe("toPrismaStaffRole", () => {
  const cases: Array<[string, string]> = [
    ["instructor", "instructor"],
    ["assistant", "assistant"],
    ["sub", "sub"],
    ["admin", "staff_admin"],
  ]

  it.each(cases)("maps %s -> %s", (frontend, prisma) => {
    expect(toPrismaStaffRole(frontend as any)).toBe(prisma)
  })
})

describe("bidirectional StaffRole consistency", () => {
  const prismaValues = ["instructor", "assistant", "sub", "staff_admin"] as const

  it("round-trips every Prisma StaffRole through map and back", () => {
    for (const prisma of prismaValues) {
      const frontend = mapStaffRole(prisma as any)
      const backToPrisma = toPrismaStaffRole(frontend as any)
      expect(backToPrisma).toBe(prisma)
    }
  })
})

// ── StaffStatus ────────────────────────────────────────────────────────────────

describe("mapStaffStatus", () => {
  const cases: Array<[string, string]> = [
    ["active", "active"],
    ["on_leave", "on-leave"],
    ["inactive", "inactive"],
  ]

  it.each(cases)("maps %s -> %s", (prisma, frontend) => {
    expect(mapStaffStatus(prisma as any)).toBe(frontend)
  })
})

// ── Room ───────────────────────────────────────────────────────────────────────

describe("mapRoom", () => {
  const cases: Array<[string, string]> = [
    ["studio_a", "Studio A"],
    ["studio_b", "Studio B"],
    ["studio_c", "Studio C"],
    ["studio_d", "Studio D"],
  ]

  it.each(cases)("maps %s -> %s", (prisma, display) => {
    expect(mapRoom(prisma as any)).toBe(display)
  })
})

// ── SeasonStatus ───────────────────────────────────────────────────────────────

describe("mapSeasonStatus", () => {
  const cases: Array<[string, string]> = [
    ["upcoming", "upcoming"],
    ["active", "active"],
    ["completed", "completed"],
  ]

  it.each(cases)("passes through %s unchanged", (prisma, frontend) => {
    expect(mapSeasonStatus(prisma as any)).toBe(frontend)
  })
})

// ── HouseholdStatus ────────────────────────────────────────────────────────────

describe("mapHouseholdStatus", () => {
  const cases: Array<[string, string]> = [
    ["active", "active"],
    ["inactive", "inactive"],
    ["archived", "archived"],
  ]

  it.each(cases)("passes through %s unchanged", (prisma, frontend) => {
    expect(mapHouseholdStatus(prisma as any)).toBe(frontend)
  })
})

// ── EnrollmentStatus ───────────────────────────────────────────────────────────

describe("mapEnrollmentStatus", () => {
  const cases: Array<[string, string]> = [
    ["active", "active"],
    ["waitlisted", "waitlisted"],
    ["trial", "trial"],
    ["withdrawn", "withdrawn"],
    ["graduated", "graduated"],
  ]

  it.each(cases)("passes through %s unchanged", (prisma, frontend) => {
    expect(mapEnrollmentStatus(prisma as any)).toBe(frontend)
  })
})

// ── LeadStage ──────────────────────────────────────────────────────────────────

describe("mapLeadStage", () => {
  const cases: Array<[string, string]> = [
    ["new_lead", "new"],
    ["contacted", "contacted"],
    ["trial_scheduled", "trial-scheduled"],
    ["trial_completed", "trial-completed"],
    ["registered", "registered"],
    ["lost", "lost"],
  ]

  it.each(cases)("maps %s -> %s", (prisma, frontend) => {
    expect(mapLeadStage(prisma as any)).toBe(frontend)
  })
})

// ── GuardianRelationship ───────────────────────────────────────────────────────

describe("mapGuardianRelationship", () => {
  const cases: Array<[string, string]> = [
    ["mother", "mother"],
    ["father", "father"],
    ["guardian", "guardian"],
    ["grandparent", "grandparent"],
    ["other", "other"],
  ]

  it.each(cases)("passes through %s unchanged", (prisma, frontend) => {
    expect(mapGuardianRelationship(prisma as any)).toBe(frontend)
  })
})

// ── Gender ─────────────────────────────────────────────────────────────────────

describe("mapGender", () => {
  const cases: Array<[string, string]> = [
    ["female", "female"],
    ["male", "male"],
    ["other", "other"],
  ]

  it.each(cases)("passes through %s unchanged", (prisma, frontend) => {
    expect(mapGender(prisma as any)).toBe(frontend)
  })
})

// ── mapTemplateCategory ────────────────────────────────────────────────────────

describe("mapTemplateCategory", () => {
  it("converts follow_up to follow-up", () => {
    expect(mapTemplateCategory("follow_up")).toBe("follow-up")
  })

  it("leaves general unchanged", () => {
    expect(mapTemplateCategory("general")).toBe("general")
  })

  it("handles empty string", () => {
    expect(mapTemplateCategory("")).toBe("")
  })
})

// ── mapLeadSource ──────────────────────────────────────────────────────────────

describe("mapLeadSource", () => {
  const cases: Array<[string, string]> = [
    ["website", "website"],
    ["walk_in", "walk-in"],
    ["referral", "referral"],
    ["trial", "trial"],
    ["social_media", "social-media"],
    ["phone", "phone"],
  ]

  it.each(cases)("maps %s -> %s", (prisma, frontend) => {
    expect(mapLeadSource(prisma as any)).toBe(frontend)
  })
})

// ── computeAge ─────────────────────────────────────────────────────────────────

describe("computeAge", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("computes age when birthday has already passed this year", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-06-15T12:00:00"))
    expect(computeAge(new Date("2018-01-15"))).toBe(8)
  })

  it("computes age when birthday has not yet passed this year", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-06-15T12:00:00"))
    expect(computeAge(new Date("2018-12-20"))).toBe(7)
  })

  it("computes age on the exact birthday", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-06-15T12:00:00"))
    expect(computeAge(new Date("2018-06-15"))).toBe(8)
  })

  it("returns 0 for a newborn born today", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-06-15T12:00:00"))
    expect(computeAge(new Date("2026-06-15"))).toBe(0)
  })

  it("handles leap year birthdays correctly", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-03-01T12:00:00"))
    // Born on Feb 29, 2020 — as of Mar 1, 2026, they are 6
    expect(computeAge(new Date("2020-02-29"))).toBe(6)
  })
})

// ── toNumber ───────────────────────────────────────────────────────────────────

describe("toNumber", () => {
  it("returns a number as-is", () => {
    expect(toNumber(42)).toBe(42)
  })

  it("converts a numeric string", () => {
    expect(toNumber("123.45")).toBe(123.45)
  })

  it("converts a Prisma Decimal-like object with toString", () => {
    const decimal = { toString: () => "99.99" }
    expect(toNumber(decimal)).toBe(99.99)
  })

  it("returns NaN for non-numeric string", () => {
    expect(toNumber("abc")).toBeNaN()
  })

  it("converts null to 0", () => {
    expect(toNumber(null)).toBe(0)
  })

  it("converts undefined to NaN", () => {
    expect(toNumber(undefined)).toBeNaN()
  })
})

// ── toISODate ──────────────────────────────────────────────────────────────────

describe("toISODate", () => {
  it("converts a Date to YYYY-MM-DD string", () => {
    const d = new Date("2026-03-15T10:30:00Z")
    expect(toISODate(d)).toBe("2026-03-15")
  })

  it("returns the UTC date portion even if local timezone differs", () => {
    // toISOString always returns UTC
    const d = new Date("2026-01-01T00:00:00Z")
    expect(toISODate(d)).toBe("2026-01-01")
  })
})

// ── toISODateTime ──────────────────────────────────────────────────────────────

describe("toISODateTime", () => {
  it("converts a Date to full ISO string", () => {
    const d = new Date("2026-03-15T10:30:00.000Z")
    expect(toISODateTime(d)).toBe("2026-03-15T10:30:00.000Z")
  })

  it("includes milliseconds", () => {
    const d = new Date("2026-06-01T23:59:59.999Z")
    expect(toISODateTime(d)).toBe("2026-06-01T23:59:59.999Z")
  })
})
