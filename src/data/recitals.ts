import type { Recital, Routine, StudentMeasurement } from "@/lib/types"
import { classes } from "@/data/classes"

// ── Costume Suppliers ─────────────────────────────────────────────────────

export const COSTUME_SUPPLIERS = [
  "Curtain Call Costumes",
  "Weissman Designs",
  "Revolution Dancewear",
  "The Line Up",
  "Discount Dance Supply",
  "Custom Order",
] as const

// ── Recitals ────────────────────────────────────────────────────────────────

export const recitals: Recital[] = [
  {
    id: "rec-001",
    name: "Spring Showcase 2026",
    date: "2026-06-14",
    venue: "Performing Arts Center",
    theme: "Enchanted",
    status: "ordering",
    routines: [], // populated below
  },
  {
    id: "rec-002",
    name: "Winter Wonderland 2025",
    date: "2025-12-13",
    venue: "Community Theater",
    status: "completed",
    routines: [], // populated below
  },
]

// ── Spring Showcase Routines ────────────────────────────────────────────────

const springRoutines: Routine[] = [
  {
    id: "rtn-001",
    recitalId: "rec-001",
    name: "Enchanted Garden",
    classId: "cls-005",
    className: "Ballet II - Juniors (Ages 7-9)",
    discipline: "ballet",
    costume: {
      name: "Garden Fairy Tutu",
      description: "Layered green and pink tulle tutu with floral bodice appliqué and matching headpiece.",
      supplier: "Curtain Call Costumes",
      unitCost: 32,
      salePrice: 58,
      orderStatus: "received",
      sizeBreakdown: { "CS": 4, "CM": 5, "CL": 3, "CXL": 1 },
    },
    lineupPosition: 1,
    estimatedDuration: 4,
    studentCount: 13,
  },
  {
    id: "rtn-002",
    recitalId: "rec-001",
    name: "Rhythm Nation",
    classId: "cls-003",
    className: "Hip Hop Foundations - Juniors (Ages 7-9)",
    discipline: "hip-hop",
    costume: {
      name: "Street Crew Jacket Set",
      description: "Black bomber jacket with silver sequin accents, matching joggers, and snapback cap.",
      supplier: "Weissman Designs",
      unitCost: 24,
      salePrice: 45,
      orderStatus: "ordered",
      sizeBreakdown: { "CS": 6, "CM": 8, "CL": 5, "CXL": 2 },
    },
    lineupPosition: 2,
    estimatedDuration: 3,
    studentCount: 21,
  },
  {
    id: "rtn-003",
    recitalId: "rec-001",
    name: "Swan Dreams",
    classId: "cls-009",
    className: "Ballet III - Teens (Ages 11-14)",
    discipline: "ballet",
    costume: {
      name: "White Swan Romantic Tutu",
      description: "White romantic-length tutu with silver bodice and feather headpiece.",
      supplier: "Revolution Dancewear",
      unitCost: 44,
      salePrice: 78,
      orderStatus: "received",
      sizeBreakdown: { "AS": 3, "AM": 5, "AL": 2 },
    },
    lineupPosition: 3,
    estimatedDuration: 5,
    studentCount: 10,
  },
  {
    id: "rtn-004",
    recitalId: "rec-001",
    name: "Electric Slide",
    classId: "cls-008",
    className: "Jazz II - Teens (Ages 10-13)",
    discipline: "jazz",
    costume: {
      name: "Neon Jazz Unitard",
      description: "Electric blue unitard with neon accents and mesh sleeves.",
      supplier: "The Line Up",
      unitCost: 34,
      salePrice: 60,
      orderStatus: "ordered",
      sizeBreakdown: { "CS": 2, "CM": 4, "CL": 3, "AS": 3 },
    },
    lineupPosition: 4,
    estimatedDuration: 3,
    studentCount: 12,
  },
  {
    id: "rtn-005",
    recitalId: "rec-001",
    name: "Tiny Twinkles",
    classId: "cls-001",
    className: "Ballet I - Tiny Tots (Ages 3-4)",
    discipline: "ballet",
    costume: {
      name: "Star Sparkle Tutu",
      description: "Light blue tutu with silver star sequins and matching hair bow.",
      supplier: "Curtain Call Costumes",
      unitCost: 22,
      salePrice: 42,
      orderStatus: "received",
      sizeBreakdown: { "XXS": 5, "XS": 6, "CS": 3 },
    },
    lineupPosition: 5,
    estimatedDuration: 3,
    studentCount: 14,
  },
  {
    id: "rtn-006",
    recitalId: "rec-001",
    name: "Shadows & Light",
    classId: "cls-006",
    className: "Contemporary I - Teens (Ages 10-13)",
    discipline: "contemporary",
    costume: {
      name: "Ombré Lyrical Dress",
      description: "Flowing dress transitioning from charcoal to ivory, with asymmetric hemline.",
      supplier: "Revolution Dancewear",
      unitCost: 38,
      salePrice: 68,
      orderStatus: "not-ordered",
      sizeBreakdown: { "CS": 3, "CM": 5, "CL": 4, "AS": 2 },
    },
    lineupPosition: 6,
    estimatedDuration: 4,
    studentCount: 14,
  },
  {
    id: "rtn-007",
    recitalId: "rec-001",
    name: "Tap Attack",
    classId: "cls-007",
    className: "Tap II - Juniors (Ages 7-10)",
    discipline: "tap",
    costume: {
      name: "Broadway Vest & Bowtie",
      description: "Black vest with gold sequin lapels, white shirt, black pants, and bowtie.",
      supplier: "Weissman Designs",
      unitCost: 28,
      salePrice: 50,
      orderStatus: "ordered",
      sizeBreakdown: { "CS": 3, "CM": 4, "CL": 2 },
    },
    lineupPosition: 7,
    estimatedDuration: 3,
    studentCount: 9,
  },
  {
    id: "rtn-008",
    recitalId: "rec-001",
    name: "Heartstrings",
    classId: "cls-011",
    className: "Lyrical I - Teens (Ages 10-13)",
    discipline: "lyrical",
    costume: {
      name: "Rose Petal Skirt Set",
      description: "Dusty rose crop top with flowing chiffon skirt and rhinestone detailing.",
      supplier: "Curtain Call Costumes",
      unitCost: 32,
      salePrice: 58,
      orderStatus: "ordered",
      sizeBreakdown: { "CM": 4, "CL": 3, "AS": 2 },
    },
    lineupPosition: 8,
    estimatedDuration: 4,
    studentCount: 9,
  },
  {
    id: "rtn-009",
    recitalId: "rec-001",
    name: "Tumble & Shine",
    classId: "cls-004",
    className: "Acro I - Minis (Ages 5-7)",
    discipline: "acro",
    costume: {
      name: "Rainbow Acro Unitard",
      description: "Multi-color gradient unitard with rhinestone accents and matching scrunchie.",
      supplier: "The Line Up",
      unitCost: 26,
      salePrice: 48,
      orderStatus: "not-ordered",
      sizeBreakdown: { "XXS": 3, "XS": 5, "CS": 6, "CM": 2 },
    },
    lineupPosition: 9,
    estimatedDuration: 3,
    studentCount: 16,
  },
  {
    id: "rtn-010",
    recitalId: "rec-001",
    name: "Elegance",
    classId: "cls-021",
    className: "Ballet IV - Seniors (Ages 14-18)",
    discipline: "ballet",
    costume: {
      name: "Midnight Classical Tutu",
      description: "Deep navy classical tutu with crystal-embellished bodice and silver tiara.",
      supplier: "Revolution Dancewear",
      unitCost: 48,
      salePrice: 82,
      orderStatus: "distributed",
      sizeBreakdown: { "AS": 3, "AM": 4, "AL": 2 },
    },
    lineupPosition: 10,
    estimatedDuration: 5,
    studentCount: 9,
  },
  {
    id: "rtn-011",
    recitalId: "rec-001",
    name: "Grand Finale Mashup",
    classId: "cls-022",
    className: "Competition Jazz - Seniors",
    discipline: "jazz",
    costume: {
      name: "Gold Showstopper Leotard",
      description: "Metallic gold leotard with fringe detail and matching boot covers.",
      supplier: "Weissman Designs",
      unitCost: 40,
      salePrice: 70,
      orderStatus: "ordered",
    },
    lineupPosition: 11,
    estimatedDuration: 5,
    studentCount: 8,
  },
]

