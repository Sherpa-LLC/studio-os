# Studio OS Prototype Completion — Design Spec

**Date:** 2026-03-31
**Author:** Dylan Wilcox + Claude
**Status:** Approved
**Supersedes:** `2026-03-31-prototype-phase2-design.md` (narrower scope — 5 features)
**Scope:** Complete prototype for Vicki Wallace demo — fill all MVP gaps + add Phase 2 features

---

## Context

Studio OS is a clickable Next.js prototype (mock data, no backend) for a dance studio management SaaS. The PRD identifies Premiere Dance Studio (1,000+ students) as the design partner, with Vicki Wallace as primary stakeholder.

The prototype is ~66% complete across the 9 MVP features. Several Phase 2 features (costume/recital, competition team, staff management, knowledge base) have no screens at all. This spec covers everything needed to make the prototype demo-ready with zero dead ends.

### Design Decisions

- **UI-complete prototype** — every page looks real, forms open and appear to work, but data doesn't persist. Buttons show success toasts.
- **Scripted demo paths** — pre-staged mock data tells the story of completed workflows. No state management needed.
- **Keep Phase 2+ features already built** (CRM, automations, conversations, reviews) — shows full vision.
- **Role switcher** in sidebar — dropdown to toggle between Admin and Parent views.

---

## Section 1: MVP Gap Fills

### 1.1 Attendance Roster Page

**Route:** `src/app/(admin)/attendance/[classId]/page.tsx`

**Layout:**
- Header: class name, discipline badge, today's date, instructor name, room
- Summary bar: "12 of 18 marked — 10 present, 2 late, 1 excused, 1 absent, 4 remaining"
- Student table:
  - Columns: student name, photo placeholder (avatar), status toggle, notes
  - Status: segmented button group per row — Present (green) / Absent (red) / Late (amber) / Excused (blue)
  - Pre-staged: ~60% marked Present, 2 Late, 1 Excused, rest unmarked (gray)
  - One pre-filled note: "Left early — parent pickup at 4:30"
- "Mark All Present" button at top (shows toast)
- "Save Attendance" button at bottom (shows success toast)
- Back link to `/attendance`

**Mock data:** Add attendance roster records to existing attendance data file, matching class IDs and student IDs from enrolled students.

---

### 1.2 Tuition Override UI & Audit Trail

**Location:** Household billing detail page — existing billing tab on `/households/[id]`

**Inline Override Interaction:**
- Each invoice line item amount has an "Adjust" button (pencil icon, visible on hover)
- Click opens a dialog:
  - Original amount (read-only, displayed)
  - New amount (editable input)
  - Reason dropdown: Courtesy Discount, Scholarship, Billing Error, Competition Team, Proration, Other
  - Free-text notes field
  - "Apply Override" button (toast: "Override applied")
- After override (pre-staged in mock data):
  - Original amount shown with strikethrough in muted text
  - New amount in bold
  - Small "Override" badge on the row
  - Hovering badge shows tooltip: who, when, reason

**Audit Trail Section:**
- Below invoices on the billing tab, a "Override History" section
- Table with columns: Date, Staff Member, Invoice, Original Amount, New Amount, Reason
- Pre-staged: 2-3 overrides visible:
  - "Pam (Office Admin) — Mar 1 invoice — $190 → $142.50 — Courtesy Discount (25% — returning family)"
  - "Vicki (Owner) — Feb 1 invoice — $285 → $0.00 — Scholarship — Full scholarship approved by board"
  - "Dina (Office Admin) — Jan 1 invoice — $380 → $350 — Billing Error — Duplicate class charge removed"
- No delete button on any override. Immutable log.

---

### 1.3 Communication Compose Page

**Route:** `src/app/(admin)/communications/compose/page.tsx` (may already exist as stub)

**Layout:**
- Two-column: compose form (left, wider), audience panel (right)

