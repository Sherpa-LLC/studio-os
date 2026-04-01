import type { TextTemplate } from "@/lib/types"

export const textTemplates: TextTemplate[] = [
  {
    id: "tpl-001",
    name: "Welcome New Lead",
    body: "Hi {{parentName}}! Thanks for your interest in our studio. We'd love to have {{childName}} try a class! Would you like to schedule a free trial?",
    category: "welcome",
    shortcut: "/welcome",
  },
  {
    id: "tpl-002",
    name: "Trial Class Confirmation",
    body: "Hi {{parentName}}! Just confirming {{childName}}'s trial class on {{date}} at {{time}}. Please arrive 10 minutes early and wear comfortable clothing. We can't wait to meet you!",
    category: "reminder",
    shortcut: "/trial",
  },
  {
    id: "tpl-003",
    name: "Trial Reminder (Day Before)",
    body: "Hi {{parentName}}! Reminder that {{childName}}'s trial class is tomorrow at {{time}} in {{room}}. Don't forget comfortable clothes and hair pulled back. See you there!",
    category: "reminder",
    shortcut: "/remind",
  },
  {
    id: "tpl-004",
    name: "Post-Trial Follow Up",
    body: "Hi {{parentName}}! We loved having {{childName}} in class today! How did they enjoy it? We'd love to chat about getting them enrolled. Let me know if you have any questions!",
    category: "follow-up",
    shortcut: "/posttrial",
  },
  {
    id: "tpl-005",
    name: "Payment Past Due",
    body: "Hi {{parentName}}, this is a friendly reminder that your account has an outstanding balance of {{amount}}. Please visit your parent portal or reply to this message to arrange payment. Thank you!",
    category: "billing",
    shortcut: "/pastdue",
  },
  {
    id: "tpl-006",
    name: "Class Cancellation",
    body: "Hi {{parentName}}, unfortunately {{className}} on {{date}} has been cancelled due to {{reason}}. A makeup class will be scheduled and we'll notify you of the new date. Sorry for any inconvenience!",
    category: "general",
  },
  {
    id: "tpl-007",
    name: "Lead Follow-Up (No Response)",
    body: "Hi {{parentName}}! Just following up on my last message about dance classes for {{childName}}. We have a few spots left in our {{discipline}} program. Would you like to learn more or schedule a visit?",
    category: "follow-up",
    shortcut: "/followup",
  },
  {
    id: "tpl-008",
    name: "Recital Reminder",
    body: "Reminder: The Spring Showcase is on {{date}} at {{time}}! Please have your dancer arrive by {{arrivalTime}} in full costume with hair and makeup done. Break a leg!",
    category: "reminder",
  },
  {
    id: "tpl-009",
    name: "Invoice Ready",
    body: "Hi {{parentName}}, your {{month}} invoice for {{amount}} is ready. Payment is due by {{dueDate}}. View details in your parent portal. Thank you!",
    category: "billing",
    shortcut: "/invoice",
  },
  {
    id: "tpl-010",
    name: "Re-Enrollment Nudge",
    body: "Hi {{parentName}}! We miss {{childName}} at the studio! Our new season starts soon and we'd love to have them back. Reply to this message or visit our website to re-enroll. We have some exciting new classes this year!",
    category: "follow-up",
    shortcut: "/reenroll",
  },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

export function getTemplatesByCategory(category: TextTemplate["category"]): TextTemplate[] {
  return textTemplates.filter((t) => t.category === category)
}

export function searchTemplates(query: string): TextTemplate[] {
  const q = query.toLowerCase()
  return textTemplates.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.body.toLowerCase().includes(q) ||
      t.shortcut?.toLowerCase().includes(q)
  )
}
