// ── Scalar types ──────────────────────────────────────────────────────────────

export type Role = "admin" | "office" | "attendance" | "parent"

export type Discipline =
  | "ballet"
  | "jazz"
  | "tap"
  | "contemporary"
  | "hip-hop"
  | "lyrical"
  | "acro"
  | "musical-theatre"
  | "pointe"

export type AgeGroup =
  | "tiny-tots"
  | "minis"
  | "juniors"
  | "teens"
  | "seniors"
  | "adults"

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"

export type EnrollmentStatus =
  | "active"
  | "waitlisted"
  | "trial"
  | "withdrawn"
  | "graduated"

export type LeadStage =
  | "new"
  | "contacted"
  | "trial-scheduled"
  | "trial-completed"
  | "registered"
  | "lost"

export type PaymentStatus =
  | "paid"
  | "pending"
  | "overdue"
  | "failed"
  | "refunded"

export type MessageChannel = "email" | "sms" | "both"

export type ConversationChannel = "sms" | "email" | "facebook" | "instagram" | "webchat"

export type AttendanceStatus = "present" | "absent" | "late" | "excused"

// ── Entity interfaces ─────────────────────────────────────────────────────────

export interface Guardian {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  relationship: "mother" | "father" | "guardian" | "grandparent" | "other"
}

export interface Student {
  id: string
  householdId: string
  firstName: string
  lastName: string
  dateOfBirth: string // ISO date
  age: number
  gender: "female" | "male" | "other"
  medicalNotes?: string
  enrollmentStatus: EnrollmentStatus
  enrolledClassIds: string[]
  measurements?: {
    height?: string
    chest?: string
    waist?: string
    hips?: string
    inseam?: string
  }
}

export interface Household {
  id: string
  guardians: Guardian[]
  studentIds: string[]
  address: {
    street: string
    city: string
    state: string
    zip: string
  }
  createdAt: string
  status: "active" | "inactive" | "archived"
  balance: number // positive = owes money, negative = credit
  paymentMethod?: {
    type: "visa" | "mastercard" | "amex"
    last4: string
    expiry: string
  }
}

export interface Instructor {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  specialties: Discipline[]
  payRate: number // per hour
  payType: "hourly" | "per-class"
  avatar?: string
}

export interface Class {
  id: string
  name: string
  discipline: Discipline
  ageGroup: AgeGroup
  description: string
  instructorId: string
  seasonId: string
  schedule: {
    day: DayOfWeek
    startTime: string // "15:30"
    endTime: string // "16:30"
    room: "Studio A" | "Studio B" | "Studio C" | "Studio D"
  }
  capacity: number
  enrolledCount: number
  waitlistCount: number
  monthlyRate: number
  ageRange: { min: number; max: number }
  status: "active" | "cancelled" | "completed"
}

export interface Season {
  id: string
  name: string
  startDate: string
  endDate: string
  billingRate: number // per hour
  status: "upcoming" | "active" | "completed"
}

export interface Invoice {
  id: string
  householdId: string
  date: string
  dueDate: string
  lineItems: InvoiceLineItem[]
  subtotal: number
  total: number
  status: PaymentStatus
  paidDate?: string
}

export interface InvoiceLineItem {
  id: string
  studentId: string
  classId: string
  description: string
  amount: number
  override?: BillingOverride
}

export interface BillingOverride {
  id: string
  originalAmount: number
  newAmount: number
  reason: string
  createdBy: string
  createdAt: string
}

export interface Message {
  id: string
  subject: string
  body: string
  channel: MessageChannel
  audience: string // description of target audience
  audienceCount: number
  sentBy: string
  sentAt: string
  status: "sent" | "scheduled" | "draft"
  deliveredCount?: number
  openedCount?: number
}

export interface AttendanceRecord {
  id: string
  classId: string
  studentId: string
  date: string
  status: AttendanceStatus
  markedBy: string
  markedAt: string
}

export interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  childName: string
  childAge: number
  interestDiscipline: Discipline
  source: "website" | "walk-in" | "referral" | "trial" | "social-media" | "phone"
  stage: LeadStage
  notes: string
  createdAt: string
  lastContactedAt?: string
  assignedTo?: string
}

// ── Conversations ────────────────────────────────────────────────────────────

export interface ConversationMessage {
  id: string
  conversationId: string
  direction: "inbound" | "outbound"
  channel: ConversationChannel
  body: string
  timestamp: string // ISO datetime
  read: boolean
}

