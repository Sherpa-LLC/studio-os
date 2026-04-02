import { test, expect } from "./fixtures"

// ---------------------------------------------------------------------------
// 1. Admin Sidebar Navigation
// ---------------------------------------------------------------------------
test.describe("Admin Navigation", () => {
  test("sidebar links navigate to correct pages", async ({ adminPage }) => {
    await adminPage.goto("/dashboard")
    await expect(adminPage).toHaveURL(/\/dashboard/)

    // Classes
    await adminPage.getByRole("link", { name: "Classes" }).click()
    await expect(adminPage).toHaveURL(/\/classes/)
    await expect(adminPage.getByText("Class Catalog")).toBeVisible()

    // Households
    await adminPage.getByRole("link", { name: "Households" }).click()
    await expect(adminPage).toHaveURL(/\/households/)
    await expect(adminPage.getByText("Manage family accounts")).toBeVisible()

    // Billing
    await adminPage.getByRole("link", { name: "Billing" }).click()
    await expect(adminPage).toHaveURL(/\/billing/)

    // Staff
    await adminPage.getByRole("link", { name: "Staff" }).click()
    await expect(adminPage).toHaveURL(/\/staff/)

    // Back to Dashboard
    await adminPage.getByRole("link", { name: "Dashboard" }).click()
    await expect(adminPage).toHaveURL(/\/dashboard/)
  })
})

// ---------------------------------------------------------------------------
// 2. Parent Header Navigation
// ---------------------------------------------------------------------------
test.describe("Parent Navigation", () => {
  test("header nav links navigate to correct pages", async ({ parentPage }) => {
    await parentPage.goto("/portal")
    await expect(parentPage).toHaveURL(/\/portal$/)

    // Enroll
    await parentPage.getByRole("link", { name: "Enroll" }).click()
    await expect(parentPage).toHaveURL(/\/portal\/enroll/)

    // Schedule
    await parentPage.getByRole("link", { name: "Schedule" }).click()
    await expect(parentPage).toHaveURL(/\/portal\/schedule/)

    // Billing
    await parentPage.getByRole("link", { name: "Billing" }).click()
    await expect(parentPage).toHaveURL(/\/portal\/billing/)

    // Household
    await parentPage.getByRole("link", { name: "Household" }).click()
    await expect(parentPage).toHaveURL(/\/portal\/household/)

    // Messages
    await parentPage.getByRole("link", { name: "Messages" }).click()
    await expect(parentPage).toHaveURL(/\/portal\/messages/)

    // Home (back to portal root)
    await parentPage.getByRole("link", { name: "Home" }).click()
    await expect(parentPage).toHaveURL(/\/portal$/)
  })
})

// ---------------------------------------------------------------------------
// 3. Classes Filter by Discipline
// ---------------------------------------------------------------------------
test.describe("Search and Filter", () => {
  test("classes page filters by discipline chip", async ({ adminPage }) => {
    await adminPage.goto("/classes")
    await expect(adminPage.getByText("Class Catalog")).toBeVisible()

    // The results summary shows total count before filtering
    const summaryBefore = adminPage.locator("text=/\\d+ of \\d+ class/")
    await expect(summaryBefore).toBeVisible()

    // Click "Ballet" discipline chip to filter
    await adminPage.getByRole("button", { name: "Ballet" }).click()

    // Verify a filter chip appeared in the active filters area
    await expect(adminPage.getByText("Ballet").first()).toBeVisible()

    // The filtered count should be visible
    const summaryAfter = adminPage.locator("text=/\\d+ of \\d+ class/")
    await expect(summaryAfter).toBeVisible()

    // Clear the filter by clicking the "All" chip
    await adminPage.getByRole("button", { name: "All" }).first().click()
  })

  // -------------------------------------------------------------------------
  // 4. Households Search
  // -------------------------------------------------------------------------
  test("households page filters by search", async ({ adminPage }) => {
    await adminPage.goto("/households")
    await expect(
      adminPage.getByRole("heading", { name: "Households" }).first()
    ).toBeVisible()

    // Get initial count from the results text
    const resultsText = adminPage.locator("text=/\\d+ household/")
    await expect(resultsText).toBeVisible()

    // Type in the search box
    const searchInput = adminPage.getByPlaceholder(
      "Search by name, email, or address..."
    )
    await searchInput.fill("Anderson")

    // Table should show filtered results — the Anderson family row should be visible
    await expect(
      adminPage.getByRole("link", { name: /Anderson Family/ })
    ).toBeVisible()
  })
})