// ── Winter Wonderland Routines (completed) ──────────────────────────────────

const winterRoutines: Routine[] = [
  {
    id: "rtn-w01",
    recitalId: "rec-002",
    name: "Snowflake Waltz",
    classId: "cls-005",
    className: "Ballet II - Juniors (Ages 7-9)",
    discipline: "ballet",
    costume: {
      name: "Snowflake Tutu",
      description: "White tutu with iridescent snowflake appliqués.",
      supplier: "Curtain Call Costumes",
      unitCost: 40,
      salePrice: 72,
      orderStatus: "distributed",
    },
    lineupPosition: 1,
    estimatedDuration: 4,
    studentCount: 12,
  },
  {
    id: "rtn-w02",
    recitalId: "rec-002",
    name: "Jingle Bell Rock",
    classId: "cls-003",
    className: "Hip Hop Foundations - Juniors (Ages 7-9)",
    discipline: "hip-hop",
    costume: {
      name: "Holiday Hip Hop Set",
      description: "Red and green streetwear set with Santa hat.",
      supplier: "Weissman Designs",
      unitCost: 34,
      salePrice: 60,
      orderStatus: "distributed",
    },
    lineupPosition: 2,
    estimatedDuration: 3,
    studentCount: 24,
  },
  {
    id: "rtn-w03",
    recitalId: "rec-002",
    name: "Sugar Plum Fairy",
    classId: "cls-021",
    className: "Ballet IV - Seniors (Ages 14-18)",
    discipline: "ballet",
    costume: {
      name: "Sugar Plum Tutu",
      description: "Purple classical tutu with gold trim.",
      supplier: "Revolution Dancewear",
      unitCost: 55,
      salePrice: 90,
      orderStatus: "distributed",
    },
    lineupPosition: 3,
    estimatedDuration: 5,
    studentCount: 8,
  },
  {
    id: "rtn-w04",
    recitalId: "rec-002",
    name: "Winter Tap Spectacular",
    classId: "cls-007",
    className: "Tap II - Juniors (Ages 7-10)",
    discipline: "tap",
    costume: {
      name: "Silver Tap Vest",
      description: "Silver vest with black pants and top hat.",
      supplier: "Curtain Call Costumes",
      unitCost: 33,
      salePrice: 58,
      orderStatus: "distributed",
    },
    lineupPosition: 4,
    estimatedDuration: 3,
    studentCount: 9,
  },
  {
    id: "rtn-w05",
    recitalId: "rec-002",
    name: "Frozen Dreams",
    classId: "cls-006",
    className: "Contemporary I - Teens (Ages 10-13)",
    discipline: "contemporary",
    costume: {
      name: "Ice Crystal Dress",
      description: "Pale blue dress with crystal accents.",
      supplier: "Revolution Dancewear",
      unitCost: 46,
      salePrice: 80,
      orderStatus: "distributed",
    },
    lineupPosition: 5,
    estimatedDuration: 4,
    studentCount: 13,
  },
]

