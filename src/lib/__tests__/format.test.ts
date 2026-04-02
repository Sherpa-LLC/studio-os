import { describe, it, expect, vi, afterEach } from "vitest"
import {
  formatCurrency,
  formatDate,
  formatPhone,
  formatPercent,
  formatAge,
  getInitials,
  getCapacityStatus,
  getCapacityColor,
  formatTime,
} from "../format"

// ── formatCurrency ─────────────────────────────────────────────────────────────

describe("formatCurrency", () => {
  it("formats a positive whole number", () => {
    expect(formatCurrency(1234)).toBe("$1,234.00")
  })

  it("formats a positive decimal", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50")
  })

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0.00")
  })

  it("formats a negative number", () => {
    expect(formatCurrency(-50)).toBe("-$50.00")
  })

  it("rounds to two decimal places", () => {
    expect(formatCurrency(19.999)).toBe("$20.00")
  })

  it("formats large numbers with commas", () => {
    expect(formatCurrency(1_000_000)).toBe("$1,000,000.00")
  })

  it("formats small cents correctly", () => {
    expect(formatCurrency(0.01)).toBe("$0.01")
  })
})

// ── formatDate ─────────────────────────────────────────────────────────────────

describe("formatDate", () => {
  it("formats a standard ISO date", () => {
    expect(formatDate("2026-03-15")).toBe("Mar 15, 2026")
  })

  it("formats January 1st", () => {
    expect(formatDate("2026-01-01")).toBe("Jan 1, 2026")
  })

  it("formats December 31st", () => {
    expect(formatDate("2026-12-31")).toBe("Dec 31, 2026")
  })

  it("formats a leap day", () => {
    expect(formatDate("2024-02-29")).toBe("Feb 29, 2024")
  })
})

// ── formatPhone ────────────────────────────────────────────────────────────────

describe("formatPhone", () => {
  it("formats a 10-digit string", () => {
    expect(formatPhone("5551234567")).toBe("(555) 123-4567")
  })

  it("strips non-digit characters before formatting", () => {
    expect(formatPhone("555-123-4567")).toBe("(555) 123-4567")
    expect(formatPhone("(555) 123-4567")).toBe("(555) 123-4567")
    expect(formatPhone("555.123.4567")).toBe("(555) 123-4567")
  })

  it("returns original string if not 10 digits", () => {
    expect(formatPhone("12345")).toBe("12345")
  })

  it("returns original if too many digits", () => {
    expect(formatPhone("15551234567")).toBe("15551234567")
  })

  it("returns empty string unchanged", () => {
    expect(formatPhone("")).toBe("")
  })

  it("handles string with only non-digit characters", () => {
    expect(formatPhone("abc-def")).toBe("abc-def")
  })
})

// ── formatPercent ──────────────────────────────────────────────────────────────

describe("formatPercent", () => {
  it("converts a decimal to a percentage string", () => {
    expect(formatPercent(0.125)).toBe("12.5%")
  })

  it("treats values > 1 as already percentage-scale", () => {
    expect(formatPercent(12.5)).toBe("12.5%")
  })

  it("handles zero", () => {
    expect(formatPercent(0)).toBe("0.0%")
  })

  it("handles 1 as 100%", () => {
    expect(formatPercent(1)).toBe("100.0%")
  })

  it("handles -1 as -100%", () => {
    expect(formatPercent(-1)).toBe("-100.0%")
  })

  it("treats -0.5 as a decimal (multiplied by 100)", () => {
    expect(formatPercent(-0.5)).toBe("-50.0%")
  })

  it("does NOT multiply values > 1 (e.g., 50 stays 50)", () => {
    expect(formatPercent(50)).toBe("50.0%")
  })

  it("respects custom decimal places", () => {
    expect(formatPercent(0.12345, 2)).toBe("12.35%")
  })

  it("respects zero decimal places", () => {
    expect(formatPercent(0.126, 0)).toBe("13%")
  })
})

// ── formatAge ──────────────────────────────────────────────────────────────────