**Compose Form (left):**
- Channel selector: Email / SMS / Both (segmented toggle)
- Subject line input (for email)
- Rich text body area (textarea styled to look like an editor)
- Template picker: dropdown with 5 pre-built templates:
  - Snow Day Closure
  - Welcome New Family
  - Payment Reminder
  - Recital Reminder
  - Season Rollover Notice
- Selecting a template pre-fills subject and body
- "Send Now" and "Schedule for Later" buttons (both show toast)

**Audience Builder (right):**
- Segment dropdown: All Active Families, By Discipline, By Class, By Team, By Schedule (Tonight), Custom
- Selecting a segment shows relevant filter options:
  - By Discipline → discipline multi-select checkboxes
  - By Class → class search/select
  - By Team → team select
  - By Schedule → date picker + time range
- Recipient count: "47 families (62 students)" updates based on selection
- Recipient preview: scrollable list of first 10 family names

**Pre-staged state:** Snow day message drafted — audience set to "All classes tonight (Tuesday)", 47 recipients, SMS + Email selected. Body reads: "Due to winter weather, all evening classes tonight (Tuesday, March 31) are cancelled. Stay safe! Classes resume tomorrow."

---

### 1.4 Parent Portal Sub-Pages

#### Schedule (`/portal/schedule`)
- Week view calendar (Mon-Sat) showing the household's enrolled classes
- Color-coded by discipline (same palette as admin class catalog)
- Each block shows: class name, time, room, instructor, child name label
- Pre-staged for the mock parent household: 5 classes across 2 children
- Current day column highlighted
- "This Week" / "Next Week" toggle (visual only)

#### Billing (`/portal/billing`)
- Summary card at top: current balance ($0.00 — green "Paid in Full"), next payment date (Apr 1, 2026), payment method (Visa ending 4242)
- "Update Payment Method" button (dialog with card fields → toast)
- Invoice history table: last 3 months
  - Each row: date, amount, status badge (Paid/Pending), "View" button
  - Expandable row detail: line items per student per class
- Pre-staged: Jan paid, Feb paid, Mar paid — clean account

#### Household (`/portal/household`)
- Guardian info card: name, address, email, phone, "Edit" button (dialog pre-filled → toast)
- Children cards (one per child):
  - Name, DOB, age (auto-calculated), photo placeholder
  - Medical notes (allergic to latex — pre-staged)
  - Measurements: height, chest, waist, hips, inseam (pre-staged values)
  - Enrolled classes list with schedule
  - "Edit" button per child (dialog → toast)
- Emergency contact card: name, phone, relationship

#### Messages (`/portal/messages`)
- Inbox list: 6-8 received messages
- Each row: channel badge (Email/SMS), subject, preview text (truncated), date
- Click a message → expands inline or opens a detail view with full message body
- Pre-staged messages: snow day alert, recital costume info, spring schedule, payment confirmation, welcome message

---

### 1.5 Add/Edit Forms

All forms are dialogs/sheets that open on button click, show realistic fields, and close with a success toast on "Save." No data persistence.

#### Add Household Dialog
- Triggered from "Add Household" button on `/households`
- Fields: guardian first name, last name, email, phone, address (street, city, state, zip)
- "Add Child" sub-section (collapsible): child first name, last name, DOB
- Payment method: card number, expiry, CVV (masked inputs)
- "Save Household" button → toast: "Household created successfully"

#### Add/Edit Student Dialog
- Triggered from household detail page
- Fields: first name, last name, DOB, medical notes (textarea), enrollment status (select)
- Measurements section: height, chest, waist, hips, inseam (number inputs with unit labels)
- "Save Student" button → toast

#### Add Class Page (Full Page)

**Route:** `src/app/(admin)/classes/new/page.tsx` — full page, not a sheet.

**Layout:** Single scrollable page with 4 sections. Sticky bottom bar with "Create Class" and "Cancel" buttons.

