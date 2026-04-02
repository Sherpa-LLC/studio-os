# Studio OS Prototype Phase 2 — Design Spec

**Date:** 2026-03-31
**Author:** Dylan Wilcox + Claude
**Status:** Approved
**Scope:** 5 features to strengthen the clickable prototype for Vicki Wallace demo

---

## Context

Studio OS is a clickable Next.js prototype (mock data, no backend) for a dance studio management SaaS. The PRD identifies Premiere Dance Studio (1,000+ students) as the design partner, with Vicki Wallace as primary stakeholder. These 5 features address the highest-impact gaps between the current prototype and what Vicki needs to see in a demo — particularly the tuition override system (her #1 pain point), class profitability (her #1 unanswered question), and season rollover (the most complex operational workflow).

---

## Feature 1: Inline Invoice Overrides

### Problem
The billing detail page has an override system, but it lives in a separate Overrides tab with a dialog form. Overrides should happen where the numbers are — directly on the invoice line items.

### Design

**Location:** `/billing/[householdId]` — existing billing detail page, invoice line items table.

**Interaction:**
- Each line item amount renders as a clickable element (styled button that looks like a number). On hover: subtle underline or pencil icon appears.
- **Click** → cell swaps to edit mode:
  - Input field pre-filled with current amount
  - "Reason" text input below it
  - Save / Cancel buttons
- **Save** → creates an override record in local state. Cell returns to display mode.
- **Display after override:**
  - Original amount shown with strikethrough in muted text
  - New amount in bold
  - Small "Override" badge on the row
  - Hovering the badge shows tooltip: who, when, reason
- **Invoice total recalculates** visually when override applied.

**Overrides tab:** Becomes read-only chronological audit log. Remove the "Add Override" dialog — all overrides now originate inline.

**Data model:** No changes. `InvoiceLineItem` already has optional `override?: BillingOverride`. `BillingOverride` already has `originalAmount`, `newAmount`, `reason`, `createdBy`, `createdAt`.

**State:** Local React state tracks `editingLineItemId: string | null` and pending override values. On save, override gets merged into the line items array in client state.

---

## Feature 2: Add Class Page

### Problem
The current "Add Class" button opens a sheet that's too simple. Classes need multi-day schedules (e.g., M/W/F with different rooms per day), class types for billing, and enough fields to represent a real class.

### Design

**Route:** `src/app/(admin)/classes/new/page.tsx` — full page, not a sheet.

**Layout:** Single scrollable page with 4 sections. Sticky bottom bar with "Create Class" and "Cancel" buttons.

**Section A — Basic Info:**
- Class name (text input)
- Discipline (select — 9 disciplines from constants)
- Age group (select — 6 groups from constants)
- Class type (select — Regular, Trial, Drop-in, Camp)
- Description (textarea, optional)

**Section B — Schedule:**
Dynamic list of schedule slots. Each slot is an independent card/row:
- Day (select — Mon–Sat)
- Start time (time input)
- End time (time input)
- Room (select — Studio A/B/C/D)
- Remove button (trash icon, minimum 1 slot required)

"+ Add Another Day" button appends a new empty slot.

Example for a M/W/F class:
```
Monday    4:00 PM – 5:00 PM   Studio A   [×]
Wednesday 4:00 PM – 5:00 PM   Studio B   [×]
Friday    4:00 PM – 5:00 PM   Studio A   [×]
[+ Add Another Day]
```

**Section C — Details:**
- Instructor (select — from instructors data)
- Capacity (number input)
- Age range: min / max (two number inputs)
- Monthly rate (currency input)
- Season (select)

**Section D — Review:**
Summary card showing everything before submission: name, discipline badge, full schedule list, instructor, capacity, rate. Confirm before creating.

**Navigation:** "Add Class" button on `/classes` links to `/classes/new`. Back button returns to `/classes`.

### Breaking Change: Schedule Data Model

The `Class` type's `schedule` field changes from a single object to an array:

```typescript
// Before
schedule: {
  day: DayOfWeek
  startTime: string
  endTime: string
  room: "Studio A" | "Studio B" | "Studio C" | "Studio D"
}

// After
schedule: {
  day: DayOfWeek
  startTime: string
  endTime: string
  room: "Studio A" | "Studio B" | "Studio C" | "Studio D"
}[]
```

**Impact:** Every file that reads `cls.schedule.day` must change to `cls.schedule[0].day` or iterate the array. Affected files:
- `src/lib/types.ts` — type definition
- `src/data/classes.ts` — all mock data (wrap each schedule in `[]`)
- `src/app/(admin)/classes/page.tsx` — class cards (show primary day or all days)
- `src/app/(admin)/classes/[id]/page.tsx` — class detail
- `src/app/(admin)/attendance/page.tsx` — references schedule
- `src/app/(admin)/attendance/[classId]/page.tsx` — references schedule
- `src/app/(parent)/portal/schedule/page.tsx` — parent schedule view
- `src/app/(parent)/register/classes/page.tsx` — class selection during registration
- Any other file importing from classes data

Class cards on the catalog page should show the schedule compactly: "Mon, Wed, Fri · 4:00–5:00 PM" when times match, or list each day separately when they differ.

---

## Feature 3: Season Rollover Wizard

### Problem
Season rollover is the most complex operational workflow a studio runs. No prototype page exists for it. The PRD describes a multi-step process: notify families → auto-suggest placements → admin reviews → charge fees.

### Design

**Route:** `src/app/(admin)/rollover/page.tsx`

**Layout:** Centered content (max-w-4xl) with horizontal step indicator at top. Back/Next buttons at bottom. Linear progression — no skipping.

**Step 1 — Setup:**
- Source season (select, pre-filled: "Spring 2026")
- Target season name (text input: "Fall 2026")
- Target season dates (start/end date inputs)
- Rollover date (date input — when charges process, e.g., May 15, 2026)
- Registration fee (currency input, pre-filled: $50)
- Hourly rate for new season (currency input, pre-filled: $95)
- Summary: "Rolling over 1,024 active students from Spring 2026 → Fall 2026"

**Step 2 — Review Placements:**
Filterable/sortable table of every active student's proposed rollover:

| Student | Current Class(es) | Suggested Class(es) | Status | Actions |
|---------|------------------|---------------------|--------|---------|
| Emma Anderson | Ballet I - Minis | Ballet II - Juniors | Auto-matched | Accept / Change / Skip |

- **Auto-matching logic (mock):** Suggests next level in same discipline based on age progression. If student ages into new age group, suggests equivalent class in that group.
- **Status values:** "Auto-matched", "Age progression", "No match found" (amber), "Skipped" (gray)
- **Change action:** Inline select to pick a different target class
- **Bulk actions:** "Accept All", "Skip Graduated Seniors"
- **Filters:** Search by name, filter by discipline, filter by status
- **Footer summary:** "423 accepted · 12 needs review · 3 skipped · 586 remaining"

**Step 3 — Notifications:**
- Preview mock rollover email with merge fields: "Dear {{guardianName}}, {{childName}} has been placed in {{className}} for Fall 2026..."
- Channel: Email / SMS / Both (radio group)
- Timing: Send now / Schedule for date
- Recipient count: "Will notify 435 households covering 598 students"
- "Preview" button shows rendered sample email in a card

**Step 4 — Confirm & Charge:**
Summary dashboard:
- Students rolling over: 598
- Students skipped: 3
- Needs review: 12
- Households to notify: 435
- Registration fees: 435 × $50 = $21,750
- Projected monthly revenue: $56,810
- Rollover date: May 15, 2026

"Confirm Rollover" button → success state with checkmark: "Season rollover initiated. 435 households will be notified on [date]."

**New data:** `src/data/rollover.ts` — mock suggestions for ~20 students with a mix of auto-matched, age-progressed, and "no match" cases.

**Sidebar:** Add "Rollover" to Overview nav group (admin only), `RefreshCw` icon.

---

## Feature 4: Class Profitability

### Problem
Dashboard shows revenue but no costs, margins, or breakeven. Vicki can't answer "which classes are worth running?" without a manual spreadsheet.

### Design

**New data:** `src/data/class-profitability.ts`

```typescript
interface ClassFinancials {
  classId: string
  className: string
  discipline: string
  instructorName: string
  instructorPayRate: number
  instructorPayType: "hourly" | "per-class"
  hoursPerWeek: number
  weeksPerMonth: number           // ~4.3
  enrolledStudents: number
  monthlyRate: number
  monthlyRevenue: number          // students × rate
  monthlyInstructorCost: number   // payRate × hours × weeks
  monthlyOverhead: number         // total overhead / class count
  monthlyMargin: number           // revenue - instructor - overhead
  marginPercent: number
  breakeven: number               // students to cover costs
}
```

Monthly overhead: $18,500/mo (rent, utilities, insurance, front desk) divided evenly across active class count.

Mock data for ~20 classes with realistic margins — some highly profitable, a few below breakeven.

### View A — Dashboard "Profitability" Tab

Third tab alongside Overview and Lead Analytics.

**KPI cards:**
- Total Monthly Margin: $42,180 (+8.3%)
- Average Margin %: 44.7%
- Classes Below Breakeven: 3
- Highest Margin Class: "Hip Hop - Teens" (62%)

**Sortable table:**

| Class | Discipline | Students | Revenue | Instructor | Overhead | Margin | Margin % |
|-------|-----------|----------|---------|------------|----------|--------|----------|

Row colors: green (margin > 30%), amber (0–30%), red (negative). Clicking a row navigates to `/classes/[id]`.

### View B — Class Detail "Financials" Tab

New tab on `/classes/[id]`.

P&L breakdown card:
```
Revenue
  24 students × $90/mo                    $2,160

Costs
  Instructor: Coach Marcus
    $35/hr × 2 hrs/wk × 4.3 wks           -$301
  Overhead allocation                       -$620
                                          ──────
Net Margin                                 $1,239 (57.4%)

Breakeven: 11 students
Current: 24 (13 above breakeven)
```

**What-if slider:** Input for "If enrollment drops to ___" that recalculates margin in real time. Shows the tipping point visually.

---

## Feature 5: Student Breakdown KPI

### Problem
Dashboard shows "Active Students: 1,047" but Vicki can't distinguish paying from trial from waitlisted without running separate reports.

### Design

**Change to dashboard Overview tab — first KPI card.**

Before:
```
Active Students
1,047
↑ +4.2% vs last month
```

After:
```
Paying Students
1,024
12 trial · 11 waitlisted
↑ +4.2% vs last month
```

Hero number = paying only. Trial and waitlisted as secondary muted text. Title changes to "Paying Students."

**Data change:** Add to `DashboardStats`:
```typescript
payingStudents: number      // 1,024
trialStudents: number       // 12
waitlistedStudents: number  // 11
```

**Component change:** `StatCard` gets optional `subtitle?: string` prop rendered below value in `text-xs text-muted-foreground`.

---

## Implementation Order

Recommended build sequence based on dependencies:

1. **Student Breakdown KPI** — smallest change, quick win, touches StatCard
2. **Inline Invoice Overrides** — self-contained to billing detail page
3. **Schedule data model migration** — breaking change that must happen before Add Class page
4. **Add Class page** — depends on new schedule array type
5. **Class Profitability** — new data + dashboard tab + class detail tab
6. **Season Rollover Wizard** — largest feature, no dependencies on others

---

## Files Created/Modified Summary

### New Files
- `src/app/(admin)/classes/new/page.tsx`
- `src/app/(admin)/rollover/page.tsx`
- `src/data/rollover.ts`
- `src/data/class-profitability.ts`

### Modified Files
- `src/lib/types.ts` — `Class.schedule` becomes array, add `ClassFinancials`, add `DashboardStats` fields
- `src/data/classes.ts` — wrap all schedule objects in arrays
- `src/data/dashboard-stats.ts` — add student breakdown + profitability summary
- `src/components/dashboard/stat-card.tsx` — add `subtitle` prop
- `src/app/(admin)/dashboard/page.tsx` — student breakdown card, profitability tab
- `src/app/(admin)/billing/[householdId]/page.tsx` — inline override UI
- `src/app/(admin)/classes/page.tsx` — multi-day schedule display, link to /classes/new
- `src/app/(admin)/classes/[id]/page.tsx` — financials tab, multi-day schedule
- `src/app/(admin)/attendance/page.tsx` — schedule array access
- `src/app/(admin)/attendance/[classId]/page.tsx` — schedule array access
- `src/app/(parent)/portal/schedule/page.tsx` — schedule array access
- `src/app/(parent)/register/classes/page.tsx` — schedule array access
- `src/components/layout/app-sidebar.tsx` — add Rollover nav item

---

## Verification

After implementation:
1. `npx next build` — zero errors
2. Navigate every new and modified route in browser
3. Test inline override: click amount → edit → save → verify strikethrough + badge + tooltip
4. Test Add Class: add 3 schedule slots, verify review section renders all days
5. Test Rollover: walk through all 4 steps, verify accept/change/skip on placements
6. Test Profitability: dashboard tab sorts correctly, class detail what-if slider recalculates
7. Verify student breakdown shows paying/trial/waitlisted on dashboard
8. Verify existing pages still work after schedule migration (classes, attendance, portal)
