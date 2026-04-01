// ── Types ──────────────────────────────────────────────────────────────────

export interface DailyBriefing {
  date: string
  greeting: string
  summary: string
  highlights: string[]
}

export type RiskLevel = "high" | "medium" | "low"
export type RiskSignalType = "attendance" | "payment" | "communication" | "enrollment"

export interface RiskSignal {
  type: RiskSignalType
  description: string
  severity: RiskLevel
}

export interface AtRiskFamily {
  householdId: string
  householdName: string
  riskLevel: RiskLevel
  riskScore: number
  signals: RiskSignal[]
  daysSinceLastEngagement: number
  recommendedAction: string
  studentNames: string[]
}

export interface LeadPriority {
  leadId: string
  leadName: string
  childName: string
  childAge: number
  discipline: string
  source: string
  conversionScore: number
  signals: string[]
  recommendedAction: string
  daysInPipeline: number
}

export interface RevenueForecast {
  currentMonth: string
  projectedMrr: number
  lastMonthMrr: number
  mrrTrend: number
  netStudentMovement: number
  newEnrollments: number
  withdrawals: number
  narrative: string
}

export type ActionCategory = "retention" | "growth" | "communication" | "operations"
export type ActionPriority = "urgent" | "high" | "medium"

export interface SuggestedAction {
  id: string
  priority: ActionPriority
  category: ActionCategory
  title: string
  context: string
  linkHref?: string
}

export interface InsightPattern {
  id: string
  title: string
  description: string
  dataPoint: string
  category: "attendance" | "reviews" | "enrollment" | "financial"
}

// ── Daily Briefing ────────────────────────────────────────────────────────

export const dailyBriefing: DailyBriefing = {
  date: "2026-04-01",
  greeting: "Good morning, Vicki.",
  summary:
    "You have 2 families showing strong disengagement signals this week that need attention, and 2 leads are primed for conversion. March revenue closed at $94.2K — April is tracking 3.2% higher with 8 new spring enrollments. One Google review needs a response.",
  highlights: [
    "Garcia and Washington families flagged as high churn risk — both have multiple warning signs converging this week",
    "Amanda Simmons has a trial class Thursday and responded to outreach within 2 hours — high-intent lead",
    "Spring recital costume measurements are due in 5 days, 4 students still missing",
    "Referral-sourced leads are converting 40% faster than other channels this quarter",
  ],
}

// ── At-Risk Families ──────────────────────────────────────────────────────

export const atRiskFamilies: AtRiskFamily[] = [
  {
    householdId: "hh-002",
    householdName: "Garcia Family",
    riskLevel: "high",
    riskScore: 89,
    signals: [
      {
        type: "payment",
        description: "March invoice overdue by 12 days",
        severity: "high",
      },
      {
        type: "attendance",
        description: "3 missed classes in March (Camila & Diego)",
        severity: "high",
      },
      {
        type: "communication",
        description: "Message replies getting shorter — avg 4 words vs. usual 15",
        severity: "medium",
      },
      {
        type: "enrollment",
        description: "Didn't confirm summer rollover — still 'no response'",
        severity: "medium",
      },
    ],
    daysSinceLastEngagement: 8,
    recommendedAction: "Call Maria Garcia directly — text isn't working. Mention the kids' recital roles to re-engage.",
    studentNames: ["Camila", "Diego"],
  },
  {
    householdId: "hh-010",
    householdName: "Washington Family",
    riskLevel: "high",
    riskScore: 82,
    signals: [
      {
        type: "payment",
        description: "$475 outstanding balance across 2 invoices",
        severity: "high",
      },
      {
        type: "attendance",
        description: "Attendance dropped 40% in March (Zara)",
        severity: "high",
      },
      {
        type: "communication",
        description: "No response to 2 outreach texts sent March 22 and 28",
        severity: "high",
      },
    ],
    daysSinceLastEngagement: 12,
    recommendedAction: "Text hasn't worked — try a phone call. Consider offering a payment plan for the balance.",
    studentNames: ["Zara"],
  },
  {
    householdId: "hh-013",
    householdName: "Foster Family",
    riskLevel: "medium",
    riskScore: 54,
    signals: [
      {
        type: "payment",
        description: "$95 balance — 5 days past due",
        severity: "low",
      },
      {
        type: "attendance",
        description: "1 missed class last week (first absence in 2 months)",
        severity: "low",
      },
      {
        type: "communication",
        description: "Asked about summer schedule options — may be evaluating alternatives",
        severity: "medium",
      },
    ],
    daysSinceLastEngagement: 3,
    recommendedAction: "Respond warmly to their summer inquiry — share the schedule and mention early-bird pricing.",
    studentNames: ["Lily"],
  },
  {
    householdId: "hh-021",
    householdName: "Mitchell Family",
    riskLevel: "medium",
    riskScore: 48,
    signals: [
      {
        type: "payment",
        description: "$380 balance — late payment 2 months in a row",
        severity: "medium",
      },
      {
        type: "enrollment",
        description: "Missed recital costume measurement deadline for Ava",
        severity: "medium",
      },
    ],
    daysSinceLastEngagement: 5,
    recommendedAction: "Check in about the missed measurement — could signal disengagement or just a busy week.",
    studentNames: ["Ava", "Noah"],
  },
]