**Section A — Basic Info:**
- Class name (text input)
- Discipline (select — 9 disciplines from constants)
- Age group (select — 6 groups from constants)
- Class type (select — Regular, Trial, Drop-in, Camp)
- Description (textarea, optional)

**Section B — Schedule:**
Dynamic list of schedule slots. Each slot is a card/row:
- Day (select — Mon–Sat)
- Start time (time input)
- End time (time input)
- Room (select — Studio A/B/C/D)
- Remove button (trash icon, minimum 1 slot required)

"+ Add Another Day" button appends a new empty slot. Example for a M/W/F class:
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
Summary card showing everything before submission. "Create Class" → toast.

**Navigation:** "Add Class" button on `/classes` links to `/classes/new`. Back button returns to `/classes`.

#### Breaking Change: Schedule Data Model

The `Class` type's `schedule` field changes from a single object to an array to support multi-day classes:

```typescript
// Before
schedule: { day: DayOfWeek; startTime: string; endTime: string; room: string }

// After
schedule: { day: DayOfWeek; startTime: string; endTime: string; room: string }[]
```

**Impact:** Every file that reads `cls.schedule.day` must change to `cls.schedule[0].day` or iterate the array. Affected files:
- `src/lib/types.ts` — type definition
- `src/data/classes.ts` — all mock data (wrap each schedule in `[]`)
- `src/app/(admin)/classes/page.tsx` — class cards
- `src/app/(admin)/attendance/page.tsx` — references schedule
- `src/app/(admin)/attendance/[classId]/page.tsx` — references schedule
- `src/app/(parent)/portal/schedule/page.tsx` — parent schedule view
- `src/app/(parent)/register/classes/page.tsx` — class selection during registration
- Any other file importing from classes data

Class cards should show multi-day schedules compactly: "Mon, Wed, Fri · 4:00–5:00 PM" when times match, or list each day separately when they differ.

---

### 1.7 Class Profitability (from Phase 2 spec)

#### Dashboard "Profitability" Tab

Third tab alongside Overview and Lead Analytics on `/dashboard`.

**KPI cards:**
- Total Monthly Margin: $42,180 (+8.3%)
- Average Margin %: 44.7%
- Classes Below Breakeven: 3
- Highest Margin Class: "Hip Hop - Teens" (62%)

**Sortable table:**

| Class | Discipline | Students | Revenue | Instructor | Overhead | Margin | Margin % |
|-------|-----------|----------|---------|------------|----------|--------|----------|

Row colors: green (margin > 30%), amber (0–30%), red (negative). Clicking a row navigates to `/classes/[id]`.

#### Class Detail "Financials" Tab

New tab on class detail page (if it exists) or on a new `/classes/[id]` page.

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

**What-if slider:** Input for "If enrollment drops to ___" that recalculates margin visually. Shows the tipping point.

**New data:** `src/data/class-profitability.ts` with `ClassFinancials` interface:
```typescript
interface ClassFinancials {
  classId: string
  className: string
  discipline: string
  instructorName: string
  instructorPayRate: number
  instructorPayType: "hourly" | "per-class"
  hoursPerWeek: number
  weeksPerMonth: number
  enrolledStudents: number
  monthlyRate: number
  monthlyRevenue: number
  monthlyInstructorCost: number
  monthlyOverhead: number
  monthlyMargin: number
  marginPercent: number
  breakeven: number
}
```

Monthly overhead: $18,500/mo divided evenly across active class count. Mock data for ~20 classes with realistic margins — some highly profitable, a few below breakeven.

---

### 1.8 Student Breakdown KPI (from Phase 2 spec)

**Change to dashboard Overview tab — first KPI card.**

Before: "Active Students: 1,047"

After:
```
Paying Students
1,024
12 trial · 11 waitlisted
↑ +4.2% vs last month
```

Hero number = paying only. Trial and waitlisted as secondary muted text. Title changes to "Paying Students."

