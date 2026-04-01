import type { Automation } from "@/lib/types"

export const automations: Automation[] = [
  {
    id: "auto-001",
    name: "New Lead Follow-Up",
    description: "Automatically reach out to new leads with a welcome message and follow-up sequence to schedule a trial class.",
    trigger: "new-lead",
    steps: [
      { id: "s-001a", type: "send-sms", label: "Send welcome text", config: { template: "Welcome New Lead", delay: "0" } },
      { id: "s-001b", type: "wait", label: "Wait 1 day", config: { duration: "1 day" } },
      { id: "s-001c", type: "send-email", label: "Send info packet email", config: { template: "Studio Info Packet", delay: "0" } },
      { id: "s-001d", type: "wait", label: "Wait 2 days", config: { duration: "2 days" } },
      { id: "s-001e", type: "condition", label: "Check if replied", config: { field: "hasReplied", operator: "equals", value: "false" } },
      { id: "s-001f", type: "send-sms", label: "Follow-up text", config: { template: "Lead Follow-Up (No Response)", delay: "0" } },
      { id: "s-001g", type: "notify-staff", label: "Alert front desk", config: { message: "Lead hasn't responded after 3 days", assignTo: "Sarah Mitchell" } },
    ],
    status: "active",
    createdAt: "2025-09-01",
    runsCount: 287,
    successRate: 0.72,
  },
  {
    id: "auto-002",
    name: "Trial Class Reminder",
    description: "Send automated reminders before a scheduled trial class to reduce no-shows.",
    trigger: "trial-booked",
    steps: [
      { id: "s-002a", type: "send-sms", label: "Confirmation text", config: { template: "Trial Class Confirmation", delay: "0" } },
      { id: "s-002b", type: "send-email", label: "Send waiver & info", config: { template: "Trial Waiver Email", delay: "0" } },
      { id: "s-002c", type: "wait", label: "Wait until day before", config: { duration: "1 day before event" } },
      { id: "s-002d", type: "send-sms", label: "Day-before reminder", config: { template: "Trial Reminder (Day Before)", delay: "0" } },
      { id: "s-002e", type: "wait", label: "Wait until 2 hours before", config: { duration: "2 hours before event" } },
      { id: "s-002f", type: "send-sms", label: "Final reminder", config: { template: "Almost time! See you soon at the studio.", delay: "0" } },
    ],
    status: "active",
    createdAt: "2025-09-15",
    runsCount: 184,
    successRate: 0.89,
  },
  {
    id: "auto-003",
    name: "Post-Trial Enrollment",
    description: "Follow up after trial classes to convert trial attendees into enrolled students.",
    trigger: "trial-completed",
    steps: [
      { id: "s-003a", type: "wait", label: "Wait 2 hours", config: { duration: "2 hours" } },
      { id: "s-003b", type: "send-sms", label: "Post-trial check-in", config: { template: "Post-Trial Follow Up", delay: "0" } },
      { id: "s-003c", type: "wait", label: "Wait 2 days", config: { duration: "2 days" } },
      { id: "s-003d", type: "condition", label: "Check if enrolled", config: { field: "isEnrolled", operator: "equals", value: "false" } },
      { id: "s-003e", type: "send-email", label: "Enrollment offer email", config: { template: "Special Enrollment Offer", delay: "0" } },
      { id: "s-003f", type: "update-stage", label: "Move to Trial Completed", config: { stage: "trial-completed" } },
      { id: "s-003g", type: "notify-staff", label: "Alert for personal call", config: { message: "Trial attendee hasn't enrolled — personal call recommended", assignTo: "Sarah Mitchell" } },
    ],
    status: "active",
    createdAt: "2025-10-01",
    runsCount: 156,
    successRate: 0.64,
  },
  {
    id: "auto-004",
    name: "Missed Class Check-In",
    description: "Reach out to families when a student misses class without prior notice.",
    trigger: "missed-class",
    steps: [
      { id: "s-004a", type: "wait", label: "Wait 1 hour after class", config: { duration: "1 hour" } },
      { id: "s-004b", type: "send-sms", label: "Check-in text", config: { template: "We missed {{childName}} in class today! Everything okay? Let us know if you'd like to schedule a makeup class.", delay: "0" } },
      { id: "s-004c", type: "add-tag", label: "Tag as absent", config: { tag: "missed-class" } },
      { id: "s-004d", type: "condition", label: "3+ absences this month?", config: { field: "monthlyAbsences", operator: "gte", value: "3" } },
      { id: "s-004e", type: "notify-staff", label: "Flag for outreach", config: { message: "Student has 3+ absences this month — retention risk", assignTo: "Jennifer Walsh" } },
    ],
    status: "active",
    createdAt: "2025-11-01",
    runsCount: 93,
    successRate: 0.81,
  },
  {
    id: "auto-005",
    name: "Payment Reminder",
    description: "Automated payment reminders for overdue invoices with escalation.",
    trigger: "invoice-overdue",
    steps: [
      { id: "s-005a", type: "send-sms", label: "Friendly payment reminder", config: { template: "Payment Past Due", delay: "0" } },
      { id: "s-005b", type: "wait", label: "Wait 3 days", config: { duration: "3 days" } },
      { id: "s-005c", type: "condition", label: "Still unpaid?", config: { field: "isPaid", operator: "equals", value: "false" } },
      { id: "s-005d", type: "send-email", label: "Formal reminder email", config: { template: "Invoice Overdue Email", delay: "0" } },
      { id: "s-005e", type: "wait", label: "Wait 5 days", config: { duration: "5 days" } },
      { id: "s-005f", type: "notify-staff", label: "Escalate to billing", config: { message: "Invoice overdue 8+ days — manual follow-up needed", assignTo: "Sarah Mitchell" } },
    ],
    status: "active",
    createdAt: "2025-10-15",
    runsCount: 67,
    successRate: 0.91,
  },
  {
    id: "auto-006",
    name: "Birthday Message",
    description: "Send a birthday message to students with a special offer.",
    trigger: "birthday",
    steps: [
      { id: "s-006a", type: "send-sms", label: "Birthday text", config: { template: "Happy Birthday, {{childName}}! 🎂 From your dance family at the studio. We have a special surprise waiting for you at your next class!", delay: "0" } },
      { id: "s-006b", type: "send-email", label: "Birthday email with coupon", config: { template: "Birthday Celebration Email", delay: "0" } },
      { id: "s-006c", type: "add-tag", label: "Tag birthday month", config: { tag: "birthday-current-month" } },
    ],
    status: "active",
    createdAt: "2025-12-01",
    runsCount: 42,
    successRate: 0.95,
  },
  {
    id: "auto-007",
    name: "Re-Engagement Campaign",
    description: "Win back families who haven't attended in 60+ days with a personalized re-enrollment offer.",
    trigger: "missed-class",
    steps: [
      { id: "s-007a", type: "condition", label: "Inactive 60+ days?", config: { field: "daysSinceLastClass", operator: "gte", value: "60" } },
      { id: "s-007b", type: "send-sms", label: "We miss you text", config: { template: "Re-Enrollment Nudge", delay: "0" } },
      { id: "s-007c", type: "wait", label: "Wait 5 days", config: { duration: "5 days" } },
      { id: "s-007d", type: "send-email", label: "Special offer email", config: { template: "Come Back Offer — 20% Off First Month", delay: "0" } },
      { id: "s-007e", type: "wait", label: "Wait 7 days", config: { duration: "7 days" } },
      { id: "s-007f", type: "notify-staff", label: "Personal call needed", config: { message: "Inactive family hasn't responded to re-engagement — personal call recommended", assignTo: "Jennifer Walsh" } },
    ],
    status: "paused",
    createdAt: "2026-01-15",
    runsCount: 18,
    successRate: 0.33,
  },
  {
    id: "auto-008",
    name: "Review Request",
    description: "Ask happy families to leave a Google review after positive milestones.",
    trigger: "enrollment",
    steps: [
      { id: "s-008a", type: "wait", label: "Wait 30 days", config: { duration: "30 days" } },
      { id: "s-008b", type: "send-sms", label: "Review request text", config: { template: "Hi {{parentName}}! We hope {{childName}} is loving dance class. Would you mind leaving us a quick Google review? It means the world to our small studio! {{reviewLink}}", delay: "0" } },
      { id: "s-008c", type: "add-tag", label: "Tag review requested", config: { tag: "review-requested" } },
    ],
    status: "active",
    createdAt: "2026-02-01",
    runsCount: 31,
    successRate: 0.45,
  },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

export function getAutomationById(id: string): Automation | undefined {
  return automations.find((a) => a.id === id)
}

export function getActiveAutomations(): Automation[] {
  return automations.filter((a) => a.status === "active")
}