// ---------------------------------------------------------------------------
// 5. Household Drill-down
// ---------------------------------------------------------------------------
test.describe("Detail Page Navigation", () => {
  test("clicking a household row opens the detail page", async ({
    adminPage,
  }) => {
    await adminPage.goto("/households")

    // Click the first household link in the table
    const firstHouseholdLink = adminPage
      .getByRole("link", { name: /Family/ })
      .first()
    const householdName = await firstHouseholdLink.textContent()
    await firstHouseholdLink.click()

    // Should navigate to a household detail URL
    await expect(adminPage).toHaveURL(/\/households\/hh-/)

    // The detail page should show the family name somewhere
    if (householdName) {
      const familySurname = householdName.replace(" Family", "")
      await expect(
        adminPage.getByText(familySurname).first()
      ).toBeVisible()
    }
  })

  // -------------------------------------------------------------------------
  // 6. Class Detail
  // -------------------------------------------------------------------------
  test("clicking a class card opens the detail page", async ({
    adminPage,
  }) => {
    await adminPage.goto("/classes")
    await expect(adminPage.getByText("Class Catalog")).toBeVisible()

    // Click the first class card link (cards are <a> elements wrapping <Card>)
    const firstClassLink = adminPage
      .locator('a[href^="/classes/cls-"]')
      .first()
    await expect(firstClassLink).toBeVisible()
    await firstClassLink.click()

    // Should navigate to a class detail URL
    await expect(adminPage).toHaveURL(/\/classes\/cls-/)

    // The detail page should show class detail tabs (Overview, Roster, Financials)
    await expect(adminPage.getByRole("tab", { name: "Roster" })).toBeVisible()
  })
})

// ---------------------------------------------------------------------------
// 7. Parent Portal Dashboard
// ---------------------------------------------------------------------------
test.describe("Parent Portal", () => {
  test("dashboard shows enrolled classes and upcoming section", async ({
    parentPage,
  }) => {
    await parentPage.goto("/portal")

    // Verify welcome message
    await expect(parentPage.getByText("Welcome back")).toBeVisible()

    // Verify quick stats cards are present
    await expect(parentPage.getByText("Active Classes")).toBeVisible()
    await expect(parentPage.getByText("Enrolled Children")).toBeVisible()

    // Verify Upcoming Classes section
    await expect(parentPage.getByText("Upcoming Classes")).toBeVisible()
    await expect(
      parentPage.getByRole("link", { name: /View Schedule/ })
    ).toBeVisible()

    // Verify Recent Messages section
    await expect(parentPage.getByText("Recent Messages")).toBeVisible()
  })

  // -------------------------------------------------------------------------
  // 8. Enroll Wizard — Step 1 to Step 2
  // -------------------------------------------------------------------------
  test("enroll wizard shows children on step 1 and classes after selecting a child", async ({
    parentPage,
  }) => {
    await parentPage.goto("/portal/enroll")

    // Step 1: Choose Child — should show the enrollment header
    await expect(parentPage.getByText("Enroll in Classes")).toBeVisible()
    await expect(parentPage.getByText("Choose Child")).toBeVisible()

    // Should show child cards (Anderson household has children)
    // Look for a child card with an age mention
    const childButton = parentPage
      .locator("button.group")
      .filter({ hasText: /Age \d+/ })
      .first()
    await expect(childButton).toBeVisible()

    // Get the child's name before clicking
    const childName = await childButton
      .locator("p.text-lg")
      .first()
      .textContent()

    // Click the first child
    await childButton.click()

    // Step 2: Browse Classes — should show classes for the selected child
    await expect(parentPage.getByText("Browse Classes")).toBeVisible()

    // The child context banner should show the selected child's name
    if (childName) {
      const firstName = childName.split(" ")[0]
      await expect(
        parentPage.getByText(new RegExp(`Showing classes for.*${firstName}`))
      ).toBeVisible()
    }

    // Class cards should be visible — look for price text (e.g. "$95.00/mo")
    // or the empty state message
    await expect(
      parentPage
        .getByText(/\$\d+\.\d{2}\/mo/)
        .first()
        .or(parentPage.getByText("No classes match your filters"))
    ).toBeVisible()
  })
})