Add to `DashboardStats`: `payingStudents`, `trialStudents`, `waitlistedStudents`. `StatCard` gets optional `subtitle?: string` prop.

---

### 1.6 Role Switcher

**Location:** Sidebar header area, below the Studio OS logo/name

**Design:**
- Dropdown showing current role with avatar icon
- Options: "Admin View" (shield icon) and "Parent View" (user icon)
- Selecting "Parent View" navigates to `/portal`
- Selecting "Admin View" navigates to `/dashboard`
- Visual indicator of current mode (active state on selected option)
- Subtle enough to not confuse the demo audience — it's a demo utility, not a user-facing feature

---

## Section 2: Costume & Recital Management

New nav section: "Recitals" with sparkle/star icon.

### 2.1 Recitals List

**Route:** `src/app/(admin)/recitals/page.tsx`

**Layout:**
- Card grid of recitals
- Each card: recital name, date, venue, status badge, participating class count, costume order progress bar
- Status badges: Planning (blue) / Ordering (amber) / Rehearsals (purple) / Show Week (red) / Completed (green)
- Pre-staged:
  - "Spring Showcase 2026" — June 14, 2026, Performing Arts Center, status "Ordering", 15 routines, 6/15 costumes received
  - "Winter Wonderland 2025" — Dec 13, 2025, Community Theater, status "Completed"
- "Create Recital" button → dialog: name, date, venue, participating classes (multi-select) → toast

### 2.2 Recital Detail

**Route:** `src/app/(admin)/recitals/[id]/page.tsx`

Tabbed layout for "Spring Showcase 2026":

#### Costumes Tab
- Table of routines: routine name, class name, discipline badge, costume name, supplier, unit cost, sale price, photo thumbnail, order status badge (Not Ordered / Ordered / Received / Distributed)
- Pre-staged: 10 routines — 3 Received, 4 Ordered, 2 Not Ordered, 1 Distributed
- Click a routine → costume detail sheet:
  - Costume photo (placeholder image)
  - Description, color, supplier name and contact
  - Size breakdown table: sizes needed based on enrolled students' measurements (S: 4, M: 8, L: 6, XL: 2)
  - Order status timeline
- "Place Order" button on Not Ordered items (toast: "Order placed with supplier")
- Alert banner: "2 students enrolled after measure week — measurements needed" with linked student names

#### Measurements Tab
- Table: student name, class/routine, height, chest, waist, hips, inseam, assigned size, measurement status
- Status: Complete (green) / Needs Update (amber) / Missing (red)
- Pre-staged: ~80% Complete, 2-3 Missing (red), 1 Needs Update (amber)
- "Record Measurements" button per student → dialog with measurement fields, pre-filled for existing → toast
- "Export for Supplier" button (toast: "Measurement report downloaded")

#### Lineup Tab
- Ordered list (numbered 1-15) of routines
- Each row: number, routine name, class name, discipline badge, estimated duration, student count
- Gap indicator between appearances for multi-routine students:
  - Green check + "3+ apart" = safe
  - Red warning + "Only 1 apart — costume change conflict" = problem
- Pre-staged conflict: one student in routines #4 and #6 (only 1 gap)
- Drag handles on each row (visual only — shows the concept of reordering)
- Constraint note at top: "Minimum 3 numbers between appearances for costume changes"
- "Export Lineup" and "Print Program" buttons (toast)

#### Financials Tab
- Summary cards: Total Costume Cost ($4,280), Total Revenue ($7,650), Profit Margin ($3,370 / 44%)
- Per-routine breakdown table: routine name, costume unit cost, quantity, total cost, sale price per student, total revenue, margin
- Costume fee charge config: "Charge to parent accounts on: April 15, 2026"
- Charge status: "42 of 48 families charged — 6 pending"

**Mock data:** New file `src/data/recitals.ts` with recital records, routines, costume entries, measurement snapshots, and lineup order.

---

## Section 3: Travel / Competition Team Module

