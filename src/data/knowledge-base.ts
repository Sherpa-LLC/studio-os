import type { ArticleCategory, KnowledgeBaseArticle } from "@/lib/types"

// ── Category metadata ────────────────────────────────────────────────────────

export interface CategoryMeta {
  id: ArticleCategory
  label: string
  description: string
  icon: string // lucide icon name for reference
  articleCount: number
}

export const categories: CategoryMeta[] = [
  {
    id: "policies-procedures",
    label: "Policies & Procedures",
    description:
      "Studio rules, attendance policies, dress codes, and parent handbooks.",
    icon: "Book",
    articleCount: 8,
  },
  {
    id: "curriculum-lesson-plans",
    label: "Curriculum & Lesson Plans",
    description:
      "Structured lesson plans by discipline, level, and week — ready for class.",
    icon: "FileText",
    articleCount: 12,
  },
  {
    id: "studio-operations",
    label: "Studio Operations",
    description:
      "Opening/closing checklists, facility procedures, and daily ops guides.",
    icon: "Settings",
    articleCount: 6,
  },
  {
    id: "sub-handbook",
    label: "Substitute Handbook",
    description:
      "Everything a substitute instructor needs to know before stepping in.",
    icon: "UserCheck",
    articleCount: 4,
  },
  {
    id: "hr-staff",
    label: "HR & Staff",
    description:
      "PTO policies, benefits, pay schedules, and staff onboarding materials.",
    icon: "Briefcase",
    articleCount: 5,
  },
]

// ── Articles ─────────────────────────────────────────────────────────────────