// ── Lead Priorities ───────────────────────────────────────────────────────

export const leadPriorities: LeadPriority[] = [
  {
    leadId: "lead-001",
    leadName: "Amanda Simmons",
    childName: "Olivia",
    childAge: 6,
    discipline: "Ballet",
    source: "referral",
    conversionScore: 87,
    signals: [
      "Booked trial class for Thursday",
      "Responded to welcome text in 2 hours",
      "Referred by the Kim family (3-year member)",
    ],
    recommendedAction: "Send a personal welcome before Thursday's trial. Mention the Kim family connection.",
    daysInPipeline: 4,
  },
  {
    leadId: "lead-003",
    leadName: "Rachel Park",
    childName: "Mia",
    childAge: 9,
    discipline: "Contemporary",
    source: "website",
    conversionScore: 74,
    signals: [
      "Trial completed — instructor noted strong potential",
      "Parent said 'Mia loved it' in post-trial text",
      "Hasn't enrolled yet (3 days since trial)",
    ],
    recommendedAction: "Follow up today — the enthusiasm is fresh. Offer to hold a spot in Contemporary I.",
    daysInPipeline: 12,
  },
  {
    leadId: "lead-002",
    leadName: "Carlos Mendez",
    childName: "Mateo",
    childAge: 8,
    discipline: "Hip Hop",
    source: "walk-in",
    conversionScore: 68,
    signals: [
      "Walked in asking about hip hop for boys",
      "Asked detailed questions about pricing and schedule",
      "Child's age matches open Junior slots",
    ],
    recommendedAction: "Call to schedule a trial — his questions suggest he's comparing options.",
    daysInPipeline: 7,
  },
  {
    leadId: "lead-005",
    leadName: "Nina Kowalski",
    childName: "Sophie",
    childAge: 5,
    discipline: "Ballet",
    source: "social-media",
    conversionScore: 45,
    signals: [
      "DM'd on Instagram asking about mini ballet",
      "Liked 4 studio posts this week",
      "No response to follow-up text yet (2 days)",
    ],
    recommendedAction: "Try responding via Instagram DM instead — that's where she's active.",
    daysInPipeline: 5,
  },
  {
    leadId: "lead-006",
    leadName: "David Thompson",
    childName: "Jake",
    childAge: 11,
    discipline: "Jazz",
    source: "phone",
    conversionScore: 32,
    signals: [
      "Called asking about teen jazz",
      "Mentioned baseball schedule conflict on Wednesdays",
      "Said he'd 'think about it' — no follow-up",
    ],
    recommendedAction: "Low priority — check back in 2 weeks. Note the Wednesday conflict for future scheduling.",
    daysInPipeline: 14,
  },
]

// ── Revenue Forecast ──────────────────────────────────────────────────────