// Attach routines to recitals
recitals[0].routines = springRoutines
recitals[1].routines = winterRoutines

// ── Student Measurements (Spring Showcase) ──────────────────────────────────

export const measurements: StudentMeasurement[] = [
  // Enchanted Garden (cls-005) - complete
  { studentId: "stu-009", studentName: "Ananya Patel", classId: "cls-005", routineName: "Enchanted Garden", height: "4'6\"", chest: "26\"", waist: "22\"", hips: "27\"", inseam: "22\"", assignedSize: "CM", status: "complete" },
  { studentId: "stu-052", studentName: "Willow Bell", classId: "cls-005", routineName: "Enchanted Garden", height: "4'4\"", chest: "25\"", waist: "21\"", hips: "26\"", inseam: "21\"", assignedSize: "CS", status: "complete" },
  // Rhythm Nation (cls-003) - mostly complete
  { studentId: "stu-005", studentName: "Diego Garcia", classId: "cls-003", routineName: "Rhythm Nation", height: "4'8\"", chest: "27\"", waist: "23\"", hips: "28\"", inseam: "23\"", assignedSize: "CM", status: "complete" },
  { studentId: "stu-019", studentName: "Zara Washington", classId: "cls-003", routineName: "Rhythm Nation", height: "4'5\"", chest: "25\"", waist: "21\"", hips: "26\"", inseam: "21\"", assignedSize: "CS", status: "complete" },
  { studentId: "stu-032", studentName: "Jordan Jackson", classId: "cls-003", routineName: "Rhythm Nation", height: "4'7\"", chest: "26\"", waist: "22\"", hips: "27\"", inseam: "22\"", assignedSize: "CM", status: "complete" },
  { studentId: "stu-080", studentName: "Kaia Grant", classId: "cls-003", routineName: "Rhythm Nation", status: "missing" },
  // Swan Dreams (cls-009) - one needs update
  { studentId: "stu-004", studentName: "Camila Garcia", classId: "cls-009", routineName: "Swan Dreams", height: "5'1\"", chest: "30\"", waist: "25\"", hips: "31\"", inseam: "27\"", assignedSize: "AS", status: "complete" },
  { studentId: "stu-016", studentName: "Valentina Rossi", classId: "cls-009", routineName: "Swan Dreams", height: "5'0\"", chest: "29\"", waist: "24\"", hips: "30\"", inseam: "26\"", assignedSize: "AS", status: "needs-update" },
  { studentId: "stu-040", studentName: "Miriam Cohen", classId: "cls-009", routineName: "Swan Dreams", height: "4'11\"", chest: "28\"", waist: "24\"", hips: "30\"", inseam: "26\"", assignedSize: "AM", status: "complete" },
  // Electric Slide (cls-008) - complete
  { studentId: "stu-008", studentName: "Zoe Thompson", classId: "cls-008", routineName: "Electric Slide", height: "4'10\"", chest: "28\"", waist: "23\"", hips: "29\"", inseam: "25\"", assignedSize: "CL", status: "complete" },
  { studentId: "stu-026", studentName: "Hana Lee", classId: "cls-008", routineName: "Electric Slide", height: "5'2\"", chest: "30\"", waist: "25\"", hips: "31\"", inseam: "27\"", assignedSize: "AS", status: "complete" },
  { studentId: "stu-043", studentName: "Morgan Brooks", classId: "cls-008", routineName: "Electric Slide", height: "4'9\"", chest: "27\"", waist: "23\"", hips: "28\"", inseam: "24\"", assignedSize: "CM", status: "complete" },
  // Shadows & Light (cls-006) - one missing
  { studentId: "stu-001", studentName: "Emma Anderson", classId: "cls-006", routineName: "Shadows & Light", height: "4'11\"", chest: "28\"", waist: "24\"", hips: "29\"", inseam: "25\"", assignedSize: "CL", status: "complete" },
  { studentId: "stu-022", studentName: "Thi Nguyen", classId: "cls-006", routineName: "Shadows & Light", height: "4'7\"", chest: "26\"", waist: "22\"", hips: "27\"", inseam: "22\"", assignedSize: "CM", status: "complete" },
  { studentId: "stu-054", studentName: "Aoi Nakamura", classId: "cls-006", routineName: "Shadows & Light", status: "missing" },
  // Elegance (cls-021)
  { studentId: "stu-003", studentName: "Sofia Garcia", classId: "cls-021", routineName: "Elegance", height: "5'4\"", chest: "32\"", waist: "26\"", hips: "34\"", inseam: "30\"", assignedSize: "AM", status: "complete" },
  { studentId: "stu-024", studentName: "Maya Schwartz", classId: "cls-021", routineName: "Elegance", height: "5'5\"", chest: "32\"", waist: "26\"", hips: "34\"", inseam: "30\"", assignedSize: "AM", status: "complete" },
  { studentId: "stu-053", studentName: "Yumi Nakamura", classId: "cls-021", routineName: "Elegance", height: "5'3\"", chest: "31\"", waist: "25\"", hips: "33\"", inseam: "28\"", assignedSize: "AS", status: "complete" },
  { studentId: "stu-061", studentName: "Katya Petrov", classId: "cls-021", routineName: "Elegance", height: "5'4\"", chest: "31\"", waist: "25\"", hips: "33\"", inseam: "29\"", assignedSize: "AS", status: "needs-update" },
]