describe("formatAge", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("calculates age when birthday has already passed this year", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-06-15T12:00:00"))
    expect(formatAge("2018-01-15")).toBe(8)
  })

  it("calculates age when birthday has not yet passed this year", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-06-15T12:00:00"))
    expect(formatAge("2018-12-20")).toBe(7)
  })

  it("calculates age on the exact birthday", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-06-15T12:00:00"))
    expect(formatAge("2018-06-15")).toBe(8)
  })

  it("returns 0 for a baby born this year", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-06-15T12:00:00"))
    expect(formatAge("2026-03-01")).toBe(0)
  })

  it("returns 0 for a baby born today", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-06-15T12:00:00"))
    expect(formatAge("2026-06-15")).toBe(0)
  })
})

// ── getInitials ────────────────────────────────────────────────────────────────

describe("getInitials", () => {
  it("returns uppercase initials from two names", () => {
    expect(getInitials("John", "Doe")).toBe("JD")
  })

  it("handles lowercase input", () => {
    expect(getInitials("jane", "smith")).toBe("JS")
  })

  it("returns empty chars for empty strings", () => {
    // charAt(0) on empty string returns ""
    expect(getInitials("", "")).toBe("")
  })

  it("handles single-character names", () => {
    expect(getInitials("A", "B")).toBe("AB")
  })
})

// ── getCapacityStatus ──────────────────────────────────────────────────────────

describe("getCapacityStatus", () => {
  it('returns "available" when well below capacity', () => {
    expect(getCapacityStatus(5, 20)).toBe("available")
  })

  it('returns "available" at exactly 84% capacity', () => {
    // 84/100 = 0.84, just under 0.85 threshold
    expect(getCapacityStatus(84, 100)).toBe("available")
  })

  it('returns "nearly-full" at exactly 85% capacity', () => {
    expect(getCapacityStatus(85, 100)).toBe("nearly-full")
  })

  it('returns "nearly-full" at 99% capacity', () => {
    expect(getCapacityStatus(99, 100)).toBe("nearly-full")
  })

  it('returns "full" when enrolled equals capacity', () => {
    expect(getCapacityStatus(20, 20)).toBe("full")
  })

  it('returns "full" when over capacity', () => {
    expect(getCapacityStatus(25, 20)).toBe("full")
  })

  it('returns "available" when enrolled is 0', () => {
    expect(getCapacityStatus(0, 20)).toBe("available")
  })

  it('returns "full" when both are 0 (0/0)', () => {
    // 0 >= 0 is true
    expect(getCapacityStatus(0, 0)).toBe("full")
  })
})

// ── getCapacityColor ───────────────────────────────────────────────────────────

describe("getCapacityColor", () => {
  it('returns emerald classes for "available"', () => {
    expect(getCapacityColor("available")).toBe("text-emerald-600 bg-emerald-50")
  })

  it('returns amber classes for "nearly-full"', () => {
    expect(getCapacityColor("nearly-full")).toBe("text-amber-600 bg-amber-50")
  })

  it('returns red classes for "full"', () => {
    expect(getCapacityColor("full")).toBe("text-red-600 bg-red-50")
  })
})

// ── formatTime ─────────────────────────────────────────────────────────────────

describe("formatTime", () => {
  it('formats afternoon time: "15:30" -> "3:30 PM"', () => {
    expect(formatTime("15:30")).toBe("3:30 PM")
  })

  it('formats morning time: "09:00" -> "9:00 AM"', () => {
    expect(formatTime("09:00")).toBe("9:00 AM")
  })

  it('formats midnight: "00:00" -> "12:00 AM"', () => {
    expect(formatTime("00:00")).toBe("12:00 AM")
  })

  it('formats noon: "12:00" -> "12:00 PM"', () => {
    expect(formatTime("12:00")).toBe("12:00 PM")
  })

  it('formats 1 AM: "01:05" -> "1:05 AM"', () => {
    expect(formatTime("01:05")).toBe("1:05 AM")
  })

  it('formats 11 PM: "23:59" -> "11:59 PM"', () => {
    expect(formatTime("23:59")).toBe("11:59 PM")
  })

  it('formats single-digit minutes with leading zero: "8:5" -> "8:05 AM"', () => {
    expect(formatTime("8:5")).toBe("8:05 AM")
  })
})