New nav section: "Competition" with trophy icon.

### 3.1 Teams List

**Route:** `src/app/(admin)/competition/page.tsx`

**Layout:**
- Card grid of competition teams
- Each card: team name, discipline tags, age group, student count, head coach, season, upcoming competition count badge
- Pre-staged teams:
  - "Elite Competition Team" — Contemporary/Jazz, 12 students, Coach Marcus, 3 upcoming competitions
  - "Junior Competition Squad" — Jazz/Lyrical, 8 students, Coach Sarah, 2 upcoming competitions
  - "Twinkle Stars Mini Team" — Ballet/Tap, 10 students, Coach Lisa, 1 upcoming competition
- "Create Team" button → dialog: name, disciplines, age group, season, coaches, fee structure → toast

### 3.2 Team Detail

**Route:** `src/app/(admin)/competition/[id]/page.tsx`

Tabbed layout for "Elite Competition Team":

#### Roster Tab
- Student table: name, age, parent name, team fee status (Paid/Pending/Overdue), competition waiver (Signed/Not Signed)
- Pre-staged: 12 students — 10 Paid, 1 Pending, 1 Overdue. 11 waivers Signed, 1 Not Signed (flagged red)
- "Add to Team" button → dialog: search/select from enrolled students → toast
- Team-specific consent form status per student

#### Competitions Tab
- Table: competition name, date, location, entry deadline, status (Registered/Pending/Upcoming)
- Pre-staged:
  - "Starbound National Talent Competition" — Apr 26, Atlanta, Registered
  - "Dance Masters of America" — May 17, Orlando, Pending
  - "Showstopper Dance Competition" — Jun 7, Nashville, Upcoming
- Click a competition → detail sheet: event info, registered routines list, entry fees, travel logistics (hotel name, departure time, bus/carpool notes)
- "Register for Competition" button → dialog: event details, routine selection, entry fee → toast

#### Financials Tab
- Summary cards: Total Team Fees Collected ($28,800), Total Competition Costs ($8,450), Net Position (+$20,350)
- Per-competition cost breakdown table: competition name, entry fees, travel, hotel, costumes, total, per-student share
- Per-student fee table: student name, team fee ($2,400), competition fees, costume fees, total owed, total paid, balance
- Pre-staged: realistic numbers — most paid, 2 with outstanding balances

#### Communication Tab
- Team-specific message thread (mini communication view scoped to this team)
- Pre-staged messages:
  - "Starbound Travel Details — Bus departs 6:00 AM from studio parking lot"
  - "Extra rehearsal added — Saturday 2:00-4:00 PM"
  - "Costume fitting reminder — this Wednesday after class"
- "Message Team" button → opens compose with audience pre-set to this team → toast

**Mock data:** New file `src/data/competition.ts` with team records, competition events, roster links, financial records.

---

## Section 4: Season Rollover Automation

### 4.1 Seasons List

**Route:** `src/app/(admin)/seasons/page.tsx`

**Layout:**
- Table of seasons: name, date range, status badge (Active/Upcoming/Completed/Archived), class count, student count
- Pre-staged:
  - "Spring 2026" — Jan 6 – May 14, Active, 83 classes, 1,024 students
  - "Summer 2026" — Jun 2 – Jul 25, Upcoming, 0 classes, 0 students
  - "Fall 2025" — Aug 18 – Dec 19, Completed, 78 classes, 998 students
- "Create Season" button → dialog: name, start date, end date, registration fee, hourly rate → toast
- "Start Rollover" button on Active season row → navigates to rollover dashboard

**Nav:** Add "Seasons" to admin sidebar under a "Settings" or "Operations" group, calendar icon.

### 4.2 Rollover Dashboard

**Route:** `src/app/(admin)/seasons/rollover/page.tsx`

**Layout:** Centered content with horizontal step indicator at top.

**Progress Stepper:**
Configure → Notify Families → Review Responses → Confirm Placements → Charge Fees
Pre-staged at Step 3: "Review Responses"

