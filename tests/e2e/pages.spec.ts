import { test, expect } from "./fixtures"

// ---------------------------------------------------------------------------
// Helper: assert no server error rendered on the page
// ---------------------------------------------------------------------------
async function assertNoError(page: import("@playwright/test").Page) {
  const body = page.locator("body")
  await expect(body).not.toContainText("Internal Server Error")
  await expect(body).not.toContainText("Application error")
}

// ---------------------------------------------------------------------------
// Helper: find first heading matching the name pattern.
// Admin pages often render two h1s (Header bar + PageHeader content), so we
// use .first() to avoid strict-mode violations in this smoke test suite.
// ---------------------------------------------------------------------------
function heading(page: import("@playwright/test").Page, name: RegExp) {
  return page.getByRole("heading", { name }).first()
}

// ===========================================================================
// Admin pages (default role — use adminPage fixture)
// ===========================================================================

test.describe("Admin pages", () => {
  test("dashboard loads with stat cards", async ({ adminPage }) => {
    await adminPage.goto("/dashboard")
    await expect(heading(adminPage, /dashboard/i)).toBeVisible()
    await expect(adminPage.locator("[data-slot=card]").first()).toBeVisible()
    await assertNoError(adminPage)
  })

  test("classes page", async ({ adminPage }) => {
    await adminPage.goto("/classes")
    await expect(heading(adminPage, /class catalog/i)).toBeVisible()
    await expect(adminPage.locator("[data-slot=card]").first()).toBeVisible()
    await assertNoError(adminPage)
  })

  test("classes/new page has form", async ({ adminPage }) => {
    await adminPage.goto("/classes/new")
    await expect(heading(adminPage, /add new class/i)).toBeVisible()
    await expect(adminPage.locator("input").first()).toBeVisible()
    await assertNoError(adminPage)
  })

  test("households page", async ({ adminPage }) => {
    await adminPage.goto("/households")
    await expect(heading(adminPage, /households/i)).toBeVisible()
    await expect(adminPage.locator("table tbody tr").first()).toBeVisible()
    await assertNoError(adminPage)
  })

  test("household detail — hh-001 Anderson", async ({ adminPage }) => {
    await adminPage.goto("/households/hh-001")
    await expect(heading(adminPage, /anderson/i)).toBeVisible()
    await assertNoError(adminPage)
  })

  test("billing page", async ({ adminPage }) => {
    await adminPage.goto("/billing")
    await expect(heading(adminPage, /billing/i)).toBeVisible()
    await expect(adminPage.locator("[data-slot=card]").first()).toBeVisible()
    await assertNoError(adminPage)
  })

  test("billing detail — hh-001", async ({ adminPage }) => {
    await adminPage.goto("/billing/hh-001")
    await expect(adminPage.getByText("Anderson").first()).toBeVisible()
    await assertNoError(adminPage)
  })

  test("CRM page", async ({ adminPage }) => {
    await adminPage.goto("/crm")
    await expect(heading(adminPage, /lead pipeline/i)).toBeVisible()
    await assertNoError(adminPage)
  })

  test("conversations page", async ({ adminPage }) => {
    await adminPage.goto("/conversations")
    await expect(heading(adminPage, /conversations/i)).toBeVisible()
    await assertNoError(adminPage)
  })

  test("conversation templates page", async ({ adminPage }) => {
    await adminPage.goto("/conversations/templates")
    await expect(adminPage.locator("[data-slot=card]").first()).toBeVisible()
    await assertNoError(adminPage)
  })

  test("communications page", async ({ adminPage }) => {
    await adminPage.goto("/communications")
    await expect(heading(adminPage, /messages/i)).toBeVisible()
    await assertNoError(adminPage)
  })

  test("staff page", async ({ adminPage }) => {
    await adminPage.goto("/staff")
    await expect(heading(adminPage, /staff/i)).toBeVisible()
    await assertNoError(adminPage)
  })

  test("staff subs page", async ({ adminPage }) => {
    await adminPage.goto("/staff/subs")
    await expect(heading(adminPage, /sub management/i)).toBeVisible()
    await assertNoError(adminPage)
  })

  test("seasons page", async ({ adminPage }) => {
    await adminPage.goto("/seasons")
    await expect(heading(adminPage, /seasons/i)).toBeVisible()
    await assertNoError(adminPage)
  })

  test("seasons rollover page", async ({ adminPage }) => {
    await adminPage.goto("/seasons/rollover")
    await expect(heading(adminPage, /rollover/i)).toBeVisible()
    await assertNoError(adminPage)
  })

  test("recitals page", async ({ adminPage }) => {
    await adminPage.goto("/recitals")
    await expect(heading(adminPage, /recitals/i)).toBeVisible()
    await assertNoError(adminPage)
  })

  test("competition page", async ({ adminPage }) => {
    await adminPage.goto("/competition")
    await expect(heading(adminPage, /competition teams/i)).toBeVisible()
    await assertNoError(adminPage)
  })

  test("insights page", async ({ adminPage }) => {
    await adminPage.goto("/insights")
    await expect(heading(adminPage, /insights/i)).toBeVisible()
    await assertNoError(adminPage)
  })

  test("knowledge base page", async ({ adminPage }) => {
    await adminPage.goto("/knowledge-base")
    await expect(heading(adminPage, /knowledge base/i)).toBeVisible()
    await assertNoError(adminPage)
  })

  test("automations page", async ({ adminPage }) => {
    await adminPage.goto("/automations")
    await expect(heading(adminPage, /automations/i)).toBeVisible()
    await assertNoError(adminPage)
  })

  test("reviews page", async ({ adminPage }) => {
    await adminPage.goto("/reviews")
    await expect(heading(adminPage, /reputation/i)).toBeVisible()
    await assertNoError(adminPage)
  })

  test("studio financials page", async ({ adminPage }) => {
    await adminPage.goto("/studio-financials")
    await expect(heading(adminPage, /studio financials/i)).toBeVisible()
    await expect(adminPage.locator("[data-slot=card]").first()).toBeVisible()
    await assertNoError(adminPage)
  })

  test("attendance page", async ({ adminPage }) => {
    await adminPage.goto("/attendance")
    await expect(heading(adminPage, /attendance/i)).toBeVisible()
    await assertNoError(adminPage)
  })
})