export const articles: KnowledgeBaseArticle[] = [
  // ── Studio Operations ─────────────────────────────────────────────────────
  {
    id: "kb-001",
    title: "Opening Checklist — Front Desk",
    category: "studio-operations",
    author: "Pam Richardson",
    updatedAt: "2026-03-28",
    relatedArticleIds: ["kb-002", "kb-006"],
    body: `Opening Checklist — Front Desk

This checklist must be completed by the opening front desk staff member every day before the first class begins. Initial each item as you complete it and leave the sheet on the front counter for management review.

1. Unlock the front entrance and prop open lobby doors by 3:15 PM (weekdays) or 8:45 AM (Saturdays).
2. Disarm the security system using the front panel — enter your assigned 4-digit code.
3. Turn on lobby lights, hallway lights, and the "OPEN" sign in the window.
4. Power on the front desk computer, iPad check-in kiosk, and receipt printer.
5. Verify the check-in kiosk app is running and connected to the studio Wi-Fi network.
6. Check the daily class schedule printout and confirm instructor assignments — flag any uncovered classes immediately to the Studio Director.
7. Restock the front counter with registration forms, waiver packets, and rate sheets.
8. Review the day's trial class list — prepare name tags and welcome folders for each trial student.
9. Confirm the waiting area is tidy: straighten chairs, clear old magazines, wipe down the sign-in counter.
10. Check voicemail and respond to any overnight messages; log urgent items in the front desk communication binder.

If anything on this list cannot be completed (equipment failure, missing supplies, etc.), text the Studio Director immediately.`,
  },
  {
    id: "kb-002",
    title: "Closing Checklist — Front Desk",
    category: "studio-operations",
    author: "Pam Richardson",
    updatedAt: "2026-03-25",
    relatedArticleIds: ["kb-001", "kb-006"],
    body: `Closing Checklist — Front Desk

Complete this checklist after the last class of the day has ended and all students have been picked up. Do not leave the building until every item is done.

1. Ensure all students have been picked up — check studios, restrooms, and the lobby. If a student remains 15 minutes after the last class, contact the parent and notify the Studio Director.
2. Power off the check-in kiosk, receipt printer, and front desk monitors. Log out of the studio management software.
3. Lock the front entrance and all exterior doors. Test each door to confirm it is latched.
4. Walk through every studio room: turn off lights, fans, and sound systems. Close all studio doors.
5. Check restrooms: turn off lights, confirm faucets are off, flush if needed.
6. Empty the lobby trash can and place the bag in the dumpster behind the building.
7. Arm the security system — enter your 4-digit code and select "AWAY" mode. Wait for the confirmation beep.
8. Exit through the side door, lock it behind you, and confirm the deadbolt engages.

Report any maintenance issues (burned-out lights, leaks, broken equipment) via the maintenance request form on the shared drive before you leave.`,
  },
  {
    id: "kb-006",
    title: "Emergency Procedures & Safety Protocols",
    category: "studio-operations",
    author: "Pam Richardson",
    updatedAt: "2026-02-14",
    relatedArticleIds: ["kb-001", "kb-002"],
    body: `Emergency Procedures & Safety Protocols

All staff members must be familiar with these procedures. Review annually and after any incident.

Fire / Smoke:
- Pull the nearest fire alarm and call 911.
- Evacuate all students through the nearest marked exit. Assembly point: the parking lot flagpole.
- Take the class roster clipboard to verify headcount at the assembly point.
- Do not re-enter the building until the fire department gives the all-clear.

Severe Weather:
- Move all students to the interior hallway (no windows). Bring rosters and first-aid kit.
- Keep students seated and calm until the warning expires.

Medical Emergency:
- Call 911 first. Then notify the Studio Director.
- Administer first aid only within your training level. The first-aid kit is mounted on the wall next to Studio A.
- Do not move an injured person unless they are in immediate danger.

Unauthorized Visitor:
- Politely ask for identification and purpose of visit.
- If the person refuses or becomes threatening, lock the studio doors and call 911.`,
  },
  // Title-only stubs for remaining studio-operations articles
  {
    id: "kb-023",
    title: "Facility Maintenance Request Process",
    category: "studio-operations",
    author: "Pam Richardson",
    updatedAt: "2026-01-20",
    relatedArticleIds: ["kb-001"],
    body: "Facility maintenance requests should be submitted through the shared drive form. Include the room, description of issue, and priority level. Requests are reviewed weekly by the Studio Director.",
  },
  {
    id: "kb-024",
    title: "Sound System & Music Playback Guide",
    category: "studio-operations",
    author: "Vicki Wallace",
    updatedAt: "2026-01-10",
    relatedArticleIds: ["kb-001"],
    body: "Each studio has a Bluetooth speaker system. Pair your device via the speaker labeled with the room name. Keep volume at 60% or below during warm-ups, and no higher than 80% during combinations. Report speaker issues to the front desk.",
  },
  {
    id: "kb-025",
    title: "Lost & Found Procedures",
    category: "studio-operations",
    author: "Pam Richardson",
    updatedAt: "2025-12-18",
    relatedArticleIds: ["kb-002"],
    body: "Place found items in the Lost & Found bin near the front desk. Items are held for 30 days. Unclaimed items are donated at the end of each month. Label high-value items with the date found and notify parents via email.",
  },

  // ── Policies & Procedures ─────────────────────────────────────────────────
  {
    id: "kb-003",
    title: "Attendance & Absence Policy",
    category: "policies-procedures",
    author: "Vicki Wallace",
    updatedAt: "2026-03-20",
    relatedArticleIds: ["kb-004", "kb-005"],
    body: `Attendance & Absence Policy

Regular attendance is essential for student progress and ensemble cohesion. This policy applies to all enrolled students across every discipline.

Attendance Expectations:
- Students are expected to attend every scheduled class. Consistent attendance is the single biggest predictor of growth and recital readiness.
- Arriving more than 10 minutes late counts as a "late" mark. Three late marks in one month convert to one absence.

Notifying the Studio:
- Parents must notify the studio of an absence at least 2 hours before class start time, using the parent portal or by calling the front desk.
- Unexcused absences (no notification) are flagged in the system and a courtesy text is sent to the parent.

Make-Up Classes:
- Students may attend one make-up class per month in the same discipline at an equivalent level, subject to space availability.
- Make-up classes must be scheduled through the parent portal at least 24 hours in advance.
- Make-up classes do not roll over month to month.

Extended Absences:
- Absences of two or more consecutive weeks require written notice (email or portal message) to the Studio Director.
- Medical absences longer than 4 weeks may qualify for a tuition hold — contact the office to discuss.

Impact on Recital Participation:
- Students who miss more than 4 classes in the 8 weeks before recital may be asked to sit out of that routine at the choreographer's discretion, for the safety and fairness of the group.
- The Studio Director will communicate any participation concerns to parents as early as possible.

Refund Policy:
- Tuition is not prorated or refunded for individual missed classes. See the Tuition & Billing policy for more information.`,
  },
  {
    id: "kb-004",
    title: "Dress Code by Discipline",
    category: "policies-procedures",
    author: "Vicki Wallace",
    updatedAt: "2026-03-18",
    relatedArticleIds: ["kb-003", "kb-005"],
    body: `Dress Code by Discipline

Proper attire ensures safety, allows instructors to see body alignment, and builds a professional studio culture. These requirements apply to all classes — no exceptions during class time.

Ballet:
- Girls: Black leotard (any style), pink tights, pink ballet slippers. Hair in a secure bun — no loose ponytails.
- Boys: White fitted t-shirt, black tights or bike shorts, black ballet slippers.

Jazz:
- Girls: Any solid-color leotard or fitted tank top, black jazz pants or leggings, tan jazz shoes.
- Boys: Fitted t-shirt, black jazz pants, tan or black jazz shoes.

Tap:
- All students: Fitted top, black pants or leggings, black tap shoes. No loose clothing that could catch on the floor.

Hip Hop:
- All students: Comfortable athletic wear (t-shirts, joggers, or leggings). Clean sneakers with non-marking soles — street shoes are not permitted on the studio floor.

Contemporary / Lyrical:
- Girls: Leotard or fitted tank, convertible tights or leggings. Barefoot or half-soles per instructor preference.
- Boys: Fitted t-shirt, black leggings or shorts. Barefoot or half-soles.

Acrobatics / Tumbling:
- All students: Form-fitting top and leggings or bike shorts. No zippers, snaps, or jewelry. Hair secured away from face. Barefoot.

General Rules:
- No jewelry of any kind during class (earrings, necklaces, bracelets, rings).
- Cover-ups, hoodies, and street clothes must be removed before entering the studio.
- Students arriving out of dress code may be asked to sit and observe class. This counts as an attendance mark.`,
  },
  {
    id: "kb-005",
    title: "Parent Handbook Overview",
    category: "policies-procedures",
    author: "Pam Richardson",
    updatedAt: "2026-03-15",
    relatedArticleIds: ["kb-003", "kb-004"],
    body: `Parent Handbook Overview

Welcome to Rhythm & Grace Dance Studio! This overview covers the most important policies parents need to know. A full digital copy of the Parent Handbook is available in the parent portal.

Registration & Enrollment:
- A non-refundable annual registration fee of $35 per student ($60 family cap) is due at enrollment.
- Enrollment is confirmed only after the registration fee and first month's tuition are received.
- Class placement is based on age, experience, and instructor assessment — not parent request.

Tuition & Billing:
- Tuition is billed monthly on the 1st and due by the 10th. A $15 late fee applies after the 10th.
- Tuition covers all regularly scheduled classes for the month, regardless of holidays or closures (the annual calendar accounts for these).
- Multi-class discounts: 10% off the 2nd class per student, 15% off the 3rd+.

Communication:
- The studio communicates primarily through the parent portal and text messages. Ensure your contact info is current.
- Class cancellations due to weather or emergencies are posted on the portal and sent via text by 1:00 PM.

Drop-Off & Pick-Up:
- Students under 8 must be walked to the studio door by an adult — no unattended drop-offs in the parking lot.
- Pick-up must be within 10 minutes of class ending. Repeated late pick-ups may result in a $10 per occurrence fee.

Observation Policy:
- Parents may observe classes during designated observation weeks (typically the last week of each month).
- Outside of observation weeks, parents are asked to wait in the lobby to minimize distractions.

Withdrawal:
- 30 days' written notice is required to withdraw from a class. Tuition for the notice period is non-refundable.`,
  },
  // Title-only stubs for remaining policies
  {
    id: "kb-026",
    title: "Tuition & Billing Detailed Policy",
    category: "policies-procedures",
    author: "Pam Richardson",
    updatedAt: "2026-02-28",
    relatedArticleIds: ["kb-005"],
    body: "Tuition is billed monthly on the 1st, due by the 10th. Late payments incur a $15 fee. Returned checks incur a $25 fee. See the Parent Handbook for discount schedules.",
  },
  {
    id: "kb-027",
    title: "Photography & Social Media Policy",
    category: "policies-procedures",
    author: "Vicki Wallace",
    updatedAt: "2026-02-10",
    relatedArticleIds: ["kb-005"],
    body: "Photos and videos taken during studio events may be used on studio social media and marketing materials unless a parent opts out in writing. Personal recording during class is not permitted.",
  },
  {
    id: "kb-028",
    title: "Bullying & Code of Conduct",
    category: "policies-procedures",
    author: "Vicki Wallace",
    updatedAt: "2026-01-22",
    relatedArticleIds: ["kb-005", "kb-003"],
    body: "Rhythm & Grace has zero tolerance for bullying, harassment, or exclusionary behavior. Students, parents, and staff are expected to treat each other with respect. Violations are handled via progressive discipline: verbal warning, parent conference, suspension, dismissal.",
  },
  {
    id: "kb-029",
    title: "Recital Participation Guidelines",
    category: "policies-procedures",
    author: "Pam Richardson",
    updatedAt: "2025-12-05",
    relatedArticleIds: ["kb-003", "kb-004"],
    body: "All enrolled students are invited to participate in the spring recital. A recital fee of $75 per routine covers venue rental, lighting, and program printing. Costume costs are separate. Rehearsal attendance in the final 4 weeks is mandatory for participation.",
  },
  {
    id: "kb-030",
    title: "Weather & Emergency Closure Policy",
    category: "policies-procedures",
    author: "Pam Richardson",
    updatedAt: "2025-11-20",
    relatedArticleIds: ["kb-006", "kb-005"],
    body: "If the local school district cancels classes, the studio closes. Decisions are posted on the parent portal and sent via text by 1:00 PM. No make-up classes are offered for weather closures — the annual calendar already accounts for these days.",
  },
  {
    id: "kb-031",
    title: "Health & Illness Policy",
    category: "policies-procedures",
    author: "Vicki Wallace",
    updatedAt: "2025-11-01",
    relatedArticleIds: ["kb-003"],
    body: "Students who are ill (fever, vomiting, contagious conditions) must stay home. Return to class only after being symptom-free for 24 hours without medication. Notify the studio of any communicable illness so we can alert affected classes.",
  },

  // ── Curriculum & Lesson Plans ─────────────────────────────────────────────
  {
    id: "kb-007",
    title: "Ballet I: Weeks 1-4 Barre Fundamentals",
    category: "curriculum-lesson-plans",
    author: "Vicki Wallace",
    updatedAt: "2026-03-22",
    relatedArticleIds: ["kb-008", "kb-009"],
    linkedClassIds: ["cls-001"],
    body: `Ballet I: Weeks 1-4 — Barre Fundamentals

Level: Beginner (Ages 7-10)
Duration: 60 minutes per class
Objectives:
- Introduce proper barre etiquette and hand placement.
- Build foundational strength in plies, tendus, and releves.
- Develop body awareness, posture, and musicality through structured repetition.

Warm-Up (10 min):
- Gentle stretching in center: neck rolls, shoulder rolls, port de bras side-to-side.
- Parallel releves (8 counts x 4 sets) to warm up calves and establish balance.
- "Freeze dance" for younger students to internalize musical phrasing.

Barre Exercises (30 min):
Week 1 — Demi-plies in 1st and 2nd position. Focus on turnout from hips, keeping heels on the floor, spine long.
Week 2 — Add battement tendu devant from 1st position. Emphasize sliding the foot along the floor, pointed toe.
Week 3 — Combine demi-plies and tendus in a short enchainement. Introduce releve in 1st position at barre.
Week 4 — Add battement tendu a la seconde. Review and refine all exercises. Mini-assessment on posture and positions.

Center Work (15 min):
- Port de bras: 1st, 2nd, and 5th arm positions with correct hand shaping.
- Simple reverence at the end of each class to build performance etiquette.
- Across-the-floor: chasses and simple skips to practice weight transfer.

Cool-Down (5 min):
- Seated straddle stretch, butterfly stretch, pointed/flexed feet.
- Breathing exercises: inhale 4 counts, exhale 4 counts.

Instructor Notes:
- Use imagery ("grow tall like a sunflower," "melt like ice cream for plie") to connect with younger learners.
- Correct alignment gently — prioritize encouragement over perfection at this level.
- Partner students who struggle with a confident peer for barre exercises.`,
  },
  {
    id: "kb-008",
    title: "Ballet II: Port de Bras & Adagio",
    category: "curriculum-lesson-plans",
    author: "Vicki Wallace",
    updatedAt: "2026-03-20",
    relatedArticleIds: ["kb-007", "kb-009"],
    linkedClassIds: ["cls-002"],
    body: `Ballet II: Port de Bras & Adagio

Level: Intermediate (Ages 10-14)
Duration: 75 minutes per class
Objectives:
- Refine upper-body carriage through detailed port de bras combinations.
- Develop sustained balance and control in adagio sequences.
- Introduce arabesque and attitude positions with proper alignment.

Warm-Up (10 min):
- Lying-down core engagement: pelvic tilts, leg lifts, slow bicycle.
- Standing rises: releve in 1st, 2nd, and 5th positions (8x each).
- Light dynamic stretching: leg swings front/side, torso twists.

Barre (25 min):
- Plies in all five positions with coordinated port de bras (arms move through 1st to 5th).
- Battement tendu combination: devant, a la seconde, derriere with arm opposition.
- Rond de jambe a terre en dehors — 4 slow, 4 quick. Focus on maintaining turnout throughout the circle.
- Adagio at barre: developpe devant, hold 4 counts, close. Developpe a la seconde, hold, close. Build to 8-count holds by Week 4.

Center (30 min):
- Port de bras study: arms through all positions with head and epaulement (Cecchetti 1st-5th port de bras).
- Adagio combination: tendu devant, developpe a la seconde, promenade in retire, arabesque fondu. Musical counts: 32-count phrase.
- Pirouette preparation: releve passe balance exercises, spotting drills.

Across the Floor (10 min):
- Waltz step with port de bras, traveling diagonally.
- Chaine turns (4-6 in a row) focusing on spot, releve, and arm placement.

Reverence & Cool-Down (5 min):
- Formal reverence sequence with curtsy/bow.
- Seated splits and oversplits stretching with yoga block support.

Instructor Notes:
- This level bridges recreational and pre-professional. Expect wide ability ranges — offer modifications ("try holding for 2 counts before 4").
- Video one combination per week for students to review at home (post in parent portal).`,
  },
  {
    id: "kb-009",
    title: "Jazz Fundamentals: Weeks 1-4",
    category: "curriculum-lesson-plans",
    author: "Vicki Wallace",
    updatedAt: "2026-03-18",
    relatedArticleIds: ["kb-007", "kb-008"],
    linkedClassIds: ["cls-005"],
    body: `Jazz Fundamentals: Weeks 1-4

Level: Beginner (Ages 7-10)
Duration: 60 minutes per class
Objectives:
- Develop rhythm awareness, isolations, and jazz-specific movement quality.
- Teach fundamental jazz vocabulary: jazz walks, chasses, pas de bourree, pivot turns.
- Build performance energy and confidence through short combinations.

Warm-Up & Isolations (10 min):
- Head isolations: side-to-side, forward/back, circles (8 counts each).
- Shoulder isolations: up/down, forward/back, alternating.
- Rib cage isolations: side-to-side, front/back.
- Hip isolations: side-to-side, circles.
- Full body roll-downs (8 counts down, 8 counts up) x 3.

Across the Floor (15 min):
Week 1 — Jazz walks (heel-ball-toe with attitude), chasses right and left.
Week 2 — Add pas de bourree (back-side-front). Practice with counts first, then with music.
Week 3 — Pivot turns: step-pivot-step, 2 in a row. Emphasize spotting.
Week 4 — Combine: jazz walk x 4, chasse, pas de bourree, pivot turn. Full sequence traveling diagonally.

Combination (25 min):
- Teach an age-appropriate 32-count combination over 4 weeks.
- Week 1: Counts 1-8 — focus on counts and placement.
- Week 2: Counts 9-16 — add to the phrase, review 1-8.
- Week 3: Counts 17-24 — layer in dynamics (sharp vs. smooth).
- Week 4: Counts 25-32 — full combo with performance energy. Film and review.

Stretch & Cool-Down (10 min):
- Straddle stretch, pike stretch, hip flexor lunge.
- Split practice (right, left, center) — hold 30 seconds each.
- "Compliment circle" at the end of Week 4 — each student says one thing they're proud of learning.

Instructor Notes:
- Music selection matters! Use high-energy, age-appropriate pop with a clear beat.
- Encourage facial expression and performance quality from Week 1 — "dance, don't just do steps."
- Use small groups (3-4) for across-the-floor to maximize feedback time.`,
  },
  // Title-only stubs for remaining curriculum articles
  {
    id: "kb-032",
    title: "Ballet III: Pointe Readiness Assessment",
    category: "curriculum-lesson-plans",
    author: "Vicki Wallace",
    updatedAt: "2026-02-25",
    relatedArticleIds: ["kb-008"],
    linkedClassIds: [],
    body: "Assessing pointe readiness involves evaluating ankle strength, turnout control, alignment, and minimum age (typically 11+). Students must pass a releve endurance test and demonstrate correct tendu alignment before pointe work begins.",
  },
  {
    id: "kb-033",
    title: "Tap I: Rhythm & Timing Basics",
    category: "curriculum-lesson-plans",
    author: "Vicki Wallace",
    updatedAt: "2026-02-20",
    relatedArticleIds: ["kb-009"],
    linkedClassIds: [],
    body: "Introductory tap covering shuffles, flaps, ball-changes, and basic time steps. Students learn to count rhythms and distinguish between toe, ball, and heel sounds. 8-count phrases build to a 32-count routine by Week 4.",
  },
  {
    id: "kb-034",
    title: "Hip Hop: Street Style Foundations",
    category: "curriculum-lesson-plans",
    author: "Vicki Wallace",
    updatedAt: "2026-02-15",
    relatedArticleIds: ["kb-009"],
    linkedClassIds: [],
    body: "Covers bounce, rock, groove, and basic breaking foundations. Students learn musicality through freestyle circles and structured 8-count combos. Emphasis on personal style and improvisation within structure.",
  },
  {
    id: "kb-035",
    title: "Contemporary I: Floor Work & Release Technique",
    category: "curriculum-lesson-plans",
    author: "Vicki Wallace",
    updatedAt: "2026-02-10",
    relatedArticleIds: ["kb-008"],
    linkedClassIds: [],
    body: "Introduction to contemporary dance through release technique and floor work. Students explore breath-initiated movement, fall-and-recovery, and spiral patterns. Builds on ballet fundamentals with freer artistic expression.",
  },
  {
    id: "kb-036",
    title: "Tumbling: Beginner Progressions",
    category: "curriculum-lesson-plans",
    author: "Pam Richardson",
    updatedAt: "2026-01-30",
    relatedArticleIds: [],
    linkedClassIds: [],
    body: "Forward roll, backward roll, cartwheel, and bridge progressions. Spotting techniques for each skill. Students must demonstrate mastery of each progression before advancing. Safety mats required at all times.",
  },
  {
    id: "kb-037",
    title: "Jazz II: Turns & Leaps",
    category: "curriculum-lesson-plans",
    author: "Vicki Wallace",
    updatedAt: "2026-01-25",
    relatedArticleIds: ["kb-009"],
    linkedClassIds: [],
    body: "Building on Jazz Fundamentals, this unit introduces chaine turns, pirouettes from 4th position, saute jumps, and grand jete preparation. Students work on spotting technique and height/distance in leaps.",
  },
  {
    id: "kb-038",
    title: "Ballet I: Weeks 5-8 Center & Across the Floor",
    category: "curriculum-lesson-plans",
    author: "Vicki Wallace",
    updatedAt: "2026-01-15",
    relatedArticleIds: ["kb-007"],
    linkedClassIds: ["cls-001"],
    body: "Continuation of Ballet I. Students transition more work to center, adding simple adagio, echappes, and chasse across the floor. Builds confidence away from the barre while reinforcing barre fundamentals.",
  },
  {
    id: "kb-039",
    title: "Lyrical: Emotion Through Movement",
    category: "curriculum-lesson-plans",
    author: "Vicki Wallace",
    updatedAt: "2025-12-20",
    relatedArticleIds: ["kb-008", "kb-035"],
    linkedClassIds: [],
    body: "Lyrical dance bridges ballet technique with emotional storytelling. This unit covers phrasing with lyrics, use of breath, partnering basics, and building a narrative arc within a routine. Students interpret two contrasting songs.",
  },
  {
    id: "kb-040",
    title: "Musical Theatre: Character & Storytelling",
    category: "curriculum-lesson-plans",
    author: "Pam Richardson",
    updatedAt: "2025-12-10",
    relatedArticleIds: ["kb-009"],
    linkedClassIds: [],
    body: "Combines jazz and theatre techniques. Students learn to dance in character, use props, and project to an audience. Covers classic Broadway styles and builds toward a group production number for recital.",
  },

  // ── Sub Handbook ──────────────────────────────────────────────────────────
  {
    id: "kb-010",
    title: "Sub Expectations & Procedures",
    category: "sub-handbook",
    author: "Pam Richardson",
    updatedAt: "2026-03-10",
    relatedArticleIds: ["kb-001", "kb-003", "kb-004"],
    body: `Sub Expectations & Procedures

Thank you for subbing at Rhythm & Grace Dance Studio. This guide covers everything you need to know to walk in confidently and deliver a great class.

Before You Arrive:
- Confirm the class name, time, room, age group, and discipline via the sub request notification.
- Review the lesson plan for that class/week in the Knowledge Base under Curriculum & Lesson Plans. If no plan is posted, prepare a general class in the same discipline and level.
- Arrive 15 minutes early to familiarize yourself with the room, sound system, and roster.

When You Arrive:
- Check in at the front desk. The front desk staff will give you the class roster and any parent notes.
- Introduce yourself to the students: "Hi everyone, I'm [Name] and I'll be your teacher today. Miss [Original Instructor] will be back next class."
- Take attendance using the paper roster or the instructor iPad — mark present, absent, or late.

During Class:
- Follow the posted lesson plan as closely as possible for continuity.
- If no lesson plan is available, use this structure: 10 min warm-up, 15 min technique review, 25 min combination or activity, 10 min stretch/cool-down.
- Prioritize safety over ambition — never introduce new skills (especially in acro/tumbling) that you haven't been cleared to teach.
- Be encouraging and warm. Students can feel anxious with a new teacher.

After Class:
- Write a brief note for the regular instructor: what you covered, any student concerns, and how the class went. Leave it with the front desk or email the instructor directly.
- Log your hours on the sub pay sheet at the front desk.
- Thank the front desk team on your way out.

Pay:
- Subs are paid the studio's standard sub rate ($30/class for 45-min, $40/class for 60-min, $50/class for 75-min+). Payment is processed on the next regular pay cycle.`,
  },
  {
    id: "kb-041",
    title: "Sub Quick-Reference: Room & Equipment Guide",
    category: "sub-handbook",
    author: "Pam Richardson",
    updatedAt: "2026-02-05",
    relatedArticleIds: ["kb-010"],
    body: "Studio A: Marley floor, 30 capacity, Bluetooth speaker on shelf. Studio B: Marley floor, 25 capacity, speaker in cabinet. Studio C: Sprung floor, tumbling mats in closet, 20 capacity. Studio D: Small studio, 15 capacity. Wi-Fi password is posted behind the front desk.",
  },
  {
    id: "kb-042",
    title: "Sub FAQ & Common Questions",
    category: "sub-handbook",
    author: "Pam Richardson",
    updatedAt: "2026-01-18",
    relatedArticleIds: ["kb-010"],
    body: "Q: What if a parent asks about billing? A: Direct them to the front desk. Q: What if a student gets hurt? A: Administer basic first aid, notify the front desk, and fill out an incident report. Q: Can I change the lesson plan? A: Minor adjustments are fine; major changes should be cleared with the Studio Director.",
  },
  {
    id: "kb-043",
    title: "Sub Availability & Scheduling",
    category: "sub-handbook",
    author: "Pam Richardson",
    updatedAt: "2025-12-15",
    relatedArticleIds: ["kb-010"],
    body: "Update your availability in the staff portal monthly. When a sub request is posted, respond within 2 hours if possible. First to confirm gets the class. If you need to cancel a confirmed sub assignment, notify the Studio Director immediately — do not just no-show.",
  },

  // ── HR & Staff ────────────────────────────────────────────────────────────
  {
    id: "kb-011",
    title: "PTO Policy & Benefits",
    category: "hr-staff",
    author: "Pam Richardson",
    updatedAt: "2026-03-05",
    relatedArticleIds: ["kb-010", "kb-003"],
    body: `PTO Policy & Benefits

This policy applies to all W-2 staff members (instructors, front desk, and administrative staff). Independent contractor subs are not eligible for PTO.

Accrual:
- Full-time staff (30+ hours/week): Accrue 1 PTO day per month, up to a maximum bank of 10 days.
- Part-time staff (15-29 hours/week): Accrue 0.5 PTO days per month, up to a maximum bank of 5 days.
- PTO begins accruing after the 90-day probationary period.

Requesting PTO:
- Submit PTO requests at least 2 weeks in advance through the staff portal.
- Requests during peak periods (recital week, registration week, first/last week of season) are generally not approved unless for medical or family emergencies.
- The Studio Director approves or denies requests within 3 business days.

Using PTO:
- PTO can be used in half-day or full-day increments.
- Instructors requesting PTO are responsible for finding a sub through the sub request system before the request is considered complete.
- Unused PTO does not roll over to the next calendar year and is not paid out at separation.

Other Benefits:
- Complimentary class enrollment for staff members' children (up to 2 classes per child).
- 20% discount on costumes and studio merchandise.
- Annual professional development stipend of $200 for workshops, certifications, or conferences.
- Free CPR/First Aid certification renewal through the studio's annual training day.`,
  },
  {
    id: "kb-044",
    title: "Staff Onboarding Checklist",
    category: "hr-staff",
    author: "Pam Richardson",
    updatedAt: "2026-02-20",
    relatedArticleIds: ["kb-011"],
    body: "New staff onboarding includes: signed offer letter, W-4 and I-9 forms, background check consent, portal account setup, dress code review, studio tour, shadow session with a senior instructor, and CPR certification (within 30 days of hire).",
  },
  {
    id: "kb-045",
    title: "Pay Schedule & Direct Deposit",
    category: "hr-staff",
    author: "Pam Richardson",
    updatedAt: "2026-02-01",
    relatedArticleIds: ["kb-011"],
    body: "Staff are paid bi-weekly on Fridays via direct deposit. Timesheets must be submitted by end of day Monday for the prior two-week period. Late timesheets are processed in the following pay cycle. Pay stubs are available in the staff portal.",
  },
  {
    id: "kb-046",
    title: "Professional Development & Training",
    category: "hr-staff",
    author: "Vicki Wallace",
    updatedAt: "2026-01-15",
    relatedArticleIds: ["kb-011"],
    body: "Staff may use the $200 annual PD stipend for approved workshops, conferences, or certifications. Pre-approval from the Studio Director is required. Submit receipts within 30 days for reimbursement. The studio also hosts quarterly in-house training sessions.",
  },
  {
    id: "kb-047",
    title: "Staff Code of Conduct",
    category: "hr-staff",
    author: "Pam Richardson",
    updatedAt: "2025-12-01",
    relatedArticleIds: ["kb-011", "kb-028"],
    body: "All staff are expected to model professionalism, punctuality, and respect. Arrive at least 10 minutes before your first class. Dress according to staff dress code. No personal phone use during class. Report any concerns about student welfare immediately to the Studio Director.",
  },
]

// ── Accessor helpers ─────────────────────────────────────────────────────────

export function getArticleById(
  id: string
): KnowledgeBaseArticle | undefined {
  return articles.find((a) => a.id === id)
}

export function getArticlesByCategory(
  category: ArticleCategory
): KnowledgeBaseArticle[] {
  return articles.filter((a) => a.category === category)
}

export function getCategoryMeta(
  id: ArticleCategory
): CategoryMeta | undefined {
  return categories.find((c) => c.id === id)
}

/** Most recently updated articles, descending by date. */
export function getRecentlyUpdated(limit = 5): KnowledgeBaseArticle[] {
  return [...articles]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, limit)
}
