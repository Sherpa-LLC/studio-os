import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest, NextResponse } from "next/server"

// ── Mocks ───────────────────────────────────────────────────────────────────

const mockGetSession = vi.fn()

vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession: mockGetSession } },
}))

vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}))

const { middleware } = await import("@/middleware")

// ── Helpers ─────────────────────────────────────────────────────────────────

function makeRequest(path: string): NextRequest {
  return new NextRequest(new URL(path, "http://localhost:3000"))
}

function isRedirect(response: NextResponse, target: string): boolean {
  const location = response.headers.get("location")
  if (!location) return false
  try {
    const url = new URL(location)
    return url.pathname === target
  } catch {
    return location === target
  }
}

function isPassThrough(response: NextResponse): boolean {
  // NextResponse.next() does not set a location header
  return !response.headers.get("location")
}

// ── Tests ───────────────────────────────────────────────────────────────────

describe("middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ── Public routes ───────────────────────────────────────────────────────

  describe("public routes", () => {
    it("allows /login without a session", async () => {
      mockGetSession.mockResolvedValue(null)
      const res = await middleware(makeRequest("/login"))
      expect(isPassThrough(res)).toBe(true)
    })

    it("allows /api/auth/callback without a session", async () => {
      mockGetSession.mockResolvedValue(null)
      const res = await middleware(makeRequest("/api/auth/callback"))
      expect(isPassThrough(res)).toBe(true)
    })
  })

  // ── No session → redirect to /login ─────────────────────────────────────

  describe("unauthenticated", () => {
    it("redirects to /login when there is no session", async () => {
      mockGetSession.mockResolvedValue(null)
      const res = await middleware(makeRequest("/dashboard"))
      expect(isRedirect(res, "/login")).toBe(true)
    })
  })

  // ── Admin role ──────────────────────────────────────────────────────────

  describe("admin role", () => {
    beforeEach(() => {
      mockGetSession.mockResolvedValue({ user: { role: "admin" } })
    })

    it("can access /dashboard", async () => {
      const res = await middleware(makeRequest("/dashboard"))
      expect(isPassThrough(res)).toBe(true)
    })

    it("can access /studio-financials", async () => {
      const res = await middleware(makeRequest("/studio-financials"))
      expect(isPassThrough(res)).toBe(true)
    })

    it("can access /billing", async () => {
      const res = await middleware(makeRequest("/billing"))
      expect(isPassThrough(res)).toBe(true)
    })

    it("can access /classes", async () => {
      const res = await middleware(makeRequest("/classes"))
      expect(isPassThrough(res)).toBe(true)
    })

    it("can access /portal", async () => {
      const res = await middleware(makeRequest("/portal"))
      expect(isPassThrough(res)).toBe(true)
    })
  })

  // ── Parent role ─────────────────────────────────────────────────────────

  describe("parent role", () => {
    beforeEach(() => {
      mockGetSession.mockResolvedValue({ user: { role: "parent" } })
    })

    it("can access /portal", async () => {
      const res = await middleware(makeRequest("/portal"))
      expect(isPassThrough(res)).toBe(true)
    })

    it("is blocked from /dashboard (admin-only)", async () => {
      const res = await middleware(makeRequest("/dashboard"))
      expect(isRedirect(res, "/login")).toBe(true)
    })

    it("is blocked from /billing (admin+office)", async () => {
      const res = await middleware(makeRequest("/billing"))
      expect(isRedirect(res, "/login")).toBe(true)
    })

    it("is blocked from /classes (staff route)", async () => {
      const res = await middleware(makeRequest("/classes"))
      expect(isRedirect(res, "/login")).toBe(true)
    })
  })

  // ── Attendance (coach) role ─────────────────────────────────────────────

  describe("attendance role", () => {
    beforeEach(() => {
      mockGetSession.mockResolvedValue({ user: { role: "attendance" } })
    })

    it("can access /attendance", async () => {
      const res = await middleware(makeRequest("/attendance"))
      expect(isPassThrough(res)).toBe(true)
    })

    it("can access /classes", async () => {
      const res = await middleware(makeRequest("/classes"))
      expect(isPassThrough(res)).toBe(true)
    })

    it("is blocked from /dashboard (admin-only)", async () => {
      const res = await middleware(makeRequest("/dashboard"))
      expect(isRedirect(res, "/login")).toBe(true)
    })

    it("is blocked from /billing (admin+office)", async () => {
      const res = await middleware(makeRequest("/billing"))
      expect(isRedirect(res, "/login")).toBe(true)
    })

    it("is redirected from /portal (parent+admin only)", async () => {
      const res = await middleware(makeRequest("/portal"))
      expect(isRedirect(res, "/dashboard")).toBe(true)
    })
  })

  // ── Office role ─────────────────────────────────────────────────────────

  describe("office role", () => {
    beforeEach(() => {
      mockGetSession.mockResolvedValue({ user: { role: "office" } })
    })

    it("can access /billing", async () => {
      const res = await middleware(makeRequest("/billing"))
      expect(isPassThrough(res)).toBe(true)
    })

    it("can access /households", async () => {
      const res = await middleware(makeRequest("/households"))
      expect(isPassThrough(res)).toBe(true)
    })

    it("can access /classes (staff route)", async () => {
      const res = await middleware(makeRequest("/classes"))
      expect(isPassThrough(res)).toBe(true)
    })

    it("is blocked from /dashboard (admin-only)", async () => {
      const res = await middleware(makeRequest("/dashboard"))
      expect(isRedirect(res, "/login")).toBe(true)
    })

    it("is blocked from /studio-financials (admin-only)", async () => {
      const res = await middleware(makeRequest("/studio-financials"))
      expect(isRedirect(res, "/login")).toBe(true)
    })

    it("is redirected from /portal (parent+admin only)", async () => {
      const res = await middleware(makeRequest("/portal"))
      expect(isRedirect(res, "/dashboard")).toBe(true)
    })
  })
})