// ── Lineup Conflict Data ────────────────────────────────────────────────────
// Students who appear in multiple routines for the Spring Showcase:
// - Emma Anderson (stu-001): cls-006 (Shadows & Light, position 6) and cls-019 (not in this recital)
// - Zoe Thompson (stu-008): cls-008 (Electric Slide, position 4) and cls-006 (Shadows & Light, position 6)
//   ^ Only 1 routine apart — this is the conflict (positions 4 and 6, only routine 5 between them)

export const lineupConflicts = [
  {
    studentName: "Zoe Thompson",
    routineA: "Electric Slide",
    positionA: 4,
    routineB: "Shadows & Light",
    positionB: 6,
    gap: 1, // only 1 routine between them (routine 5)
    severity: "warning" as const,
  },
]

// ── Costume Financials (Spring Showcase) ────────────────────────────────────

export function getCostumeFinancials(recitalId: string) {
  const recital = getRecitalById(recitalId)
  if (!recital) return { totalCost: 0, totalRevenue: 0, margin: 0, perRoutine: [] }

  const perRoutine = recital.routines.map((r) => ({
    routineId: r.id,
    routineName: r.name,
    className: r.className,
    studentCount: r.studentCount,
    unitCost: r.costume.unitCost,
    salePrice: r.costume.salePrice,
    totalCost: r.costume.unitCost * r.studentCount,
    totalRevenue: r.costume.salePrice * r.studentCount,
    margin: (r.costume.salePrice - r.costume.unitCost) * r.studentCount,
  }))

  const totalCost = perRoutine.reduce((sum, r) => sum + r.totalCost, 0)
  const totalRevenue = perRoutine.reduce((sum, r) => sum + r.totalRevenue, 0)
  const margin = totalRevenue - totalCost

  return { totalCost, totalRevenue, margin, perRoutine }
}

// ── Helper functions ────────────────────────────────────────────────────────

export function getRecitalById(id: string): Recital | undefined {
  return recitals.find((r) => r.id === id)
}

export function getRoutinesByRecitalId(recitalId: string): Routine[] {
  const recital = recitals.find((r) => r.id === recitalId)
  return recital?.routines ?? []
}

export function getMeasurementsByRecitalId(recitalId: string): StudentMeasurement[] {
  if (recitalId !== "rec-001") return []
  return measurements
}

export function getAvailableClasses() {
  return classes.filter((c) => c.status === "active")
}