**Configuration (Step 1 — completed, shown collapsed):**
- Source season: Spring 2026
- Target season: Summer 2026
- Rollover date: May 15, 2026
- Registration fee: $45
- Default: auto-rollover unless parent opts out
- Notification date: May 1, 2026

**Notification (Step 2 — completed, shown collapsed):**
- 50 households notified on May 1
- Channel: Email + SMS
- Template: rollover notification with class placement details

**Family Responses (Step 3 — current, expanded):**
- Summary cards: 50 notified, 38 confirmed (auto-rollover), 5 opted out, 4 requested changes, 3 no response
- Table of households with response status:
  - Confirmed → green check, shows suggested next-season classes
  - Opted Out → red, reason shown ("Moving out of area", "Taking summer off")
  - Change Requested → amber, shows current vs. requested ("Drop Hip Hop, add Contemporary")
  - No Response → gray, days since notification
- Filter by response status

**Class Placement Preview:**
- Table: next-season class name, students carrying over, new spots available, age-up conflicts
- Age-up flags: "3 students aging out of 5-6 group — suggested move to 7-8 Ballet" with student names

**Charge Preview (Step 4-5 — future, grayed out):**
- Projected: 38 registration fees x $45 = $1,710 + first month tuition
- Charge date: May 15, 2026
- "Run Charges" button (disabled)

**Mock data:** New file `src/data/rollover.ts` with household responses, class placement suggestions, age-up flags.

---

## Section 5: Staff & Instructor Management

New nav section: "Staff" with users icon.

### 5.1 Staff List

**Route:** `src/app/(admin)/staff/page.tsx`

**Layout:**
- Table: photo (avatar), name, role badge (Instructor/Assistant/Sub/Admin), disciplines (tag chips), classes assigned (count), weekly hours, pay rate, status (Active/On Leave/Inactive)
- Pre-staged: 12 staff — 8 instructors, 2 assistants, 2 available subs
- Filter by role and discipline
- "Add Staff Member" button → dialog: name, role, contact info, disciplines, pay rate, availability → toast

### 5.2 Staff Detail

**Route:** `src/app/(admin)/staff/[id]/page.tsx`

Tabbed layout:

#### Profile Tab
- Contact card: name, photo, phone, email, address, emergency contact
- Certifications: CPR (expires Aug 2026), First Aid, Dance Education — with expiry badges
- Hire date, years at studio
- "Edit Profile" button → dialog pre-filled → toast

#### Schedule Tab
- Weekly calendar grid (Mon-Sat) showing assigned classes
- Pre-staged: 6 classes across 4 days, color-coded by discipline
- Total: 12 weekly hours teaching
- Room assignments on each block

#### Classes & Pay Tab
- Table: class name, day/time, student count, pay per class, monthly total from that class
- Summary cards: Total Classes (6), Weekly Hours (12), Monthly Compensation ($2,160)
- Pay rate: $45/hour
- Revenue generated by their classes vs. compensation — instructor ROI metric

#### Availability Tab
- Weekly grid (Mon-Sat, morning/afternoon/evening blocks)
- Green = available, gray = unavailable
- Pre-staged: available most afternoons/evenings, unavailable mornings and Sundays

### 5.3 Sub Management

**Route:** `src/app/(admin)/staff/subs/page.tsx`

**Layout:**
- Available subs list: name, disciplines they cover, availability summary, phone, last subbed date
- Active sub request banner: "Ms. Rivera needs coverage for Tuesday 4:00 PM Jazz II"
  - Qualified subs below with availability match: green "Available", amber "Check Schedule", red "Unavailable"
  - "Request Sub" button per person (toast: "Sub request sent to Sarah Mitchell")
- Past sub history table: date, class, original instructor, sub, status (Covered/Cancelled)
- Pre-staged: 1 active request, 3 past assignments