export const revenueForecast: RevenueForecast = {
  currentMonth: "April 2026",
  projectedMrr: 97200,
  lastMonthMrr: 94230,
  mrrTrend: 3.2,
  netStudentMovement: 5,
  newEnrollments: 8,
  withdrawals: 3,
  narrative:
    "You're on track for $97.2K this month, up 3.2% from March. Eight spring enrollments are driving growth, but watch the 3 withdrawals — two cited schedule conflicts and one mentioned affordability. If the Garcia and Washington families disengage, that's another $1,920/month at risk.",
}

// ── Suggested Actions ─────────────────────────────────────────────────────

export const suggestedActions: SuggestedAction[] = [
  {
    id: "act-001",
    priority: "urgent",
    category: "retention",
    title: "Call the Garcia family — 3 warning signs converging",
    context:
      "Overdue invoice, 3 missed classes, unresponsive to texts. Camila and Diego are in 8 classes total — $960/mo at risk.",
    linkHref: "/households/hh-002",
  },
  {
    id: "act-002",
    priority: "urgent",
    category: "communication",
    title: "Reply to Sarah M.'s 3-star Google review",
    context:
      "Posted 2 days ago. Mentioned great teachers but frustration with parking. Unanswered reviews hurt your rating.",
    linkHref: "/reviews",
  },
  {
    id: "act-003",
    priority: "high",
    category: "growth",
    title: "Call Amanda S. — her daughter's trial is Thursday",
    context:
      "Referral lead, responded in 2 hours, highly engaged. A personal call before the trial could seal the deal.",
    linkHref: "/crm",
  },
  {
    id: "act-004",
    priority: "high",
    category: "retention",
    title: "Text the Washington family — no response in 12 days",
    context:
      "$475 outstanding, attendance down 40%. Try a phone call if text doesn't work by tomorrow.",
    linkHref: "/conversations",
  },
  {
    id: "act-005",
    priority: "high",
    category: "growth",
    title: "Follow up with Rachel P. — trial was 3 days ago",
    context:
      "Parent said 'Mia loved it.' Enthusiasm fades fast — reach out today to hold a spot.",
    linkHref: "/crm",
  },
  {
    id: "act-006",
    priority: "medium",
    category: "operations",
    title: "4 students missing recital costume measurements",
    context:
      "Spring Showcase measurements due in 5 days. Kaia Grant and Aoi Nakamura are late enrollees.",
    linkHref: "/recitals/rec-001",
  },
  {
    id: "act-007",
    priority: "medium",
    category: "communication",
    title: "6 families haven't responded to summer rollover email",
    context:
      "Sent 8 days ago. A follow-up text with a personal touch could get responses before the deadline.",
    linkHref: "/seasons/rollover",
  },
]

// ── Patterns & Trends ─────────────────────────────────────────────────────

export const insightPatterns: InsightPattern[] = [
  {
    id: "pat-001",
    title: "Tuesday 4pm absence spike",
    description:
      "Classes starting at 4:00 PM on Tuesdays have a 14.2% absence rate — 2.1x the studio average of 6.8%. This affects Ballet II (Juniors) and Jazz I (Minis). School pickup timing or after-school activity conflicts may be the cause.",
    dataPoint: "2.1x avg absence rate",
    category: "attendance",
  },
  {
    id: "pat-002",
    title: "Parking mentioned in 3 reviews this month",
    description:
      'Three separate Google reviews in March mentioned parking difficulty: "hard to find parking during rush hour," "wish there was more parking," and "parking lot was full." This is a recurring theme that may affect retention and trial conversions.',
    dataPoint: "3 mentions in 30 days",
    category: "reviews",
  },
  {
    id: "pat-003",
    title: "Referral families convert 40% faster",
    description:
      "Leads sourced from existing family referrals move from first contact to enrollment in an average of 8 days, compared to 14 days for website leads and 18 days for social media. Referral families also have a 22% higher retention rate after 6 months.",
    dataPoint: "40% faster conversion",
    category: "enrollment",
  },
]
