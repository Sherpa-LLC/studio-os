import type { AvailabilitySlot, DayOfWeek, Discipline, StaffMember, SubRequest } from "@/lib/types"

// ── Helper: generate an availability grid ────────────────────────────────────

const DAYS: DayOfWeek[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
const PERIODS = ["morning", "afternoon", "evening"] as const

function buildAvailability(
  available: Partial<Record<DayOfWeek, ("morning" | "afternoon" | "evening")[]>>
): AvailabilitySlot[] {
  return DAYS.flatMap((day) =>
    PERIODS.map((period) => ({
      day,
      period,
      available: available[day]?.includes(period) ?? false,
    }))
  )
}

// ── Staff Members ────────────────────────────────────────────────────────────

export const staffMembers: StaffMember[] = [
  // ── Instructors (8) ────────────────────────────────────────────────────────
  {
    id: "staff-001",
    firstName: "Natasha",
    lastName: "Volkov",
    email: "natasha.volkov@studioos.com",
    phone: "5551001001",
    role: "instructor",
    disciplines: ["ballet", "pointe"],
    status: "active",
    payRate: 50,
    payType: "per-class",
    hireDate: "2018-08-15",
    certifications: [
      { name: "CPR/AED", expiresAt: "2026-12-01" },
      { name: "First Aid", expiresAt: "2026-12-01" },
      { name: "Dance Education Certificate", expiresAt: "2027-06-30" },
    ],
    classIds: ["cls-001", "cls-009", "cls-024", "cls-038"],
    weeklyHours: 14,
    monthlyCompensation: Math.round(50 * 14 * 4.3),
    availability: buildAvailability({
      monday: ["afternoon", "evening"],
      tuesday: ["afternoon", "evening"],
      wednesday: ["afternoon", "evening"],
      thursday: ["afternoon", "evening"],
      friday: ["afternoon"],
      saturday: ["morning", "afternoon"],
    }),
  },
  {
    id: "staff-002",
    firstName: "Marcus",
    lastName: "Chen",
    email: "marcus.chen@studioos.com",
    phone: "5551001002",
    role: "instructor",
    disciplines: ["hip-hop", "jazz"],
    status: "active",
    payRate: 45,
    payType: "per-class",
    hireDate: "2020-01-10",
    certifications: [
      { name: "CPR/AED", expiresAt: "2026-05-15" },
      { name: "First Aid", expiresAt: "2026-05-15" },
    ],
    classIds: ["cls-003", "cls-023", "cls-034"],
    weeklyHours: 12,
    monthlyCompensation: Math.round(45 * 12 * 4.3),
    availability: buildAvailability({
      monday: ["afternoon", "evening"],
      tuesday: ["evening"],
      wednesday: ["afternoon", "evening"],
      thursday: ["afternoon", "evening"],
      friday: ["afternoon", "evening"],
      saturday: ["morning", "afternoon"],
    }),
  },
  {
    id: "staff-003",
    firstName: "Elena",
    lastName: "Rodriguez",
    email: "elena.rodriguez@studioos.com",
    phone: "5551001003",
    role: "instructor",
    disciplines: ["contemporary", "lyrical"],
    status: "active",
    payRate: 48,
    payType: "per-class",
    hireDate: "2019-06-01",
    certifications: [
      { name: "CPR/AED", expiresAt: "2027-03-01" },
      { name: "First Aid", expiresAt: "2027-03-01" },
      { name: "Dance Education Certificate", expiresAt: "2027-09-15" },
    ],
    classIds: ["cls-006", "cls-020", "cls-033", "cls-047"],
    weeklyHours: 16,
    monthlyCompensation: Math.round(48 * 16 * 4.3),
    availability: buildAvailability({
      monday: ["afternoon", "evening"],
      tuesday: ["afternoon", "evening"],
      wednesday: ["afternoon", "evening"],
      thursday: ["afternoon", "evening"],
      friday: ["afternoon"],
      saturday: ["morning"],
    }),
  },
  {
    id: "staff-004",
    firstName: "James",
    lastName: "Okafor",
    email: "james.okafor@studioos.com",
    phone: "5551001004",
    role: "instructor",
    disciplines: ["tap", "musical-theatre"],
    status: "active",
    payRate: 42,
    payType: "per-class",
    hireDate: "2021-09-01",
    certifications: [
      { name: "CPR/AED", expiresAt: "2026-04-20" },
      { name: "First Aid", expiresAt: "2026-04-20" },
    ],
    classIds: ["cls-007", "cls-030"],
    weeklyHours: 8,
    monthlyCompensation: Math.round(42 * 8 * 4.3),
    availability: buildAvailability({
      monday: ["afternoon", "evening"],
      tuesday: ["afternoon", "evening"],
      wednesday: ["afternoon", "evening"],
      thursday: ["afternoon"],
      friday: ["afternoon", "evening"],
      saturday: ["morning", "afternoon"],
    }),
  },
  {
    id: "staff-005",
    firstName: "Sophia",
    lastName: "Kim",
    email: "sophia.kim@studioos.com",
    phone: "5551001005",
    role: "instructor",
    disciplines: ["ballet", "contemporary", "lyrical"],
    status: "active",
    payRate: 47,
    payType: "per-class",
    hireDate: "2019-01-15",
    certifications: [
      { name: "CPR/AED", expiresAt: "2026-11-01" },
      { name: "First Aid", expiresAt: "2026-11-01" },
      { name: "Dance Education Certificate", expiresAt: "2028-01-31" },
    ],
    classIds: ["cls-005", "cls-028"],
    weeklyHours: 10,
    monthlyCompensation: Math.round(47 * 10 * 4.3),
    availability: buildAvailability({
      monday: ["afternoon", "evening"],
      tuesday: ["afternoon"],
      wednesday: ["afternoon", "evening"],
      thursday: ["afternoon", "evening"],
      friday: ["afternoon"],
      saturday: ["morning", "afternoon"],
    }),
  },
  {
    id: "staff-006",
    firstName: "Destiny",
    lastName: "Washington",
    email: "destiny.washington@studioos.com",
    phone: "5551001006",
    role: "instructor",
    disciplines: ["jazz", "hip-hop"],
    status: "active",
    payRate: 40,
    payType: "hourly",
    hireDate: "2022-03-01",
    certifications: [
      { name: "CPR/AED", expiresAt: "2027-01-15" },
      { name: "First Aid", expiresAt: "2027-01-15" },
    ],
    classIds: ["cls-002", "cls-017", "cls-041"],
    weeklyHours: 12,
    monthlyCompensation: Math.round(40 * 12 * 4.3),
    availability: buildAvailability({
      monday: ["afternoon", "evening"],
      tuesday: ["afternoon", "evening"],
      wednesday: ["afternoon"],
      thursday: ["afternoon", "evening"],
      friday: ["afternoon", "evening"],
      saturday: ["morning", "afternoon"],
    }),
  },
  {
    id: "staff-007",
    firstName: "Aiden",
    lastName: "Murphy",
    email: "aiden.murphy@studioos.com",
    phone: "5551001007",
    role: "instructor",
    disciplines: ["acro", "jazz"],
    status: "on-leave",
    payRate: 38,
    payType: "hourly",
    hireDate: "2023-01-10",
    certifications: [
      { name: "CPR/AED", expiresAt: "2026-08-01" },
      { name: "First Aid", expiresAt: "2026-08-01" },
    ],
    classIds: ["cls-004"],
    weeklyHours: 4,
    monthlyCompensation: Math.round(38 * 4 * 4.3),
    availability: buildAvailability({
      monday: ["afternoon"],
      thursday: ["afternoon"],
      saturday: ["morning"],
    }),
  },
  {
    id: "staff-008",
    firstName: "Isabella",
    lastName: "Moretti",
    email: "isabella.moretti@studioos.com",
    phone: "5551001008",
    role: "instructor",
    disciplines: ["ballet", "pointe"],
    status: "active",
    payRate: 50,
    payType: "per-class",
    hireDate: "2018-06-01",
    certifications: [
      { name: "CPR/AED", expiresAt: "2027-02-28" },
      { name: "First Aid", expiresAt: "2027-02-28" },
      { name: "Dance Education Certificate", expiresAt: "2026-09-30" },
    ],
    classIds: ["cls-021", "cls-045"],
    weeklyHours: 10,
    monthlyCompensation: Math.round(50 * 10 * 4.3),
    availability: buildAvailability({
      monday: ["afternoon", "evening"],
      tuesday: ["afternoon", "evening"],
      wednesday: ["afternoon"],
      thursday: ["afternoon", "evening"],
      friday: ["afternoon"],
      saturday: ["morning", "afternoon"],
    }),
  },

  // ── Assistants (2) ─────────────────────────────────────────────────────────
  {
    id: "staff-009",
    firstName: "Maya",
    lastName: "Torres",
    email: "maya.torres@studioos.com",
    phone: "5551002001",
    role: "assistant",
    disciplines: ["ballet", "jazz", "contemporary"],
    status: "active",
    payRate: 35,
    payType: "hourly",
    hireDate: "2024-09-01",
    certifications: [
      { name: "CPR/AED", expiresAt: "2027-05-01" },
      { name: "First Aid", expiresAt: "2027-05-01" },
    ],
    classIds: ["cls-001", "cls-005", "cls-009"],
    weeklyHours: 6,
    monthlyCompensation: Math.round(35 * 6 * 4.3),
    availability: buildAvailability({
      monday: ["afternoon", "evening"],
      tuesday: ["afternoon"],
      wednesday: ["afternoon", "evening"],
      thursday: ["afternoon"],
      friday: ["afternoon"],
      saturday: ["morning", "afternoon"],
    }),
  },
  {
    id: "staff-010",
    firstName: "Jordan",
    lastName: "Blake",
    email: "jordan.blake@studioos.com",
    phone: "5551002002",
    role: "assistant",
    disciplines: ["hip-hop", "jazz", "acro"],
    status: "active",
    payRate: 36,
    payType: "hourly",
    hireDate: "2024-01-15",
    certifications: [
      { name: "CPR/AED", expiresAt: "2026-06-30" },
      { name: "First Aid", expiresAt: "2026-06-30" },
    ],
    classIds: ["cls-003", "cls-010", "cls-034"],
    weeklyHours: 8,
    monthlyCompensation: Math.round(36 * 8 * 4.3),
    availability: buildAvailability({
      monday: ["afternoon", "evening"],
      tuesday: ["afternoon", "evening"],
      wednesday: ["afternoon", "evening"],
      thursday: ["afternoon", "evening"],
      friday: ["afternoon"],
      saturday: ["morning"],
    }),
  },

  // ── Available Subs (2) ─────────────────────────────────────────────────────
  {
    id: "staff-011",
    firstName: "Camille",
    lastName: "Dubois",
    email: "camille.dubois@studioos.com",
    phone: "5551003001",
    role: "sub",
    disciplines: ["ballet", "jazz", "lyrical"],
    status: "active",
    payRate: 45,
    payType: "per-class",
    hireDate: "2022-08-01",
    certifications: [
      { name: "CPR/AED", expiresAt: "2027-04-01" },
      { name: "First Aid", expiresAt: "2027-04-01" },
      { name: "Dance Education Certificate", expiresAt: "2027-12-31" },
    ],
    classIds: [],
    weeklyHours: 0,
    monthlyCompensation: 0,
    availability: buildAvailability({
      monday: ["afternoon", "evening"],
      tuesday: ["afternoon", "evening"],
      wednesday: ["afternoon", "evening"],
      thursday: ["afternoon"],
      friday: ["afternoon", "evening"],
      saturday: ["morning", "afternoon"],
    }),
  },
  {
    id: "staff-012",
    firstName: "Ryan",
    lastName: "Fitzgerald",
    email: "ryan.fitzgerald@studioos.com",
    phone: "5551003002",
    role: "sub",
    disciplines: ["tap", "jazz", "musical-theatre"],
    status: "active",
    payRate: 40,
    payType: "per-class",
    hireDate: "2023-06-15",
    certifications: [
      { name: "CPR/AED", expiresAt: "2026-05-01" },
      { name: "First Aid", expiresAt: "2026-05-01" },
    ],
    classIds: [],
    weeklyHours: 0,
    monthlyCompensation: 0,
    availability: buildAvailability({
      monday: ["afternoon"],
      tuesday: ["afternoon", "evening"],
      wednesday: ["afternoon"],
      thursday: ["afternoon", "evening"],
      friday: ["afternoon", "evening"],
      saturday: ["morning", "afternoon"],
    }),
  },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

export function getStaffById(id: string): StaffMember | undefined {
  return staffMembers.find((s) => s.id === id)
}

// ── Sub Requests ─────────────────────────────────────────────────────────────

export const subRequests: SubRequest[] = [
  {
    id: "sub-001",
    classId: "cls-008",
    className: "Jazz II - Teens (Ages 10-13)",
    date: "2026-04-07",
    time: "4:00 PM",
    originalInstructor: "Elena Rodriguez",
    status: "open",
  },
]

// Qualified subs for the active request (for display on the subs page)
export const qualifiedSubCandidates = [
  {
    staffId: "staff-011",
    name: "Camille Dubois",
    disciplines: ["ballet", "jazz", "lyrical"] as Discipline[],
    availabilityMatch: "available" as const,
    phone: "5551003001",
  },
  {
    staffId: "staff-012",
    name: "Ryan Fitzgerald",
    disciplines: ["tap", "jazz", "musical-theatre"] as Discipline[],
    availabilityMatch: "check" as const,
    phone: "5551003002",
  },
  {
    staffId: "staff-006",
    name: "Destiny Washington",
    disciplines: ["jazz", "hip-hop"] as Discipline[],
    availabilityMatch: "unavailable" as const,
    phone: "5551001006",
  },
]

// ── Sub History ──────────────────────────────────────────────────────────────

export const subHistory = [
  {
    id: "subhist-001",
    date: "2026-03-18",
    classId: "cls-002",
    className: "Jazz I - Minis (Ages 5-7)",
    originalInstructor: "Destiny Washington",
    subName: "Camille Dubois",
    status: "completed" as const,
  },
  {
    id: "subhist-002",
    date: "2026-02-25",
    classId: "cls-007",
    className: "Tap II - Juniors (Ages 7-10)",
    originalInstructor: "James Okafor",
    subName: "Ryan Fitzgerald",
    status: "completed" as const,
  },
  {
    id: "subhist-003",
    date: "2026-02-11",
    classId: "cls-006",
    className: "Contemporary I - Teens (Ages 10-13)",
    originalInstructor: "Elena Rodriguez",
    subName: "Camille Dubois",
    status: "completed" as const,
  },
]
