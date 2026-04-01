import type { BillingOverride, Invoice, PaymentStatus } from "@/lib/types"

// 3 months of invoices (Jan-Mar 2026) for active households
export const invoices: Invoice[] = [
  // ── hh-001: Anderson (2 kids, ~$395/mo) ─────────────────────────────────
  {
    id: "inv-001", householdId: "hh-001", date: "2026-01-01", dueDate: "2026-01-15",
    lineItems: [
      { id: "li-001a", studentId: "stu-001", classId: "cls-006", description: "Emma - Contemporary I Teens (Jan)", amount: 95 },
      { id: "li-001b", studentId: "stu-001", classId: "cls-019", description: "Emma - Lyrical II Teens (Jan)", amount: 95 },
      { id: "li-001c", studentId: "stu-001", classId: "cls-067", description: "Emma - Ballet III Juniors Sat (Jan)", amount: 95 },
      { id: "li-001d", studentId: "stu-002", classId: "cls-029", description: "Lily - Jazz II Juniors (Jan)", amount: 95 },
      { id: "li-001e", studentId: "stu-002", classId: "cls-054", description: "Lily - Contemporary II Juniors (Jan)", amount: 95 },
    ],
    subtotal: 475, total: 475, status: "paid", paidDate: "2026-01-12",
  },
  {
    id: "inv-002", householdId: "hh-001", date: "2026-02-01", dueDate: "2026-02-15",
    lineItems: [
      { id: "li-002a", studentId: "stu-001", classId: "cls-006", description: "Emma - Contemporary I Teens (Feb)", amount: 95 },
      { id: "li-002b", studentId: "stu-001", classId: "cls-019", description: "Emma - Lyrical II Teens (Feb)", amount: 95 },
      { id: "li-002c", studentId: "stu-001", classId: "cls-067", description: "Emma - Ballet III Juniors Sat (Feb)", amount: 95 },
      { id: "li-002d", studentId: "stu-002", classId: "cls-029", description: "Lily - Jazz II Juniors (Feb)", amount: 95 },
      { id: "li-002e", studentId: "stu-002", classId: "cls-054", description: "Lily - Contemporary II Juniors (Feb)", amount: 95 },
    ],
    subtotal: 475, total: 475, status: "paid", paidDate: "2026-02-14",
  },
  {
    id: "inv-003", householdId: "hh-001", date: "2026-03-01", dueDate: "2026-03-15",
    lineItems: [
      { id: "li-003a", studentId: "stu-001", classId: "cls-006", description: "Emma - Contemporary I Teens (Mar)", amount: 95 },
      { id: "li-003b", studentId: "stu-001", classId: "cls-019", description: "Emma - Lyrical II Teens (Mar)", amount: 95 },
      { id: "li-003c", studentId: "stu-001", classId: "cls-067", description: "Emma - Ballet III Juniors Sat (Mar)", amount: 95 },
      { id: "li-003d", studentId: "stu-002", classId: "cls-029", description: "Lily - Jazz II Juniors (Mar)", amount: 95 },
      { id: "li-003e", studentId: "stu-002", classId: "cls-054", description: "Lily - Contemporary II Juniors (Mar)", amount: 95 },
    ],
    subtotal: 475, total: 475, status: "paid", paidDate: "2026-03-10",
  },

  // ── hh-002: Garcia (3 kids, overdue balance $285) ───────────────────────
  {
    id: "inv-004", householdId: "hh-002", date: "2026-01-01", dueDate: "2026-01-15",
    lineItems: [
      { id: "li-004a", studentId: "stu-003", classId: "cls-021", description: "Sofia - Ballet IV Seniors (Jan)", amount: 142.5 },
      { id: "li-004b", studentId: "stu-003", classId: "cls-024", description: "Sofia - Pointe I Seniors (Jan)", amount: 71.25 },
      { id: "li-004c", studentId: "stu-003", classId: "cls-047", description: "Sofia - Comp Contemporary Seniors (Jan)", amount: 118.75 },
      { id: "li-004d", studentId: "stu-004", classId: "cls-009", description: "Camila - Ballet III Teens (Jan)", amount: 118.75 },
      { id: "li-004e", studentId: "stu-004", classId: "cls-020", description: "Camila - Contemporary II Teens (Jan)", amount: 118.75 },
      { id: "li-004f", studentId: "stu-004", classId: "cls-071", description: "Camila - Jazz III Teens Sat (Jan)", amount: 95 },
      { id: "li-004g", studentId: "stu-005", classId: "cls-003", description: "Diego - Hip Hop Foundations Juniors (Jan)", amount: 95 },
      { id: "li-004h", studentId: "stu-005", classId: "cls-068", description: "Diego - Hip Hop I Juniors Sat (Jan)", amount: 95 },
    ],
    subtotal: 855, total: 570, status: "paid", paidDate: "2026-01-14",
  },
  {
    id: "inv-005", householdId: "hh-002", date: "2026-02-01", dueDate: "2026-02-15",
    lineItems: [
      { id: "li-005a", studentId: "stu-003", classId: "cls-021", description: "Sofia - Ballet IV Seniors (Feb)", amount: 142.5 },
      { id: "li-005b", studentId: "stu-003", classId: "cls-024", description: "Sofia - Pointe I Seniors (Feb)", amount: 71.25 },
      { id: "li-005c", studentId: "stu-003", classId: "cls-047", description: "Sofia - Comp Contemporary Seniors (Feb)", amount: 118.75 },
      { id: "li-005d", studentId: "stu-004", classId: "cls-009", description: "Camila - Ballet III Teens (Feb)", amount: 118.75 },
      { id: "li-005e", studentId: "stu-004", classId: "cls-020", description: "Camila - Contemporary II Teens (Feb)", amount: 118.75 },
      { id: "li-005f", studentId: "stu-004", classId: "cls-071", description: "Camila - Jazz III Teens Sat (Feb)", amount: 95 },
      { id: "li-005g", studentId: "stu-005", classId: "cls-003", description: "Diego - Hip Hop Foundations Juniors (Feb)", amount: 95 },
      { id: "li-005h", studentId: "stu-005", classId: "cls-068", description: "Diego - Hip Hop I Juniors Sat (Feb)", amount: 95 },
    ],
    subtotal: 855, total: 570, status: "paid", paidDate: "2026-02-18",
  },
  {
    id: "inv-006", householdId: "hh-002", date: "2026-03-01", dueDate: "2026-03-15",
    lineItems: [
      { id: "li-006a", studentId: "stu-003", classId: "cls-021", description: "Sofia - Ballet IV Seniors (Mar)", amount: 142.5 },
      { id: "li-006b", studentId: "stu-003", classId: "cls-024", description: "Sofia - Pointe I Seniors (Mar)", amount: 71.25 },
      { id: "li-006c", studentId: "stu-003", classId: "cls-047", description: "Sofia - Comp Contemporary Seniors (Mar)", amount: 118.75 },
      { id: "li-006d", studentId: "stu-004", classId: "cls-009", description: "Camila - Ballet III Teens (Mar)", amount: 118.75 },
      { id: "li-006e", studentId: "stu-004", classId: "cls-020", description: "Camila - Contemporary II Teens (Mar)", amount: 118.75 },
      { id: "li-006f", studentId: "stu-004", classId: "cls-071", description: "Camila - Jazz III Teens Sat (Mar)", amount: 95 },
      { id: "li-006g", studentId: "stu-005", classId: "cls-003", description: "Diego - Hip Hop Foundations Juniors (Mar)", amount: 95 },
      { id: "li-006h", studentId: "stu-005", classId: "cls-068", description: "Diego - Hip Hop I Juniors Sat (Mar)", amount: 95 },
    ],
    subtotal: 855, total: 570, status: "overdue",
  },

  // ── hh-003: Chen ────────────────────────────────────────────────────────
  {
    id: "inv-007", householdId: "hh-003", date: "2026-01-01", dueDate: "2026-01-15",
    lineItems: [
      { id: "li-007a", studentId: "stu-006", classId: "cls-014", description: "Mei - Ballet I Minis (Jan)", amount: 95 },
      { id: "li-007b", studentId: "stu-006", classId: "cls-063", description: "Mei - Ballet II Minis Sat (Jan)", amount: 95 },
    ],
    subtotal: 190, total: 190, status: "paid", paidDate: "2026-01-10",
  },
  {
    id: "inv-008", householdId: "hh-003", date: "2026-02-01", dueDate: "2026-02-15",
    lineItems: [
      { id: "li-008a", studentId: "stu-006", classId: "cls-014", description: "Mei - Ballet I Minis (Feb)", amount: 95 },
      { id: "li-008b", studentId: "stu-006", classId: "cls-063", description: "Mei - Ballet II Minis Sat (Feb)", amount: 95 },
    ],
    subtotal: 190, total: 190, status: "paid", paidDate: "2026-02-12",
  },
  {
    id: "inv-009", householdId: "hh-003", date: "2026-03-01", dueDate: "2026-03-15",
    lineItems: [
      { id: "li-009a", studentId: "stu-006", classId: "cls-014", description: "Mei - Ballet I Minis (Mar)", amount: 95 },
      { id: "li-009b", studentId: "stu-006", classId: "cls-063", description: "Mei - Ballet II Minis Sat (Mar)", amount: 95 },
    ],
    subtotal: 190, total: 190, status: "paid", paidDate: "2026-03-09",
  },

  // ── hh-004: Thompson ────────────────────────────────────────────────────
  {
    id: "inv-010", householdId: "hh-004", date: "2026-01-01", dueDate: "2026-01-15",
    lineItems: [
      { id: "li-010a", studentId: "stu-007", classId: "cls-045", description: "Chloe - Ballet V Seniors (Jan)", amount: 142.5 },
      { id: "li-010b", studentId: "stu-007", classId: "cls-046", description: "Chloe - Pointe II Seniors (Jan)", amount: 71.25 },
      { id: "li-010c", studentId: "stu-007", classId: "cls-035", description: "Chloe - Comp Lyrical Seniors (Jan)", amount: 118.75 },
      { id: "li-010d", studentId: "stu-008", classId: "cls-006", description: "Zoe - Contemporary I Teens (Jan)", amount: 95 },
      { id: "li-010e", studentId: "stu-008", classId: "cls-008", description: "Zoe - Jazz II Teens (Jan)", amount: 95 },
      { id: "li-010f", studentId: "stu-008", classId: "cls-031", description: "Zoe - Acro III Teens (Jan)", amount: 95 },
    ],
    subtotal: 617.5, total: 570, status: "paid", paidDate: "2026-01-13",
  },
  {
    id: "inv-011", householdId: "hh-004", date: "2026-02-01", dueDate: "2026-02-15",
    lineItems: [
      { id: "li-011a", studentId: "stu-007", classId: "cls-045", description: "Chloe - Ballet V Seniors (Feb)", amount: 142.5 },
      { id: "li-011b", studentId: "stu-007", classId: "cls-046", description: "Chloe - Pointe II Seniors (Feb)", amount: 71.25 },
      { id: "li-011c", studentId: "stu-007", classId: "cls-035", description: "Chloe - Comp Lyrical Seniors (Feb)", amount: 118.75 },
      { id: "li-011d", studentId: "stu-008", classId: "cls-006", description: "Zoe - Contemporary I Teens (Feb)", amount: 95 },
      { id: "li-011e", studentId: "stu-008", classId: "cls-008", description: "Zoe - Jazz II Teens (Feb)", amount: 95 },
      { id: "li-011f", studentId: "stu-008", classId: "cls-031", description: "Zoe - Acro III Teens (Feb)", amount: 95 },
    ],
    subtotal: 617.5, total: 570, status: "paid", paidDate: "2026-02-13",
  },
  {
    id: "inv-012", householdId: "hh-004", date: "2026-03-01", dueDate: "2026-03-15",
    lineItems: [
      { id: "li-012a", studentId: "stu-007", classId: "cls-045", description: "Chloe - Ballet V Seniors (Mar)", amount: 142.5 },
      { id: "li-012b", studentId: "stu-007", classId: "cls-046", description: "Chloe - Pointe II Seniors (Mar)", amount: 71.25 },
      { id: "li-012c", studentId: "stu-007", classId: "cls-035", description: "Chloe - Comp Lyrical Seniors (Mar)", amount: 118.75 },
      { id: "li-012d", studentId: "stu-008", classId: "cls-006", description: "Zoe - Contemporary I Teens (Mar)", amount: 95 },
      { id: "li-012e", studentId: "stu-008", classId: "cls-008", description: "Zoe - Jazz II Teens (Mar)", amount: 95 },
      { id: "li-012f", studentId: "stu-008", classId: "cls-031", description: "Zoe - Acro III Teens (Mar)", amount: 95 },
    ],
    subtotal: 617.5, total: 570, status: "paid", paidDate: "2026-03-11",
  },

  // ── hh-005: Patel ───────────────────────────────────────────────────────
  {
    id: "inv-013", householdId: "hh-005", date: "2026-01-01", dueDate: "2026-01-15",
    lineItems: [
      { id: "li-013a", studentId: "stu-009", classId: "cls-005", description: "Ananya - Ballet II Juniors (Jan)", amount: 95 },
      { id: "li-013b", studentId: "stu-009", classId: "cls-042", description: "Ananya - Lyrical I Juniors (Jan)", amount: 95 },
      { id: "li-013c", studentId: "stu-009", classId: "cls-069", description: "Ananya - Contemporary I Juniors Sat (Jan)", amount: 95 },
      { id: "li-013d", studentId: "stu-010", classId: "cls-002", description: "Riya - Jazz I Minis (Jan)", amount: 95 },
      { id: "li-013e", studentId: "stu-010", classId: "cls-064", description: "Riya - Jazz/Tap Combo Minis Sat (Jan)", amount: 95 },
    ],
    subtotal: 475, total: 475, status: "paid", paidDate: "2026-01-11",
  },
  {
    id: "inv-014", householdId: "hh-005", date: "2026-02-01", dueDate: "2026-02-15",
    lineItems: [
      { id: "li-014a", studentId: "stu-009", classId: "cls-005", description: "Ananya - Ballet II Juniors (Feb)", amount: 95 },
      { id: "li-014b", studentId: "stu-009", classId: "cls-042", description: "Ananya - Lyrical I Juniors (Feb)", amount: 95 },
      { id: "li-014c", studentId: "stu-009", classId: "cls-069", description: "Ananya - Contemporary I Juniors Sat (Feb)", amount: 95 },
      { id: "li-014d", studentId: "stu-010", classId: "cls-002", description: "Riya - Jazz I Minis (Feb)", amount: 95 },
      { id: "li-014e", studentId: "stu-010", classId: "cls-064", description: "Riya - Jazz/Tap Combo Minis Sat (Feb)", amount: 95 },
    ],
    subtotal: 475, total: 475, status: "paid", paidDate: "2026-02-10",
  },
  {
    id: "inv-015", householdId: "hh-005", date: "2026-03-01", dueDate: "2026-03-15",
    lineItems: [
      { id: "li-015a", studentId: "stu-009", classId: "cls-005", description: "Ananya - Ballet II Juniors (Mar)", amount: 95 },
      { id: "li-015b", studentId: "stu-009", classId: "cls-042", description: "Ananya - Lyrical I Juniors (Mar)", amount: 95 },
      { id: "li-015c", studentId: "stu-009", classId: "cls-069", description: "Ananya - Contemporary I Juniors Sat (Mar)", amount: 95 },
      { id: "li-015d", studentId: "stu-010", classId: "cls-002", description: "Riya - Jazz I Minis (Mar)", amount: 95 },
      { id: "li-015e", studentId: "stu-010", classId: "cls-064", description: "Riya - Jazz/Tap Combo Minis Sat (Mar)", amount: 95 },
    ],
    subtotal: 475, total: 475, status: "pending",
  },

  // ── hh-006: Williams (overdue balance $190) ─────────────────────────────
  {
    id: "inv-016", householdId: "hh-006", date: "2026-01-01", dueDate: "2026-01-15",
    lineItems: [
      { id: "li-016a", studentId: "stu-011", classId: "cls-034", description: "Jasmine - Hip Hop II Teens (Jan)", amount: 95 },
      { id: "li-016b", studentId: "stu-011", classId: "cls-041", description: "Jasmine - Jazz III Teens (Jan)", amount: 118.75 },
      { id: "li-016c", studentId: "stu-011", classId: "cls-071", description: "Jasmine - Jazz III Teens Sat (Jan)", amount: 95 },
    ],
    subtotal: 308.75, total: 308.75, status: "paid", paidDate: "2026-01-20",
  },
  {
    id: "inv-017", householdId: "hh-006", date: "2026-02-01", dueDate: "2026-02-15",
    lineItems: [
      { id: "li-017a", studentId: "stu-011", classId: "cls-034", description: "Jasmine - Hip Hop II Teens (Feb)", amount: 95 },
      { id: "li-017b", studentId: "stu-011", classId: "cls-041", description: "Jasmine - Jazz III Teens (Feb)", amount: 118.75 },
      { id: "li-017c", studentId: "stu-011", classId: "cls-071", description: "Jasmine - Jazz III Teens Sat (Feb)", amount: 95 },
    ],
    subtotal: 308.75, total: 308.75, status: "overdue",
  },
  {
    id: "inv-018", householdId: "hh-006", date: "2026-03-01", dueDate: "2026-03-15",
    lineItems: [
      { id: "li-018a", studentId: "stu-011", classId: "cls-034", description: "Jasmine - Hip Hop II Teens (Mar)", amount: 95 },
      { id: "li-018b", studentId: "stu-011", classId: "cls-041", description: "Jasmine - Jazz III Teens (Mar)", amount: 118.75 },
      { id: "li-018c", studentId: "stu-011", classId: "cls-071", description: "Jasmine - Jazz III Teens Sat (Mar)", amount: 95 },
    ],
    subtotal: 308.75, total: 308.75, status: "pending",
  },

  // ── hh-009: Rossi (3 kids, large account) ───────────────────────────────
  {
    id: "inv-019", householdId: "hh-009", date: "2026-01-01", dueDate: "2026-01-15",
    lineItems: [
      { id: "li-019a", studentId: "stu-015", classId: "cls-045", description: "Isabella - Ballet V Seniors (Jan)", amount: 142.5 },
      { id: "li-019b", studentId: "stu-015", classId: "cls-046", description: "Isabella - Pointe II Seniors (Jan)", amount: 71.25 },
      { id: "li-019c", studentId: "stu-015", classId: "cls-047", description: "Isabella - Comp Contemporary (Jan)", amount: 118.75 },
      { id: "li-019d", studentId: "stu-015", classId: "cls-079", description: "Isabella - Competition Rehearsal (Jan)", amount: 95 },
      { id: "li-019e", studentId: "stu-016", classId: "cls-009", description: "Valentina - Ballet III Teens (Jan)", amount: 118.75 },
      { id: "li-019f", studentId: "stu-016", classId: "cls-020", description: "Valentina - Contemporary II (Jan)", amount: 118.75 },
      { id: "li-019g", studentId: "stu-016", classId: "cls-032", description: "Valentina - Musical Theatre II (Jan)", amount: 95 },
      { id: "li-019h", studentId: "stu-017", classId: "cls-050", description: "Luca - Tap I Juniors (Jan)", amount: 95 },
      { id: "li-019i", studentId: "stu-017", classId: "cls-055", description: "Luca - Hip Hop II Juniors (Jan)", amount: 95 },
    ],
    subtotal: 950, total: 570, status: "paid", paidDate: "2026-01-10",
  },
  {
    id: "inv-020", householdId: "hh-009", date: "2026-02-01", dueDate: "2026-02-15",
    lineItems: [
      { id: "li-020a", studentId: "stu-015", classId: "cls-045", description: "Isabella - Ballet V Seniors (Feb)", amount: 142.5 },
      { id: "li-020b", studentId: "stu-015", classId: "cls-046", description: "Isabella - Pointe II Seniors (Feb)", amount: 71.25 },
      { id: "li-020c", studentId: "stu-015", classId: "cls-047", description: "Isabella - Comp Contemporary (Feb)", amount: 118.75 },
      { id: "li-020d", studentId: "stu-015", classId: "cls-079", description: "Isabella - Competition Rehearsal (Feb)", amount: 95 },
      { id: "li-020e", studentId: "stu-016", classId: "cls-009", description: "Valentina - Ballet III Teens (Feb)", amount: 118.75 },
      { id: "li-020f", studentId: "stu-016", classId: "cls-020", description: "Valentina - Contemporary II (Feb)", amount: 118.75 },
      { id: "li-020g", studentId: "stu-016", classId: "cls-032", description: "Valentina - Musical Theatre II (Feb)", amount: 95 },
      { id: "li-020h", studentId: "stu-017", classId: "cls-050", description: "Luca - Tap I Juniors (Feb)", amount: 95 },
      { id: "li-020i", studentId: "stu-017", classId: "cls-055", description: "Luca - Hip Hop II Juniors (Feb)", amount: 95 },
    ],
    subtotal: 950, total: 570, status: "paid", paidDate: "2026-02-14",
  },
  {
    id: "inv-021", householdId: "hh-009", date: "2026-03-01", dueDate: "2026-03-15",
    lineItems: [
      { id: "li-021a", studentId: "stu-015", classId: "cls-045", description: "Isabella - Ballet V Seniors (Mar)", amount: 142.5 },
      { id: "li-021b", studentId: "stu-015", classId: "cls-046", description: "Isabella - Pointe II Seniors (Mar)", amount: 71.25 },
      { id: "li-021c", studentId: "stu-015", classId: "cls-047", description: "Isabella - Comp Contemporary (Mar)", amount: 118.75 },
      { id: "li-021d", studentId: "stu-015", classId: "cls-079", description: "Isabella - Competition Rehearsal (Mar)", amount: 95 },
      { id: "li-021e", studentId: "stu-016", classId: "cls-009", description: "Valentina - Ballet III Teens (Mar)", amount: 118.75 },
      { id: "li-021f", studentId: "stu-016", classId: "cls-020", description: "Valentina - Contemporary II (Mar)", amount: 118.75 },
      { id: "li-021g", studentId: "stu-016", classId: "cls-032", description: "Valentina - Musical Theatre II (Mar)", amount: 95 },
      { id: "li-021h", studentId: "stu-017", classId: "cls-050", description: "Luca - Tap I Juniors (Mar)", amount: 95 },
      { id: "li-021i", studentId: "stu-017", classId: "cls-055", description: "Luca - Hip Hop II Juniors (Mar)", amount: 95 },
    ],
    subtotal: 950, total: 570, status: "paid", paidDate: "2026-03-12",
  },

  // ── hh-010: Washington (overdue balance $475) ───────────────────────────
  {
    id: "inv-022", householdId: "hh-010", date: "2026-01-01", dueDate: "2026-01-15",
    lineItems: [
      { id: "li-022a", studentId: "stu-018", classId: "cls-010", description: "Aaliyah - Comp Hip Hop Teens (Jan)", amount: 118.75 },
      { id: "li-022b", studentId: "stu-018", classId: "cls-034", description: "Aaliyah - Hip Hop II Teens (Jan)", amount: 95 },
      { id: "li-022c", studentId: "stu-018", classId: "cls-076", description: "Aaliyah - Hip Hop III Teens Sat (Jan)", amount: 95 },
      { id: "li-022d", studentId: "stu-019", classId: "cls-003", description: "Zara - Hip Hop Foundations (Jan)", amount: 95 },
      { id: "li-022e", studentId: "stu-019", classId: "cls-055", description: "Zara - Hip Hop II Juniors (Jan)", amount: 95 },
    ],
    subtotal: 498.75, total: 498.75, status: "paid", paidDate: "2026-01-18",
  },
  {
    id: "inv-023", householdId: "hh-010", date: "2026-02-01", dueDate: "2026-02-15",
    lineItems: [
      { id: "li-023a", studentId: "stu-018", classId: "cls-010", description: "Aaliyah - Comp Hip Hop Teens (Feb)", amount: 118.75 },
      { id: "li-023b", studentId: "stu-018", classId: "cls-034", description: "Aaliyah - Hip Hop II Teens (Feb)", amount: 95 },
      { id: "li-023c", studentId: "stu-018", classId: "cls-076", description: "Aaliyah - Hip Hop III Teens Sat (Feb)", amount: 95 },
      { id: "li-023d", studentId: "stu-019", classId: "cls-003", description: "Zara - Hip Hop Foundations (Feb)", amount: 95 },
      { id: "li-023e", studentId: "stu-019", classId: "cls-055", description: "Zara - Hip Hop II Juniors (Feb)", amount: 95 },
    ],
    subtotal: 498.75, total: 498.75, status: "overdue",
  },
  {
    id: "inv-024", householdId: "hh-010", date: "2026-03-01", dueDate: "2026-03-15",
    lineItems: [
      { id: "li-024a", studentId: "stu-018", classId: "cls-010", description: "Aaliyah - Comp Hip Hop Teens (Mar)", amount: 118.75 },
      { id: "li-024b", studentId: "stu-018", classId: "cls-034", description: "Aaliyah - Hip Hop II Teens (Mar)", amount: 95 },
      { id: "li-024c", studentId: "stu-018", classId: "cls-076", description: "Aaliyah - Hip Hop III Teens Sat (Mar)", amount: 95 },
      { id: "li-024d", studentId: "stu-019", classId: "cls-003", description: "Zara - Hip Hop Foundations (Mar)", amount: 95 },
      { id: "li-024e", studentId: "stu-019", classId: "cls-055", description: "Zara - Hip Hop II Juniors (Mar)", amount: 95 },
    ],
    subtotal: 498.75, total: 498.75, status: "pending",
  },

  // ── hh-021: Mitchell (overdue balance $380) ─────────────────────────────
  {
    id: "inv-025", householdId: "hh-021", date: "2026-01-01", dueDate: "2026-01-15",
    lineItems: [
      { id: "li-025a", studentId: "stu-036", classId: "cls-011", description: "Addison - Lyrical I Teens (Jan)", amount: 95 },
      { id: "li-025b", studentId: "stu-036", classId: "cls-032", description: "Addison - Musical Theatre II Teens (Jan)", amount: 95 },
      { id: "li-025c", studentId: "stu-036", classId: "cls-075", description: "Addison - Contemporary III Teens Sat (Jan)", amount: 118.75 },
    ],
    subtotal: 308.75, total: 308.75, status: "paid", paidDate: "2026-01-14",
  },
  {
    id: "inv-026", householdId: "hh-021", date: "2026-02-01", dueDate: "2026-02-15",
    lineItems: [
      { id: "li-026a", studentId: "stu-036", classId: "cls-011", description: "Addison - Lyrical I Teens (Feb)", amount: 95 },
      { id: "li-026b", studentId: "stu-036", classId: "cls-032", description: "Addison - Musical Theatre II Teens (Feb)", amount: 95 },
      { id: "li-026c", studentId: "stu-036", classId: "cls-075", description: "Addison - Contemporary III Teens Sat (Feb)", amount: 118.75 },
    ],
    subtotal: 308.75, total: 308.75, status: "overdue",
  },
  {
    id: "inv-027", householdId: "hh-021", date: "2026-03-01", dueDate: "2026-03-15",
    lineItems: [
      { id: "li-027a", studentId: "stu-036", classId: "cls-011", description: "Addison - Lyrical I Teens (Mar)", amount: 95 },
      { id: "li-027b", studentId: "stu-036", classId: "cls-032", description: "Addison - Musical Theatre II Teens (Mar)", amount: 95 },
      { id: "li-027c", studentId: "stu-036", classId: "cls-075", description: "Addison - Contemporary III Teens Sat (Mar)", amount: 118.75 },
    ],
    subtotal: 308.75, total: 308.75, status: "pending",
  },

  // ── hh-013: Foster (overdue balance $95) ────────────────────────────────
  {
    id: "inv-028", householdId: "hh-013", date: "2026-01-01", dueDate: "2026-01-15",
    lineItems: [
      { id: "li-028a", studentId: "stu-023", classId: "cls-001", description: "Ava - Ballet I Tiny Tots (Jan)", amount: 71.25 },
      { id: "li-028b", studentId: "stu-023", classId: "cls-061", description: "Ava - Princess Ballet Sat (Jan)", amount: 71.25 },
    ],
    subtotal: 142.5, total: 142.5, status: "paid", paidDate: "2026-01-13",
  },
  {
    id: "inv-029", householdId: "hh-013", date: "2026-02-01", dueDate: "2026-02-15",
    lineItems: [
      { id: "li-029a", studentId: "stu-023", classId: "cls-001", description: "Ava - Ballet I Tiny Tots (Feb)", amount: 71.25 },
      { id: "li-029b", studentId: "stu-023", classId: "cls-061", description: "Ava - Princess Ballet Sat (Feb)", amount: 71.25 },
    ],
    subtotal: 142.5, total: 142.5, status: "paid", paidDate: "2026-02-11",
  },
  {
    id: "inv-030", householdId: "hh-013", date: "2026-03-01", dueDate: "2026-03-15",
    lineItems: [
      { id: "li-030a", studentId: "stu-023", classId: "cls-001", description: "Ava - Ballet I Tiny Tots (Mar)", amount: 71.25 },
      { id: "li-030b", studentId: "stu-023", classId: "cls-061", description: "Ava - Princess Ballet Sat (Mar)", amount: 71.25 },
    ],
    subtotal: 142.5, total: 142.5, status: "overdue",
  },

  // ── Additional representative invoices for other households ─────────────
  // hh-007: Kim
  {
    id: "inv-031", householdId: "hh-007", date: "2026-03-01", dueDate: "2026-03-15",
    lineItems: [
      { id: "li-031a", studentId: "stu-012", classId: "cls-022", description: "Grace - Comp Jazz Seniors (Mar)", amount: 118.75 },
      { id: "li-031b", studentId: "stu-012", classId: "cls-033", description: "Grace - Contemporary III Seniors (Mar)", amount: 118.75 },
      { id: "li-031c", studentId: "stu-012", classId: "cls-059", description: "Grace - Comp Ballet Seniors (Mar)", amount: 142.5 },
      { id: "li-031d", studentId: "stu-013", classId: "cls-029", description: "Hannah - Jazz II Juniors (Mar)", amount: 95 },
      { id: "li-031e", studentId: "stu-013", classId: "cls-039", description: "Hannah - Contemporary I Juniors (Mar)", amount: 95 },
      { id: "li-031f", studentId: "stu-013", classId: "cls-070", description: "Hannah - Lyrical I Juniors Sat (Mar)", amount: 95 },
    ],
    subtotal: 665, total: 570, status: "paid", paidDate: "2026-03-08",
  },

  // hh-012: Nguyen
  {
    id: "inv-032", householdId: "hh-012", date: "2026-03-01", dueDate: "2026-03-15",
    lineItems: [
      { id: "li-032a", studentId: "stu-021", classId: "cls-057", description: "Linh - Jazz IV Seniors (Mar)", amount: 118.75 },
      { id: "li-032b", studentId: "stu-021", classId: "cls-033", description: "Linh - Contemporary III Seniors (Mar)", amount: 118.75 },
      { id: "li-032c", studentId: "stu-021", classId: "cls-035", description: "Linh - Comp Lyrical Seniors (Mar)", amount: 118.75 },
      { id: "li-032d", studentId: "stu-022", classId: "cls-006", description: "Thi - Contemporary I Teens (Mar)", amount: 95 },
      { id: "li-032e", studentId: "stu-022", classId: "cls-042", description: "Thi - Lyrical I Juniors (Mar)", amount: 95 },
    ],
    subtotal: 546.25, total: 546.25, status: "paid", paidDate: "2026-03-09",
  },

  // hh-030: Moretti
  {
    id: "inv-033", householdId: "hh-030", date: "2026-03-01", dueDate: "2026-03-15",
    lineItems: [
      { id: "li-033a", studentId: "stu-050", classId: "cls-045", description: "Gianna - Ballet V Seniors (Mar)", amount: 142.5 },
      { id: "li-033b", studentId: "stu-050", classId: "cls-083", description: "Gianna - Pointe III Advanced (Mar)", amount: 71.25 },
      { id: "li-033c", studentId: "stu-050", classId: "cls-047", description: "Gianna - Comp Contemporary (Mar)", amount: 118.75 },
      { id: "li-033d", studentId: "stu-050", classId: "cls-079", description: "Gianna - Competition Rehearsal (Mar)", amount: 95 },
      { id: "li-033e", studentId: "stu-051", classId: "cls-009", description: "Aria - Ballet III Teens (Mar)", amount: 118.75 },
      { id: "li-033f", studentId: "stu-051", classId: "cls-011", description: "Aria - Lyrical I Teens (Mar)", amount: 95 },
      { id: "li-033g", studentId: "stu-051", classId: "cls-074", description: "Aria - Ballet IV Teens Sat (Mar)", amount: 118.75 },
    ],
    subtotal: 760, total: 570, status: "paid", paidDate: "2026-03-07",
  },

  // hh-040: Cooper (3 kids)
  {
    id: "inv-034", householdId: "hh-040", date: "2026-03-01", dueDate: "2026-03-15",
    lineItems: [
      { id: "li-034a", studentId: "stu-066", classId: "cls-045", description: "Eloise - Ballet V Seniors (Mar)", amount: 142.5 },
      { id: "li-034b", studentId: "stu-066", classId: "cls-083", description: "Eloise - Pointe III Advanced (Mar)", amount: 71.25 },
      { id: "li-034c", studentId: "stu-066", classId: "cls-022", description: "Eloise - Comp Jazz Seniors (Mar)", amount: 118.75 },
      { id: "li-034d", studentId: "stu-066", classId: "cls-079", description: "Eloise - Competition Rehearsal (Mar)", amount: 95 },
      { id: "li-034e", studentId: "stu-067", classId: "cls-020", description: "Hazel - Contemporary II Teens (Mar)", amount: 118.75 },
      { id: "li-034f", studentId: "stu-067", classId: "cls-034", description: "Hazel - Hip Hop II Teens (Mar)", amount: 95 },
      { id: "li-034g", studentId: "stu-067", classId: "cls-075", description: "Hazel - Contemporary III Teens Sat (Mar)", amount: 118.75 },
      { id: "li-034h", studentId: "stu-068", classId: "cls-004", description: "Ivy - Acro I Minis (Mar)", amount: 95 },
      { id: "li-034i", studentId: "stu-068", classId: "cls-027", description: "Ivy - Lyrical I Minis (Mar)", amount: 71.25 },
    ],
    subtotal: 926.25, total: 570, status: "paid", paidDate: "2026-03-05",
  },

  // hh-022: Park
  {
    id: "inv-035", householdId: "hh-022", date: "2026-03-01", dueDate: "2026-03-15",
    lineItems: [
      { id: "li-035a", studentId: "stu-037", classId: "cls-045", description: "Eunji - Ballet V Seniors (Mar)", amount: 142.5 },
      { id: "li-035b", studentId: "stu-037", classId: "cls-083", description: "Eunji - Pointe III Advanced (Mar)", amount: 71.25 },
      { id: "li-035c", studentId: "stu-037", classId: "cls-079", description: "Eunji - Competition Rehearsal (Mar)", amount: 95 },
      { id: "li-035d", studentId: "stu-038", classId: "cls-007", description: "Minjun - Tap II Juniors (Mar)", amount: 95 },
      { id: "li-035e", studentId: "stu-038", classId: "cls-030", description: "Minjun - Tap II Teens (Mar)", amount: 95 },
    ],
    subtotal: 498.75, total: 498.75, status: "paid", paidDate: "2026-03-10",
  },

  // Failed payment example: hh-014: Schwartz
  {
    id: "inv-036", householdId: "hh-014", date: "2026-03-01", dueDate: "2026-03-15",
    lineItems: [
      { id: "li-036a", studentId: "stu-024", classId: "cls-021", description: "Maya - Ballet IV Seniors (Mar)", amount: 142.5 },
      { id: "li-036b", studentId: "stu-024", classId: "cls-024", description: "Maya - Pointe I Seniors (Mar)", amount: 71.25 },
      { id: "li-036c", studentId: "stu-024", classId: "cls-059", description: "Maya - Comp Ballet Seniors (Mar)", amount: 142.5 },
      { id: "li-036d", studentId: "stu-025", classId: "cls-030", description: "Noah - Tap II Teens (Mar)", amount: 95 },
      { id: "li-036e", studentId: "stu-025", classId: "cls-007", description: "Noah - Tap II Juniors (Mar)", amount: 95 },
    ],
    subtotal: 546.25, total: 546.25, status: "failed",
  },
]

