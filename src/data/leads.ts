import type { Lead, LeadStage } from "@/lib/types"

export const leads: Lead[] = [
  // ── Stage: new ─────────────────────────────────────────────────────────────
  {
    id: "lead-001", firstName: "Amanda", lastName: "Simmons", email: "amanda.simmons@email.com",
    phone: "5551234001", childName: "Lily Simmons", childAge: 6,
    interestDiscipline: "ballet", source: "website", stage: "new",
    notes: "Filled out interest form for ballet classes",
    createdAt: "2026-03-25",
  },
  {
    id: "lead-002", firstName: "Carlos", lastName: "Mendez", email: "carlos.mendez@email.com",
    phone: "5551234002", childName: "Sofia Mendez", childAge: 9,
    interestDiscipline: "hip-hop", source: "social-media", stage: "new",
    notes: "Saw our Instagram reel of Hip Hop Showcase",
    createdAt: "2026-03-24",
  },
  {
    id: "lead-003", firstName: "Rachel", lastName: "Park", email: "rachel.park@email.com",
    phone: "5551234003", childName: "Mina Park", childAge: 4,
    interestDiscipline: "ballet", source: "referral", stage: "new",
    notes: "Referred by the Kim family",
    createdAt: "2026-03-23",
  },
  {
    id: "lead-004", firstName: "David", lastName: "Thompson", email: "david.t@email.com",
    phone: "5551234004", childName: "Ava Thompson", childAge: 7,
    interestDiscipline: "jazz", source: "walk-in", stage: "new",
    notes: "Walked in during Bring a Friend Week",
    createdAt: "2026-03-22",
  },
  {
    id: "lead-005", firstName: "Nina", lastName: "Kowalski", email: "nina.k@email.com",
    phone: "5551234005", childName: "Zoey Kowalski", childAge: 5,
    interestDiscipline: "ballet", source: "website", stage: "new",
    notes: "Requested info about Tiny Tots program",
    createdAt: "2026-03-20",
  },
  {
    id: "lead-006", firstName: "Marcus", lastName: "Williams", email: "marcus.w@email.com",
    phone: "5551234006", childName: "Jayden Williams", childAge: 8,
    interestDiscipline: "hip-hop", source: "social-media", stage: "new",
    notes: "DM'd us on Instagram asking about hip hop for boys",
    createdAt: "2026-03-18",
  },
  {
    id: "lead-007", firstName: "Susan", lastName: "Clarke", email: "susan.clarke@email.com",
    phone: "5551234007", childName: "Emma Clarke", childAge: 11,
    interestDiscipline: "contemporary", source: "phone", stage: "new",
    notes: "Called asking about contemporary classes for pre-teen",
    createdAt: "2026-03-17",
  },
  {
    id: "lead-008", firstName: "Priya", lastName: "Sharma", email: "priya.sharma@email.com",
    phone: "5551234008", childName: "Anaya Sharma", childAge: 3,
    interestDiscipline: "ballet", source: "referral", stage: "new",
    notes: "Friend of the Patel family, interested in toddler classes",
    createdAt: "2026-03-15",
  },
  {
    id: "lead-009", firstName: "James", lastName: "O'Connor", email: "james.oc@email.com",
    phone: "5551234009", childName: "Sienna O'Connor", childAge: 10,
    interestDiscipline: "acro", source: "website", stage: "new",
    notes: "Submitted online inquiry about acrobatics program",
    createdAt: "2026-03-12",
  },
  {
    id: "lead-010", firstName: "Linda", lastName: "Nakamura", email: "linda.n@email.com",
    phone: "5551234010", childName: "Hana Nakamura", childAge: 6,
    interestDiscipline: "tap", source: "walk-in", stage: "new",
    notes: "Stopped by during open house event",
    createdAt: "2026-03-10",
  },
  // ── Stage: contacted ───────────────────────────────────────────────────────
  {
    id: "lead-011", firstName: "Brian", lastName: "Foster", email: "brian.foster@email.com",
    phone: "5551234011", childName: "Olivia Foster", childAge: 7,
    interestDiscipline: "ballet", source: "website", stage: "contacted",
    notes: "Sent info packet and class schedule via email",
    createdAt: "2026-03-08", lastContactedAt: "2026-03-10",
  },
  {
    id: "lead-012", firstName: "Michelle", lastName: "Santos", email: "michelle.s@email.com",
    phone: "5551234012", childName: "Isabella Santos", childAge: 12,
    interestDiscipline: "lyrical", source: "referral", stage: "contacted",
    notes: "Referred by the Garcia family. Called and discussed lyrical and contemporary options",
    createdAt: "2026-03-05", lastContactedAt: "2026-03-08",
  },
  {
    id: "lead-013", firstName: "Tom", lastName: "Baker", email: "tom.baker@email.com",
    phone: "5551234013", childName: "Charlotte Baker", childAge: 5,
    interestDiscipline: "ballet", source: "social-media", stage: "contacted",
    notes: "Found us on Facebook. Emailed class options for kindergarteners",
    createdAt: "2026-03-02", lastContactedAt: "2026-03-05",
  },
  {
    id: "lead-014", firstName: "Kenji", lastName: "Tanaka", email: "kenji.t@email.com",
    phone: "5551234014", childName: "Ren Tanaka", childAge: 9,
    interestDiscipline: "tap", source: "phone", stage: "contacted",
    notes: "Father called, son wants to learn tap. Discussed boys in dance program",
    createdAt: "2026-02-28", lastContactedAt: "2026-03-02",
  },
  {
    id: "lead-015", firstName: "Sarah", lastName: "Reynolds", email: "sarah.r@email.com",
    phone: "5551234015", childName: "Piper Reynolds", childAge: 14,
    interestDiscipline: "contemporary", source: "trial", stage: "contacted",
    notes: "Attended open house, very interested. Sent follow-up email with teen schedule",
    createdAt: "2026-02-25", lastContactedAt: "2026-03-01",
  },
  {
    id: "lead-016", firstName: "Diane", lastName: "Marshall", email: "diane.m@email.com",
    phone: "5551234016", childName: "Ellie Marshall", childAge: 8,
    interestDiscipline: "jazz", source: "walk-in", stage: "contacted",
    notes: "Mom visited studio, took brochure. Called back to discuss jazz options",
    createdAt: "2026-02-22", lastContactedAt: "2026-02-26",
  },
  {
    id: "lead-017", firstName: "Wei", lastName: "Zhang", email: "wei.zhang@email.com",
    phone: "5551234017", childName: "Mei Zhang", childAge: 6,
    interestDiscipline: "ballet", source: "referral", stage: "contacted",
    notes: "Referred by the Chen family. Discussed minis ballet options",
    createdAt: "2026-02-20", lastContactedAt: "2026-02-24",
  },
  {
    id: "lead-018", firstName: "Lauren", lastName: "Hughes", email: "lauren.h@email.com",
    phone: "5551234018", childName: "Isla Hughes", childAge: 4,
    interestDiscipline: "ballet", source: "website", stage: "contacted",
    notes: "Submitted web form. Sent welcome info and Tiny Tots schedule",
    createdAt: "2026-02-18", lastContactedAt: "2026-02-20",
  },
  // ── Stage: trial-scheduled ─────────────────────────────────────────────────
  {
    id: "lead-019", firstName: "Jennifer", lastName: "Wright", email: "jen.wright@email.com",
    phone: "5551234019", childName: "Chloe Wright", childAge: 10,
    interestDiscipline: "jazz", source: "referral", stage: "trial-scheduled",
    notes: "Trial class booked for March 28, Jazz Juniors. Referred by Murphy family",
    createdAt: "2026-02-15", lastContactedAt: "2026-03-20",
  },
  {
    id: "lead-020", firstName: "Anthony", lastName: "Russo", email: "anthony.r@email.com",
    phone: "5551234020", childName: "Gianna Russo", childAge: 7,
    interestDiscipline: "ballet", source: "website", stage: "trial-scheduled",
    notes: "Trial class scheduled for March 29, Ballet Minis Saturday",
    createdAt: "2026-02-10", lastContactedAt: "2026-03-18",
  },
  {
    id: "lead-021", firstName: "Crystal", lastName: "Johnson", email: "crystal.j@email.com",
    phone: "5551234021", childName: "Destiny Johnson", childAge: 13,
    interestDiscipline: "hip-hop", source: "social-media", stage: "trial-scheduled",
    notes: "Saw TikTok of our hip hop team. Trial set for April 1, Hip Hop Teens",
    createdAt: "2026-02-08", lastContactedAt: "2026-03-15",
  },
  {
    id: "lead-022", firstName: "Patrick", lastName: "Kelly", email: "patrick.k@email.com",
    phone: "5551234022", childName: "Maeve Kelly", childAge: 5,
    interestDiscipline: "ballet", source: "walk-in", stage: "trial-scheduled",
    notes: "Walked in with daughter, fell in love with the studio. Trial booked for March 30",
    createdAt: "2026-02-05", lastContactedAt: "2026-03-12",
  },
  {
    id: "lead-023", firstName: "Helen", lastName: "Novak", email: "helen.n@email.com",
    phone: "5551234023", childName: "Katarina Novak", childAge: 11,
    interestDiscipline: "lyrical", source: "phone", stage: "trial-scheduled",
    notes: "Called to ask about lyrical. Trial scheduled for April 2",
    createdAt: "2026-02-01", lastContactedAt: "2026-03-10",
  },
  {
    id: "lead-024", firstName: "Derek", lastName: "Moore", email: "derek.m@email.com",
    phone: "5551234024", childName: "Aiden Moore", childAge: 8,
    interestDiscipline: "hip-hop", source: "referral", stage: "trial-scheduled",
    notes: "Referred by the Jackson family. Trial set for March 31, Hip Hop Juniors",
    createdAt: "2026-01-28", lastContactedAt: "2026-03-08",
  },
  // ── Stage: trial-completed ─────────────────────────────────────────────────
  {
    id: "lead-025", firstName: "Rebecca", lastName: "Adams", email: "rebecca.a@email.com",
    phone: "5551234025", childName: "Sophia Adams", childAge: 6,
    interestDiscipline: "ballet", source: "referral", stage: "trial-completed",
    notes: "Loved the trial class! Daughter was shy at first but warmed up quickly. Mom wants to discuss pricing",
    createdAt: "2026-01-25", lastContactedAt: "2026-03-18",
  },
  {
    id: "lead-026", firstName: "Kevin", lastName: "Diaz", email: "kevin.d@email.com",
    phone: "5551234026", childName: "Luna Diaz", childAge: 9,
    interestDiscipline: "contemporary", source: "trial", stage: "trial-completed",
    notes: "Attended trial on March 12. Very talented dancer. Instructor recommended Contemporary II",
    createdAt: "2026-01-20", lastContactedAt: "2026-03-15",
  },
  {
    id: "lead-027", firstName: "Samantha", lastName: "Green", email: "samantha.g@email.com",
    phone: "5551234027", childName: "Ruby Green", childAge: 4,
    interestDiscipline: "ballet", source: "walk-in", stage: "trial-completed",
    notes: "Trial on March 8. Adorable in class. Parents comparing with another studio",
    createdAt: "2026-01-15", lastContactedAt: "2026-03-12",
  },
  {
    id: "lead-028", firstName: "Hassan", lastName: "Ali", email: "hassan.a@email.com",
    phone: "5551234028", childName: "Layla Ali", childAge: 12,
    interestDiscipline: "jazz", source: "social-media", stage: "trial-completed",
    notes: "Trial on March 5. Dad wants to check with mom before enrolling. Strong dancer",
    createdAt: "2026-01-10", lastContactedAt: "2026-03-10",
  },
  {
    id: "lead-029", firstName: "Emily", lastName: "Watson", email: "emily.w@email.com",
    phone: "5551234029", childName: "Aria Watson", childAge: 15,
    interestDiscipline: "pointe", source: "phone", stage: "trial-completed",
    notes: "Transferred from another studio. Trial on March 1. Instructor approved for Pointe II",
    createdAt: "2026-01-05", lastContactedAt: "2026-03-05",
  },
  // ── Stage: registered ──────────────────────────────────────────────────────
  {
    id: "lead-030", firstName: "Michael", lastName: "Brown", email: "michael.b@email.com",
    phone: "5551234030", childName: "Zoe Brown", childAge: 7,
    interestDiscipline: "ballet", source: "referral", stage: "registered",
    notes: "Enrolled in Ballet Minis after trial. Start date: March 10",
    createdAt: "2025-12-20", lastContactedAt: "2026-03-08",
  },
  {
    id: "lead-031", firstName: "Lisa", lastName: "Chen", email: "lisa.chen@email.com",
    phone: "5551234031", childName: "Ivy Chen", childAge: 10,
    interestDiscipline: "jazz", source: "website", stage: "registered",
    notes: "Registered for Jazz Juniors starting January. Smooth onboarding",
    createdAt: "2025-12-15", lastContactedAt: "2026-01-05",
  },
  {
    id: "lead-032", firstName: "Robert", lastName: "Kim", email: "robert.kim@email.com",
    phone: "5551234032", childName: "Grace Kim", childAge: 14,
    interestDiscipline: "contemporary", source: "trial", stage: "registered",
    notes: "Enrolled in Contemporary Teens and Lyrical. Very committed family",
    createdAt: "2025-12-10", lastContactedAt: "2026-01-02",
  },
  {
    id: "lead-033", firstName: "Angela", lastName: "Davis", email: "angela.d@email.com",
    phone: "5551234033", childName: "Aaliyah Davis", childAge: 8,
    interestDiscipline: "hip-hop", source: "social-media", stage: "registered",
    notes: "Signed up for Hip Hop Juniors after seeing our competition video",
    createdAt: "2025-12-05", lastContactedAt: "2025-12-20",
  },
  {
    id: "lead-034", firstName: "Steve", lastName: "Murphy", email: "steve.m@email.com",
    phone: "5551234034", childName: "Fiona Murphy", childAge: 11,
    interestDiscipline: "tap", source: "walk-in", stage: "registered",
    notes: "Enrolled in Tap Juniors and Jazz. Great addition to the studio",
    createdAt: "2025-11-28", lastContactedAt: "2025-12-15",
  },
  {
    id: "lead-035", firstName: "Maria", lastName: "Gonzalez", email: "maria.g@email.com",
    phone: "5551234035", childName: "Camila Gonzalez", childAge: 5,
    interestDiscipline: "ballet", source: "referral", stage: "registered",
    notes: "Referred by the Rossi family. Enrolled in Tiny Tots Ballet",
    createdAt: "2025-11-20", lastContactedAt: "2025-12-10",
  },
  {
    id: "lead-036", firstName: "Chris", lastName: "Taylor", email: "chris.t@email.com",
    phone: "5551234036", childName: "Harper Taylor", childAge: 13,
    interestDiscipline: "musical-theatre", source: "phone", stage: "registered",
    notes: "Enrolled in Musical Theatre Teens. Previous theatre experience",
    createdAt: "2025-11-15", lastContactedAt: "2025-12-05",
  },
  {
    id: "lead-037", firstName: "Diana", lastName: "Volkov", email: "diana.v@email.com",
    phone: "5551234037", childName: "Natasha Volkov", childAge: 3,
    interestDiscipline: "ballet", source: "walk-in", stage: "registered",
    notes: "Enrolled in Princess Ballet Tiny Tots. Lives nearby",
    createdAt: "2025-11-10", lastContactedAt: "2025-11-28",
  },
  // ── Stage: lost ────────────────────────────────────────────────────────────
  {
    id: "lead-038", firstName: "Greg", lastName: "Anderson", email: "greg.a@email.com",
    phone: "5551234038", childName: "Cora Anderson", childAge: 8,
    interestDiscipline: "ballet", source: "website", stage: "lost",
    notes: "Schedule conflict with soccer. May revisit in fall",
    createdAt: "2026-01-15", lastContactedAt: "2026-02-20",
  },
  {
    id: "lead-039", firstName: "Tanya", lastName: "White", email: "tanya.w@email.com",
    phone: "5551234039", childName: "Maya White", childAge: 11,
    interestDiscipline: "jazz", source: "referral", stage: "lost",
    notes: "Chose a different studio closer to home",
    createdAt: "2026-01-10", lastContactedAt: "2026-02-15",
  },
  {
    id: "lead-040", firstName: "Frank", lastName: "Romano", email: "frank.r@email.com",
    phone: "5551234040", childName: "Stella Romano", childAge: 6,
    interestDiscipline: "ballet", source: "walk-in", stage: "lost",
    notes: "Daughter decided she doesn't want to dance. Family may return later",
    createdAt: "2026-01-05", lastContactedAt: "2026-02-10",
  },
  {
    id: "lead-041", firstName: "Joyce", lastName: "Nguyen", email: "joyce.n@email.com",
    phone: "5551234041", childName: "Trang Nguyen", childAge: 13,
    interestDiscipline: "contemporary", source: "phone", stage: "lost",
    notes: "Couldn't afford tuition. Offered payment plan but declined",
    createdAt: "2025-12-20", lastContactedAt: "2026-02-05",
  },
  {
    id: "lead-042", firstName: "Eduardo", lastName: "Cruz", email: "eduardo.c@email.com",
    phone: "5551234042", childName: "Valentina Cruz", childAge: 9,
    interestDiscipline: "hip-hop", source: "social-media", stage: "lost",
    notes: "No response after multiple follow-ups. Marked as unresponsive",
    createdAt: "2025-12-15", lastContactedAt: "2026-02-01",
  },
]

// ── Helper functions ──────────────────────────────────────────────────────────

export function getLeadsByStage(stage: LeadStage): Lead[] {
  return leads.filter((l) => l.stage === stage)
}

export function getLeadById(id: string): Lead | undefined {
  return leads.find((l) => l.id === id)
}

export function searchLeads(query: string): Lead[] {
  const q = query.toLowerCase()
  return leads.filter(
    (l) =>
      l.firstName.toLowerCase().includes(q) ||
      l.lastName.toLowerCase().includes(q) ||
      l.childName.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q),
  )
}
