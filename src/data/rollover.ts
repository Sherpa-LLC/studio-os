import type {
  RolloverConfig,
  RolloverHouseholdResponse,
  AgeUpFlag,
} from "@/lib/types"

// ── Rollover Configuration ──────────────────────────────────────────────────

export const rolloverConfig: RolloverConfig = {
  sourceSeasonId: "season-spring-2026",
  sourceSeasonName: "Spring 2026",
  targetSeasonName: "Summer 2026",
  rolloverDate: "2026-05-15",
  registrationFee: 45,
  notificationDate: "2026-05-01",
  currentStep: 3,
}

// ── Household Responses ─────────────────────────────────────────────────────

export const rolloverResponses: RolloverHouseholdResponse[] = [
  // 12 Confirmed (auto-rollover)
  {
    householdId: "hh-001",
    householdName: "Anderson Family",
    status: "confirmed",
    currentClasses: ["Ballet I", "Jazz I"],
    suggestedClasses: ["Ballet I", "Jazz I"],
  },
  {
    householdId: "hh-003",
    householdName: "Chen Family",
    status: "confirmed",
    currentClasses: ["Hip Hop"],
    suggestedClasses: ["Hip Hop"],
  },
  {
    householdId: "hh-004",
    householdName: "Thompson Family",
    status: "confirmed",
    currentClasses: ["Ballet II", "Lyrical"],
    suggestedClasses: ["Ballet II", "Lyrical"],
  },
  {
    householdId: "hh-005",
    householdName: "Patel Family",
    status: "confirmed",
    currentClasses: ["Tap", "Musical Theatre"],
    suggestedClasses: ["Tap", "Musical Theatre"],
  },
  {
    householdId: "hh-007",
    householdName: "Kim Family",
    status: "confirmed",
    currentClasses: ["Contemporary", "Pointe"],
    suggestedClasses: ["Contemporary", "Pointe"],
  },
  {
    householdId: "hh-009",
    householdName: "Rossi Family",
    status: "confirmed",
    currentClasses: ["Ballet I", "Acro", "Jazz I"],
    suggestedClasses: ["Ballet I", "Acro", "Jazz I"],
  },
  {
    householdId: "hh-012",
    householdName: "Nguyen Family",
    status: "confirmed",
    currentClasses: ["Ballet II", "Tap"],
    suggestedClasses: ["Ballet II", "Tap"],
  },
  {
    householdId: "hh-014",
    householdName: "Schwartz Family",
    status: "confirmed",
    currentClasses: ["Jazz II", "Contemporary"],
    suggestedClasses: ["Jazz II", "Contemporary"],
  },
  {
    householdId: "hh-015",
    householdName: "Lee Family",
    status: "confirmed",
    currentClasses: ["Ballet I", "Lyrical"],
    suggestedClasses: ["Ballet I", "Lyrical"],
  },
  {
    householdId: "hh-018",
    householdName: "Jackson Family",
    status: "confirmed",
    currentClasses: ["Hip Hop", "Jazz I"],
    suggestedClasses: ["Hip Hop", "Jazz I"],
  },
  {
    householdId: "hh-020",
    householdName: "Tanaka Family",
    status: "confirmed",
    currentClasses: ["Ballet I", "Tap"],
    suggestedClasses: ["Ballet I", "Tap"],
  },
  {
    householdId: "hh-022",
    householdName: "Park Family",
    status: "confirmed",
    currentClasses: ["Contemporary", "Acro"],
    suggestedClasses: ["Contemporary", "Acro"],
  },

  // 3 Opted Out
  {
    householdId: "hh-008",
    householdName: "O'Brien Family",
    status: "opted-out",
    currentClasses: ["Ballet I"],
    suggestedClasses: [],
    reason: "Moving out of area",
  },
  {
    householdId: "hh-019",
    householdName: "Taylor Family",
    status: "opted-out",
    currentClasses: ["Jazz I", "Tap"],
    suggestedClasses: [],
    reason: "Taking summer off",
  },
  {
    householdId: "hh-021",
    householdName: "Mitchell Family",
    status: "opted-out",
    currentClasses: ["Ballet I"],
    suggestedClasses: [],
    reason: "Financial reasons",
  },

  // 3 Change Requested
  {
    householdId: "hh-006",
    householdName: "Williams Family",
    status: "change-requested",
    currentClasses: ["Hip Hop", "Ballet I"],
    suggestedClasses: ["Contemporary", "Ballet I"],
    requestedChanges: "Drop Hip Hop, add Contemporary",
  },
  {
    householdId: "hh-011",
    householdName: "Martinez Family",
    status: "change-requested",
    currentClasses: ["Ballet I"],
    suggestedClasses: ["Ballet II"],
    requestedChanges: "Switch from Ballet I to Ballet II",
  },
  {
    householdId: "hh-016",
    householdName: "Rivera Family",
    status: "change-requested",
    currentClasses: ["Jazz I"],
    suggestedClasses: ["Jazz I", "Acro"],
    requestedChanges: "Add tumbling",
  },

  // 2 No Response
  {
    householdId: "hh-010",
    householdName: "Washington Family",
    status: "no-response",
    currentClasses: ["Ballet II", "Hip Hop"],
    suggestedClasses: ["Ballet II", "Hip Hop"],
    daysSinceNotification: 7,
  },
  {
    householdId: "hh-013",
    householdName: "Foster Family",
    status: "no-response",
    currentClasses: ["Lyrical"],
    suggestedClasses: ["Lyrical"],
    daysSinceNotification: 12,
  },
]

// ── Age-Up Flags ────────────────────────────────────────────────────────────

export const ageUpFlags: AgeUpFlag[] = [
  {
    studentName: "Emma Anderson",
    currentAgeGroup: "5-6",
    newAgeGroup: "7-8",
    suggestedClass: "7-8 Ballet",
  },
  {
    studentName: "Liam Chen",
    currentAgeGroup: "7-8",
    newAgeGroup: "9-11",
    suggestedClass: "9-11 Jazz",
  },
  {
    studentName: "Sofia Garcia",
    currentAgeGroup: "9-11",
    newAgeGroup: "12-14",
    suggestedClass: "12-14 Contemporary",
  },
]

// ── Summary Stats ───────────────────────────────────────────────────────────

export const rolloverSummary = {
  notified: 50,
  confirmed: 38,
  optedOut: 5,
  changeRequested: 4,
  noResponse: 3,
}