// ── Helper functions ──────────────────────────────────────────────────────────

export function getInvoicesByHousehold(householdId: string): Invoice[] {
  return invoices.filter((i) => i.householdId === householdId)
}

export function getInvoiceById(id: string): Invoice | undefined {
  return invoices.find((i) => i.id === id)
}

export function getInvoicesByStatus(status: PaymentStatus): Invoice[] {
  return invoices.filter((i) => i.status === status)
}

export function getOverdueInvoices(): Invoice[] {
  return invoices.filter((i) => i.status === "overdue")
}

export function getTotalRevenue(month?: string): number {
  const paid = invoices.filter((i) => {
    if (i.status !== "paid") return false
    if (month) return i.date.startsWith(month)
    return true
  })
  return paid.reduce((sum, inv) => sum + inv.total, 0)
}

// ── Billing Overrides ─────────────────────────────────────────────────────────

export const billingOverrides: (BillingOverride & { householdId: string; invoiceId: string })[] = [
  {
    id: "bo-001",
    householdId: "hh-002",
    invoiceId: "inv-005",
    originalAmount: 570,
    newAmount: 399,
    reason: "Financial hardship discount - 30% reduction approved for Feb",
    createdBy: "Vicki (Owner)",
    createdAt: "2026-02-05",
  },
  {
    id: "bo-002",
    householdId: "hh-006",
    invoiceId: "inv-016",
    originalAmount: 355,
    newAmount: 165,
    reason: "Jasmine missed 2 weeks due to injury - prorated credit",
    createdBy: "Vicki (Owner)",
    createdAt: "2026-02-20",
  },
  {
    id: "bo-003",
    householdId: "hh-010",
    invoiceId: "inv-028",
    originalAmount: 455,
    newAmount: 0,
    reason: "Scholarship recipient - full tuition waiver for March",
    createdBy: "Vicki (Owner)",
    createdAt: "2026-03-01",
  },
  {
    id: "bo-004",
    householdId: "hh-013",
    invoiceId: "inv-037",
    originalAmount: 160,
    newAmount: 65,
    reason: "Trial class credit applied - only charged for full enrollment weeks",
    createdBy: "Office Admin",
    createdAt: "2026-03-03",
  },
  {
    id: "bo-005",
    householdId: "hh-021",
    invoiceId: "inv-061",
    originalAmount: 335,
    newAmount: 0,
    reason: "Referral credit applied - brought in 3 new families",
    createdBy: "Vicki (Owner)",
    createdAt: "2026-01-20",
  },
  {
    id: "bo-006",
    householdId: "hh-002",
    invoiceId: "inv-006",
    originalAmount: 570,
    newAmount: 399,
    reason: "Continued financial hardship discount - 30% for March",
    createdBy: "Vicki (Owner)",
    createdAt: "2026-03-02",
  },
]

export function getBillingOverridesByHousehold(
  householdId: string,
): (BillingOverride & { householdId: string; invoiceId: string })[] {
  return billingOverrides.filter((o) => o.householdId === householdId)
}

export function getMonthlyBilled(month: string): number {
  return invoices
    .filter((i) => i.date.startsWith(month))
    .reduce((sum, inv) => sum + inv.total, 0)
}

export function getMonthlyCollected(month: string): number {
  return invoices
    .filter((i) => i.date.startsWith(month) && i.status === "paid")
    .reduce((sum, inv) => sum + inv.total, 0)
}

export function getMonthlyOutstanding(month: string): number {
  return invoices
    .filter(
      (i) =>
        i.date.startsWith(month) &&
        (i.status === "pending" || i.status === "overdue"),
    )
    .reduce((sum, inv) => sum + inv.total, 0)
}

export function getMonthlyFailed(month: string): number {
  return invoices
    .filter((i) => i.date.startsWith(month) && i.status === "failed")
    .reduce((sum, inv) => sum + inv.total, 0)
}