**Mock data:** Extend existing instructor data or create `src/data/staff.ts` with staff profiles, certifications, availability grids, sub history.

---

## Section 6: Knowledge Base / Staff Hub

New nav section: "Knowledge Base" with book icon.

### 6.1 Knowledge Base Home

**Route:** `src/app/(admin)/knowledge-base/page.tsx`

**Layout:**
- Search bar at top (visual — doesn't filter, but looks functional)
- Category grid (cards with icons and article counts):
  - **Policies & Procedures** (8 articles) — dress code, attendance policy, parent handbook, late pickup
  - **Curriculum & Lesson Plans** (12 articles) — by discipline and age group
  - **Studio Operations** (6 articles) — opening/closing checklists, emergency procedures, front desk guide
  - **Sub Handbook** (4 articles) — expectations, roster access, pay process
  - **HR & Staff** (5 articles) — benefits, PTO, performance reviews
- "Recently Updated" sidebar: 3-4 articles with date and editor name
- "New Article" button → dialog: title, category, body textarea → toast

### 6.2 Article View

**Route:** `src/app/(admin)/knowledge-base/[id]/page.tsx`

**Pre-staged article:** "Opening Checklist — Front Desk"
- Breadcrumb: Knowledge Base > Studio Operations > Opening Checklist
- Rich text content: numbered checklist (10 items — unlock doors, turn on music, check schedule for subs, verify supplies, etc.)
- Metadata bar: last updated Mar 15, 2026, by Pam (Office Admin), category tag
- "Edit Article" button → opens textarea pre-filled with article content → toast on save
- "Related Articles" sidebar: 2-3 links to same-category articles

### 6.3 Curriculum View

**Route:** `src/app/(admin)/knowledge-base/curriculum/page.tsx`

**Layout:**
- Discipline tabs across top: Ballet, Jazz, Tap, Hip Hop, Contemporary, Tumbling
- Each discipline shows lesson plans grouped by level: Beginner, Intermediate, Advanced
- Pre-staged content for Ballet tab:
  - "Ballet I: Weeks 1-4 Barre Fundamentals" — objectives, warm-up sequence, across-the-floor progressions, cool-down
  - "Ballet II: Port de Bras & Adagio" — objectives, technique focus, combination descriptions
- Class linkage note: "Used in: Ballet I (Mon 4:00), Ballet I (Wed 4:00)"
- "Add Lesson Plan" button → dialog → toast

**Mock data:** New file `src/data/knowledge-base.ts` with articles, categories, and curriculum entries.

---

## Navigation Updates

Add to admin sidebar (`src/components/layout/app-sidebar.tsx`):

**Existing groups stay.** Add new items:

- Under existing nav or new "Programs" group:
  - Recitals (sparkle icon)
  - Competition (trophy icon)
- Under existing nav or new "Operations" group:
  - Staff (users icon)
  - Seasons (calendar icon)
  - Knowledge Base (book-open icon)
- Role switcher dropdown in sidebar header

---

## New Mock Data Files

| File | Contents |
|------|----------|
| `src/data/recitals.ts` | Recital records, routines, costumes, measurement snapshots, lineup order, financials |
| `src/data/competition.ts` | Teams, competition events, roster links, team financials, team messages |
| `src/data/rollover.ts` | Household responses, class placement suggestions, age-up flags, rollover config |
| `src/data/staff.ts` | Staff profiles (if not extending existing), certifications, availability, sub history |
| `src/data/knowledge-base.ts` | Articles, categories, curriculum/lesson plan content |
| `src/data/class-profitability.ts` | ClassFinancials records for ~20 classes with margins, breakeven |

---

## New Page Files Summary

| Route | File |
|-------|------|
| `/attendance/[classId]` | `src/app/(admin)/attendance/[classId]/page.tsx` |
| `/communications/compose` | `src/app/(admin)/communications/compose/page.tsx` |
| `/portal/schedule` | `src/app/(parent)/portal/schedule/page.tsx` |
| `/portal/billing` | `src/app/(parent)/portal/billing/page.tsx` |
| `/portal/household` | `src/app/(parent)/portal/household/page.tsx` |
| `/portal/messages` | `src/app/(parent)/portal/messages/page.tsx` |
| `/recitals` | `src/app/(admin)/recitals/page.tsx` |
| `/recitals/[id]` | `src/app/(admin)/recitals/[id]/page.tsx` |
| `/competition` | `src/app/(admin)/competition/page.tsx` |
| `/competition/[id]` | `src/app/(admin)/competition/[id]/page.tsx` |
| `/seasons` | `src/app/(admin)/seasons/page.tsx` |
| `/seasons/rollover` | `src/app/(admin)/seasons/rollover/page.tsx` |
| `/staff` | `src/app/(admin)/staff/page.tsx` |
| `/staff/[id]` | `src/app/(admin)/staff/[id]/page.tsx` |
| `/staff/subs` | `src/app/(admin)/staff/subs/page.tsx` |
| `/knowledge-base` | `src/app/(admin)/knowledge-base/page.tsx` |
| `/knowledge-base/[id]` | `src/app/(admin)/knowledge-base/[id]/page.tsx` |
| `/knowledge-base/curriculum` | `src/app/(admin)/knowledge-base/curriculum/page.tsx` |
| `/classes/new` | `src/app/(admin)/classes/new/page.tsx` |
| `/classes/[id]` | `src/app/(admin)/classes/[id]/page.tsx` (if not existing — needs Financials tab) |

**Total: 20 new pages + dialogs/forms on existing pages**

---

## Modified Existing Files

| File | Changes |
|------|---------|
| `src/components/layout/app-sidebar.tsx` | Add nav items for Recitals, Competition, Staff, Seasons, Knowledge Base + role switcher |
| `src/app/(admin)/households/[id]/page.tsx` | Add override UI on billing tab, add/edit student dialog |
| `src/app/(admin)/households/page.tsx` | Wire "Add Household" button to dialog |
| `src/app/(admin)/classes/page.tsx` | Wire "Add Class" button to sheet/dialog |
| `src/app/(admin)/communications/page.tsx` | Ensure "Compose" button links to compose page |
| `src/lib/types.ts` | Add types for Recital, Routine, Costume, CompetitionTeam, CompetitionEvent, Season, Rollover, StaffMember, Article, ClassFinancials. Change `Class.schedule` to array. |
| `src/data/classes.ts` | Wrap all schedule objects in arrays for multi-day support |
| `src/data/attendance.ts` | Add roster-level attendance records for detail page |
| `src/data/dashboard-stats.ts` | Add payingStudents, trialStudents, waitlistedStudents fields |
| `src/components/dashboard/stat-card.tsx` | Add optional `subtitle` prop |
| `src/app/(admin)/dashboard/page.tsx` | Student breakdown KPI + Profitability tab |

---

## Implementation Principles

1. **Toast on every action** — every "Save", "Create", "Send", "Apply" button shows a success toast. No data persistence needed.
2. **Pre-stage the story** — mock data should demonstrate completed workflows, not empty states. The data IS the demo.
3. **Consistent patterns** — new pages follow the same card grid / table / tabbed detail / dialog conventions used in existing pages.
4. **Use existing UI components** — badges, cards, tables, sheets, dialogs, tabs, avatars are already in the component library. Reuse them.
5. **No backend, no state management** — all data comes from static imports. Forms are visual only.

---

## Verification

After implementation:
1. `npx next build` — zero errors
2. Navigate every new route in browser — no dead ends
3. Click every button — appropriate toast or dialog appears
4. Role switcher toggles between admin and parent views
5. All existing pages still function correctly
6. Sidebar navigation includes all new sections
7. Mock data tells a coherent story across related pages (same students appear in attendance, costumes, competition rosters)