// ===========================================================================
// Parent pages (use parentPage fixture — switches role first)
// ===========================================================================

test.describe("Parent pages", () => {
  test.skip("portal home", async ({ parentPage }) => {
    // parentPage fixture already navigates to /portal
    await expect(parentPage.getByText(/enrolled|classes|welcome/i).first()).toBeVisible({ timeout: 10000 })
    await assertNoError(parentPage)
  })

  test("portal schedule", async ({ parentPage }) => {
    await parentPage.goto("/portal/schedule")
    await expect(heading(parentPage, /my schedule/i)).toBeVisible()
    await assertNoError(parentPage)
  })

  test("portal billing", async ({ parentPage }) => {
    await parentPage.goto("/portal/billing")
    await expect(heading(parentPage, /my billing/i)).toBeVisible()
    await assertNoError(parentPage)
  })

  test("portal household", async ({ parentPage }) => {
    await parentPage.goto("/portal/household")
    await expect(heading(parentPage, /my household/i)).toBeVisible()
    await assertNoError(parentPage)
  })

  test("portal messages", async ({ parentPage }) => {
    await parentPage.goto("/portal/messages")
    await expect(heading(parentPage, /messages/i)).toBeVisible()
    await assertNoError(parentPage)
  })

  test("registration wizard", async ({ parentPage }) => {
    await parentPage.goto("/register")
    await expect(heading(parentPage, /create account/i)).toBeVisible()
    await assertNoError(parentPage)
  })
})