export interface Conversation {
  id: string
  contactName: string
  contactPhone: string
  contactEmail: string
  contactType: "lead" | "household"
  contactId: string
  lastMessage: string
  lastMessageAt: string // ISO datetime
  unreadCount: number
  channel: ConversationChannel
  status: "open" | "closed" | "snoozed"
  messages: ConversationMessage[]
}

// ── Text Templates ───────────────────────────────────────────────────────────

export type TemplateCategory = "follow-up" | "reminder" | "welcome" | "billing" | "general"

export interface TextTemplate {
  id: string
  name: string
  body: string
  category: TemplateCategory
  shortcut?: string // e.g. "/welcome"
}

// ── Automations ──────────────────────────────────────────────────────────────

export type AutomationTrigger =
  | "new-lead"
  | "trial-booked"
  | "trial-completed"
  | "enrollment"
  | "missed-class"
  | "invoice-overdue"
  | "birthday"

export type AutomationStepType =
  | "send-sms"
  | "send-email"
  | "wait"
  | "condition"
  | "update-stage"
  | "add-tag"
  | "notify-staff"

export interface AutomationStep {
  id: string
  type: AutomationStepType
  label: string
  config: Record<string, string>
}

export interface Automation {
  id: string
  name: string
  description: string
  trigger: AutomationTrigger
  steps: AutomationStep[]
  status: "active" | "paused" | "draft"
  createdAt: string
  runsCount: number
  successRate: number
}

// ── Trial Slots ──────────────────────────────────────────────────────────────

export interface TrialSlot {
  id: string
  classId: string
  className: string
  discipline: Discipline
  date: string // ISO date
  startTime: string // "15:30"
  endTime: string // "16:30"
  room: string
  instructorName: string
  availableSpots: number
  bookedCount: number
}

// ── Lead Source Analytics ─────────────────────────────────────────────────────

export interface LeadSourceMetric {
  source: Lead["source"]
  leads: number
  trialsBooked: number
  enrollments: number
  conversionRate: number
  avgDaysToConvert: number
  revenueAttributed: number
}

// ── Reviews ──────────────────────────────────────────────────────────────────

export type ReviewPlatform = "google" | "facebook" | "yelp"

export interface Review {
  id: string
  platform: ReviewPlatform
  author: string
  rating: 1 | 2 | 3 | 4 | 5
  body: string
  date: string
  responded: boolean
  responseBody?: string
}

// ── Saved Segments ───────────────────────────────────────────────────────────

export interface SegmentRule {
  field: string
  operator: "equals" | "not_equals" | "contains" | "gt" | "lt" | "gte" | "lte"
  value: string
}

export interface SavedSegment {
  id: string
  name: string
  rules: SegmentRule[]
  contactCount: number
  createdAt: string
}

// ── Call Records ─────────────────────────────────────────────────────────────

export interface CallRecord {
  id: string
  contactId: string
  contactName: string
  direction: "inbound" | "outbound"
  duration: number // seconds
  timestamp: string // ISO datetime
  status: "completed" | "missed" | "voicemail"
}

// ── Recitals & Costumes ─────────────────────────────────────────────────────

export type RecitalStatus = "planning" | "ordering" | "rehearsals" | "show-week" | "completed"
export type CostumeOrderStatus = "not-ordered" | "ordered" | "received" | "distributed"
export type MeasurementStatus = "complete" | "needs-update" | "missing"

export interface Recital {
  id: string
  name: string
  date: string
  venue: string
  theme?: string
  description?: string
  status: RecitalStatus
  routines: Routine[]
}

export interface Routine {
  id: string
  recitalId: string
  name: string
  classId: string
  className: string
  discipline: Discipline
  costume: CostumeEntry
  lineupPosition: number
  estimatedDuration: number // minutes
  studentCount: number
}

export interface CostumeEntry {
  name: string
  description: string
  supplier: string
  unitCost: number
  salePrice: number
  photoUrl?: string
  orderStatus: CostumeOrderStatus
  sizeBreakdown?: Record<string, number> // e.g. { "S": 4, "M": 8 }
}

export interface StudentMeasurement {
  studentId: string
  studentName: string
  classId: string
  routineName: string
  height?: string
  chest?: string
  waist?: string
  hips?: string
  inseam?: string
  assignedSize?: string
  status: MeasurementStatus
}

// ── Competition Teams ───────────────────────────────────────────────────────

export type TeamFeeStatus = "paid" | "pending" | "overdue"
export type WaiverStatus = "signed" | "not-signed"
export type CompetitionStatus = "registered" | "pending" | "upcoming"

