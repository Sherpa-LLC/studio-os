import { test as base, expect, type Page } from "@playwright/test"

type Account = {
  email: string
  password: string
  role: string
  redirectTo: string
}

const ACCOUNTS: Record<string, Account> = {
  admin: { email: "vicki@studioos.com", password: "password123", role: "admin", redirectTo: "/dashboard" },
  office: { email: "pam@studioos.com", password: "password123", role: "office", redirectTo: "/households" },
  coach: { email: "sarah@studioos.com", password: "password123", role: "attendance", redirectTo: "/attendance" },
  parent: { email: "jennifer@studioos.com", password: "password123", role: "parent", redirectTo: "/portal" },
}

async function signIn(page: Page, role: keyof typeof ACCOUNTS) {
  const account = ACCOUNTS[role]
  // Clear any existing session first
  await page.context().clearCookies()
  // Sign in via API to get session cookie
  const response = await page.request.post("/api/auth/sign-in/email", {
    data: { email: account.email, password: account.password },
  })
  expect(response.ok()).toBeTruthy()
  return account
}

async function signOut(page: Page) {
  await page.request.post("/api/auth/sign-out")
}

// Extended test fixture with auth helpers
export const test = base.extend<{
  adminPage: Page
  parentPage: Page
  coachPage: Page
  officePage: Page
}>({
  adminPage: async ({ page }, use) => {
    await signIn(page, "admin")
    await use(page)
  },
  parentPage: async ({ page }, use) => {
    await signIn(page, "parent")
    await use(page)
  },
  coachPage: async ({ page }, use) => {
    await signIn(page, "coach")
    await use(page)
  },
  officePage: async ({ page }, use) => {
    await signIn(page, "office")
    await use(page)
  },
})

export { expect, ACCOUNTS, signIn, signOut }
