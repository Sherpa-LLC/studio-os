import { test, expect, signIn, signOut, PASSWORD, ROLE_ACCOUNTS } from "./fixtures"

// ---------------------------------------------------------------------------
// Auth Flow Tests
// ---------------------------------------------------------------------------

test.describe("Authentication", () => {
  test.describe.configure({ mode: "serial" })
  test("login page renders", async ({ page }) => {
    await page.goto("/login")

    await expect(page.getByLabel("Email")).toBeVisible()
    await expect(page.getByLabel("Password")).toBeVisible()
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible()
  })

  test("successful login as admin", async ({ page }) => {
    await page.goto("/login")
    await page.getByLabel("Email").fill("vicki@studioos.com")
    await page.getByLabel("Password").fill(PASSWORD)
    await page.getByRole("button", { name: "Sign in" }).click()

    await page.waitForURL("/dashboard", { timeout: 15000 })
    await expect(page).toHaveURL("/dashboard")
  })

  test("successful login as parent", async ({ page }) => {
    await page.goto("/login")
    await page.getByLabel("Email").fill("jennifer@studioos.com")
    await page.getByLabel("Password").fill(PASSWORD)
    await page.getByRole("button", { name: "Sign in" }).click()

    await page.waitForURL("/portal", { timeout: 15000 })
    await expect(page).toHaveURL("/portal")
  })

  test("wrong password shows error", async ({ page }) => {
    await page.goto("/login")
    await page.getByLabel("Email").fill("vicki@studioos.com")
    await page.getByLabel("Password").fill("wrongpassword")
    await page.getByRole("button", { name: "Sign in" }).click()

    // Wait for the error message to appear
    const errorBox = page.locator("[class*='destructive']").first()
    await expect(errorBox).toBeVisible({ timeout: 10000 })
  })

  test("empty fields prevent submission via HTML5 validation", async ({ page }) => {
    await page.goto("/login")

    // Click submit without filling anything — HTML5 required attrs should prevent submission
    await page.getByRole("button", { name: "Sign in" }).click()

    // Should still be on the login page (form not submitted)
    await expect(page).toHaveURL("/login")
  })

  test("session persists after navigation and refresh", async ({ page }) => {
    await signIn(page, "admin")

    // Navigate to another page
    await page.goto("/classes")
    await page.waitForURL("/classes")

    // Refresh the page
    await page.reload()

    // Should still be on /classes, not redirected to /login
    await expect(page).toHaveURL("/classes")
  })

  test("sign out from admin sidebar", async ({ page }) => {
    await signIn(page, "admin")

    // Open the user dropdown in sidebar footer
    const sidebarFooter = page.locator("[data-sidebar='footer']")
    await sidebarFooter.getByRole("button").first().click()

    // Click "Sign out"
    await page.getByRole("menuitem", { name: /Sign out/i }).click()

    await page.waitForURL("/login", { timeout: 10000 })
    await expect(page).toHaveURL("/login")
  })

  test("unauthenticated redirect to login", async ({ page }) => {
    // Clear cookies to ensure no session
    await page.context().clearCookies()

    await page.goto("/dashboard")

    // Middleware should redirect to /login
    await page.waitForURL("/login", { timeout: 10000 })
    await expect(page).toHaveURL("/login")
  })
})

// ---------------------------------------------------------------------------
// RBAC Tests
// ---------------------------------------------------------------------------

test.describe("RBAC - Admin access", () => {
  test.describe.configure({ mode: "serial" })
  test.beforeEach(async ({ page }) => {
    await signIn(page, "admin")
  })

  test("admin accesses /dashboard", async ({ page }) => {
    await page.goto("/dashboard")
    await expect(page).toHaveURL("/dashboard")
  })

  test("admin accesses /billing", async ({ page }) => {
    await page.goto("/billing")
    await expect(page).toHaveURL("/billing")
  })

  test("admin accesses /studio-financials", async ({ page }) => {
    await page.goto("/studio-financials")
    await expect(page).toHaveURL("/studio-financials")
  })

  test("admin accesses /classes", async ({ page }) => {
    await page.goto("/classes")
    await expect(page).toHaveURL("/classes")
  })
})

test.describe("RBAC - Parent restrictions", () => {
  test.describe.configure({ mode: "serial" })
  test.beforeEach(async ({ page }) => {
    await signIn(page, "parent")
  })

  test("parent blocked from /dashboard", async ({ page }) => {
    await page.goto("/dashboard")
    // Middleware redirects non-admins to /login for admin-only routes
    await page.waitForURL("/login", { timeout: 10000 })
    await expect(page).toHaveURL("/login")
  })

  test("parent accesses /portal", async ({ page }) => {
    await page.goto("/portal")
    await expect(page).toHaveURL("/portal")
  })

  test("parent accesses /portal/schedule", async ({ page }) => {
    await page.goto("/portal/schedule")
    await expect(page).toHaveURL("/portal/schedule")
  })

  test("parent accesses /portal/billing", async ({ page }) => {
    await page.goto("/portal/billing")
    await expect(page).toHaveURL("/portal/billing")
  })
})

test.describe("RBAC - Coach access", () => {
  test.describe.configure({ mode: "serial" })
  test.beforeEach(async ({ page }) => {
    await signIn(page, "attendance")
  })

  test("coach accesses /attendance", async ({ page }) => {
    await page.goto("/attendance")
    await expect(page).toHaveURL("/attendance")
  })

  test("coach accesses /classes", async ({ page }) => {
    await page.goto("/classes")
    await expect(page).toHaveURL("/classes")
  })

  test("coach blocked from /dashboard", async ({ page }) => {
    await page.goto("/dashboard")
    await page.waitForURL("/login", { timeout: 10000 })
    await expect(page).toHaveURL("/login")
  })
})

test.describe("RBAC - Office access", () => {
  test.describe.configure({ mode: "serial" })
  test.beforeEach(async ({ page }) => {
    await signIn(page, "office")
  })

  test("office accesses /households", async ({ page }) => {
    await page.goto("/households")
    await expect(page).toHaveURL("/households")
  })

  test("office accesses /billing", async ({ page }) => {
    await page.goto("/billing")
    await expect(page).toHaveURL("/billing")
  })

  test("office accesses /conversations", async ({ page }) => {
    await page.goto("/conversations")
    await expect(page).toHaveURL("/conversations")
  })

  test("office blocked from /dashboard", async ({ page }) => {
    await page.goto("/dashboard")
    await page.waitForURL("/login", { timeout: 10000 })
    await expect(page).toHaveURL("/login")
  })
})