export interface CompetitionTeam {
  id: string
  name: string
  disciplines: Discipline[]
  ageGroup: AgeGroup
  headCoach: string
  season: string
  studentCount: number
  roster: TeamMember[]
  competitions: CompetitionEvent[]
  financials: TeamFinancials
  messages: TeamMessage[]
}

export interface TeamMember {
  studentId: string
  studentName: string
  age: number
  parentName: string
  feeStatus: TeamFeeStatus
  waiverStatus: WaiverStatus
  teamFee: number
  competitionFees: number
  costumeFees: number
  totalOwed: number
  totalPaid: number
}

export interface CompetitionEvent {
  id: string
  name: string
  date: string
  location: string
  entryDeadline: string
  status: CompetitionStatus
  entryFees: number
  travelCost: number
  hotelCost: number
  routines: string[]
  logistics?: string
}

export interface TeamFinancials {
  totalFeesCollected: number
  totalCompetitionCosts: number
  netPosition: number
}

export interface TeamMessage {
  id: string
  subject: string
  body: string
  sentAt: string
  sentBy: string
}

// ── Season Rollover ─────────────────────────────────────────────────────────

export type RolloverResponseStatus = "confirmed" | "opted-out" | "change-requested" | "no-response"

export interface RolloverConfig {
  sourceSeasonId: string
  sourceSeasonName: string
  targetSeasonName: string
  rolloverDate: string
  registrationFee: number
  notificationDate: string
  currentStep: number // 1-5
}

export interface RolloverHouseholdResponse {
  householdId: string
  householdName: string
  status: RolloverResponseStatus
  currentClasses: string[]
  suggestedClasses: string[]
  requestedChanges?: string
  reason?: string
  daysSinceNotification?: number
}

export interface AgeUpFlag {
  studentName: string
  currentAgeGroup: string
  newAgeGroup: string
  suggestedClass: string
}

// ── Staff Management ────────────────────────────────────────────────────────

export type StaffRole = "instructor" | "assistant" | "sub" | "admin"
export type StaffStatus = "active" | "on-leave" | "inactive"

export interface StaffMember {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: StaffRole
  disciplines: Discipline[]
  status: StaffStatus
  payRate: number
  payType: "hourly" | "per-class"
  avatar?: string
  hireDate: string
  certifications: Certification[]
  classIds: string[]
  weeklyHours: number
  monthlyCompensation: number
  availability: AvailabilitySlot[]
}

export interface Certification {
  name: string
  expiresAt?: string
}

export interface AvailabilitySlot {
  day: DayOfWeek
  period: "morning" | "afternoon" | "evening"
  available: boolean
}

export interface SubRequest {
  id: string
  classId: string
  className: string
  date: string
  time: string
  originalInstructor: string
  status: "open" | "covered" | "cancelled"
  coveredBy?: string
}

// ── Knowledge Base ──────────────────────────────────────────────────────────

export type ArticleCategory =
  | "policies-procedures"
  | "curriculum-lesson-plans"
  | "studio-operations"
  | "sub-handbook"
  | "hr-staff"

export interface KnowledgeBaseArticle {
  id: string
  title: string
  category: ArticleCategory
  body: string
  author: string
  updatedAt: string
  relatedArticleIds: string[]
  linkedClassIds?: string[]
}

// ── Class Profitability ─────────────────────────────────────────────────────

export interface ClassFinancials {
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

// ── Studio Financials ───────────────────────────────────────────────────────

export interface FinancialCategory {
  id: string
  name: string
  type: "expense" | "revenue"
  sortOrder: number
}

export interface FinancialLineItem {
  id: string
  categoryId: string
  name: string
  defaultMonthlyAmount: number
  isAutoCalculated?: boolean
}

export interface MonthlyFinancialEntry {
  lineItemId: string
  month: string // "2026-01" format
  amount: number
}

export type AllocationMethod = "equal" | "hours" | "revenue" | "custom"

export interface StudioFinancialSettings {
  allocationMethod: AllocationMethod
  customWeights?: Record<string, number> // classId → weight percentage
}

// ── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardStats {
  activeStudents: number
  activeStudentsTrend: number // percentage change
  payingStudents: number
  trialStudents: number
  waitlistedStudents: number
  mrr: number
  mrrTrend: number
  attritionRate: number
  attritionTrend: number
  newEnrollments: number
  newEnrollmentsTrend: number
  upcomingBilling: number
  revenueByMonth: { month: string; revenue: number }[]
  enrollmentByDiscipline: { discipline: string; count: number }[]
  classFillRates: {
    className: string
    enrolled: number
    capacity: number
    fillRate: number
  }[]
}
