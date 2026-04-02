import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const db = new PrismaClient({ adapter })

// Import mock data
import { seasons } from "../src/data/seasons"
import { households } from "../src/data/households"
import { students } from "../src/data/students"
import { classes } from "../src/data/classes"
import { instructors } from "../src/data/instructors"
import { invoices } from "../src/data/invoices"
import { leads } from "../src/data/leads"
import { conversations } from "../src/data/conversations"
import { messages } from "../src/data/messages"
import { textTemplates } from "../src/data/text-templates"
import { automations } from "../src/data/automations"
import { recitals } from "../src/data/recitals"
import { teams } from "../src/data/competition"
import { articles } from "../src/data/knowledge-base"
import { reviews } from "../src/data/reviews"
import { staffMembers, subRequests } from "../src/data/staff"
import { billingConfig } from "../src/data/billing-rules"
import { rolloverConfig, rolloverResponses } from "../src/data/rollover"
import { savedSegments } from "../src/data/segments"
import { callRecords } from "../src/data/call-records"
import { trialSlots } from "../src/data/trial-slots"
import { attendanceRecords } from "../src/data/attendance-records"

function e(val: string): any { return val.replace(/-/g, "_") }
function room(r: string): any {
  return r.replace("Studio ", "studio_").toLowerCase()
}

async function main() {
  console.log("Seeding domain data...")

  // 1. Seasons
  for (const s of seasons) {
    await db.season.upsert({
      where: { id: s.id },
      update: {},
      create: {
        id: s.id, name: s.name,
        startDate: new Date(s.startDate), endDate: new Date(s.endDate),
        billingRate: s.billingRate, billingType: e(s.billingType), status: e(s.status),
      },
    })
  }
  console.log(`  ${seasons.length} seasons`)

  // 2. Staff (instructors + staff members)
  const staffEmails = new Set<string>()
  for (const s of staffMembers) {
    staffEmails.add(s.email)
    await db.staffMember.upsert({
      where: { id: s.id },
      update: {},
      create: {
        id: s.id, firstName: s.firstName, lastName: s.lastName,
        email: s.email, phone: s.phone,
        role: s.role === "admin" ? "staff_admin" as any : e(s.role),
        disciplines: s.disciplines.map(e),
        status: e(s.status), payRate: s.payRate, payType: s.payType,
        hireDate: new Date(s.hireDate),
        certifications: s.certifications as any,
        availability: s.availability as any,
        weeklyHours: s.weeklyHours, monthlyCompensation: s.monthlyCompensation,
      },
    })
  }
  // Instructors not already in staff
  for (const inst of instructors) {
    if (staffEmails.has(inst.email)) continue
    await db.staffMember.upsert({
      where: { email: inst.email },
      update: {},
      create: {
        id: `staff-${inst.id}`, firstName: inst.firstName, lastName: inst.lastName,
        email: inst.email, phone: inst.phone, role: "instructor",
        disciplines: inst.specialties.map(e),
        status: "active", payRate: inst.payRate, payType: inst.payType,
        hireDate: new Date("2020-01-01"), weeklyHours: 0, monthlyCompensation: 0,
      },
    })
  }
  console.log(`  ${staffMembers.length} staff + ${instructors.length} instructors`)

  // 3. Households + Guardians
  for (const hh of households) {
    await db.household.upsert({
      where: { id: hh.id },
      update: {},
      create: {
        id: hh.id,
        street: hh.address.street, city: hh.address.city, state: hh.address.state, zip: hh.address.zip,
        status: e(hh.status), balance: hh.balance,
        paymentMethodType: hh.paymentMethod?.type,
        paymentMethodLast4: hh.paymentMethod?.last4,
        paymentMethodExpiry: hh.paymentMethod?.expiry,
        createdAt: new Date(hh.createdAt),
      },
    })
    for (const g of hh.guardians) {
      await db.guardian.upsert({
        where: { id: g.id },
        update: {},
        create: {
          id: g.id, householdId: hh.id,
          firstName: g.firstName, lastName: g.lastName,
          email: g.email, phone: g.phone, relationship: e(g.relationship),
        },
      })
    }
  }
  console.log(`  ${households.length} households`)

  // 4. Students
  for (const s of students) {
    await db.student.upsert({
      where: { id: s.id },
      update: {},
      create: {
        id: s.id, householdId: s.householdId,
        firstName: s.firstName, lastName: s.lastName,
        dateOfBirth: new Date(s.dateOfBirth), gender: e(s.gender),
        medicalNotes: s.medicalNotes,
        enrollmentStatus: e(s.enrollmentStatus),
        measurements: s.measurements as any,
      },
    })
  }
  console.log(`  ${students.length} students`)

  // 5. Classes + Schedules + Enrollments
  // Build instructor ID map
  const instMap: Record<string, string> = {}
  for (const inst of instructors) {
    const staff = await db.staffMember.findFirst({ where: { email: inst.email } })
    if (staff) instMap[inst.id] = staff.id
  }

  let classCount = 0, enrollCount = 0
  for (const c of classes) {
    const instructorId = instMap[c.instructorId] ?? c.instructorId
    // Check instructor exists
    const instExists = await db.staffMember.findUnique({ where: { id: instructorId } })
    if (!instExists) continue

    await db.class.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id, name: c.name, discipline: e(c.discipline), ageGroup: e(c.ageGroup),
        description: c.description, instructorId,
        seasonId: c.seasonId, capacity: c.capacity, monthlyRate: c.monthlyRate,
        ageRangeMin: c.ageRange.min, ageRangeMax: c.ageRange.max, status: e(c.status),
      },
    })
    // Schedule
    await db.classSchedule.create({
      data: {
        classId: c.id, day: e(c.schedule.day),
        startTime: c.schedule.startTime, endTime: c.schedule.endTime,
        room: room(c.schedule.room),
      },
    }).catch(() => {}) // skip duplicates
    classCount++
  }

  // Enrollments from student data
  for (const s of students) {
    for (const classId of s.enrolledClassIds) {
      const clsExists = await db.class.findUnique({ where: { id: classId } })
      if (!clsExists) continue
      await db.enrollment.upsert({
        where: { studentId_classId: { studentId: s.id, classId } },
        update: {},
        create: { studentId: s.id, classId, status: "active" },
      }).catch(() => {})
      enrollCount++
    }
  }
  console.log(`  ${classCount} classes, ${enrollCount} enrollments`)

  // 6. Invoices
  let invCount = 0
  for (const inv of invoices) {
    await db.invoice.upsert({
      where: { id: inv.id },
      update: {},
      create: {
        id: inv.id, householdId: inv.householdId,
        date: new Date(inv.date), dueDate: new Date(inv.dueDate),
        subtotal: inv.subtotal, total: inv.total,
        status: e(inv.status),
        paidDate: inv.paidDate ? new Date(inv.paidDate) : null,
      },
    })
    for (const li of inv.lineItems) {
      const clsExists = await db.class.findUnique({ where: { id: li.classId } })
      const stuExists = await db.student.findUnique({ where: { id: li.studentId } })
      if (!clsExists || !stuExists) continue
      await db.invoiceLineItem.upsert({
        where: { id: li.id },
        update: {},
        create: {
          id: li.id, invoiceId: inv.id, studentId: li.studentId,
          classId: li.classId, description: li.description, amount: li.amount,
        },
      }).catch(() => {})
    }
    invCount++
  }
  console.log(`  ${invCount} invoices`)

  // 7. Leads, Conversations, Messages, etc. (batch)
  for (const l of leads) {
    await db.lead.upsert({ where: { id: l.id }, update: {}, create: {
      id: l.id, firstName: l.firstName, lastName: l.lastName,
      email: l.email, phone: l.phone, childName: l.childName, childAge: l.childAge,
      interestDiscipline: e(l.interestDiscipline),
      source: e(l.source), stage: l.stage === "new" ? "new_lead" : e(l.stage),
      notes: l.notes, createdAt: new Date(l.createdAt),
      lastContactedAt: l.lastContactedAt ? new Date(l.lastContactedAt) : null,
      assignedTo: l.assignedTo,
    }}).catch(() => {})
  }
  console.log(`  ${leads.length} leads`)

  for (const c of conversations) {
    await db.conversation.upsert({ where: { id: c.id }, update: {}, create: {
      id: c.id, contactName: c.contactName, contactPhone: c.contactPhone,
      contactEmail: c.contactEmail, contactType: e(c.contactType), contactId: c.contactId,
      channel: e(c.channel), status: e(c.status), unreadCount: c.unreadCount,
      lastMessage: c.lastMessage, lastMessageAt: new Date(c.lastMessageAt),
    }}).catch(() => {})
    for (const m of c.messages) {
      await db.conversationMessage.create({ data: {
        id: m.id, conversationId: c.id, direction: e(m.direction),
        channel: e(m.channel), body: m.body, read: m.read, timestamp: new Date(m.timestamp),
      }}).catch(() => {})
    }
  }
  console.log(`  ${conversations.length} conversations`)

  for (const m of messages) {
    await db.message.upsert({ where: { id: m.id }, update: {}, create: {
      id: m.id, subject: m.subject, body: m.body, channel: e(m.channel),
      audience: m.audience, audienceCount: m.audienceCount,
      sentBy: m.sentBy, sentAt: new Date(m.sentAt), status: e(m.status),
      deliveredCount: m.deliveredCount, openedCount: m.openedCount,
    }}).catch(() => {})
  }
  console.log(`  ${messages.length} messages`)

  for (const t of textTemplates) {
    await db.textTemplate.upsert({ where: { id: t.id }, update: {}, create: {
      id: t.id, name: t.name, body: t.body, category: e(t.category), shortcut: t.shortcut,
    }}).catch(() => {})
  }

  for (const a of automations) {
    await db.automation.upsert({ where: { id: a.id }, update: {}, create: {
      id: a.id, name: a.name, description: a.description,
      trigger: e(a.trigger), status: e(a.status),
      runsCount: a.runsCount, successRate: a.successRate,
      createdAt: new Date(a.createdAt),
    }}).catch(() => {})
    for (let i = 0; i < a.steps.length; i++) {
      const s = a.steps[i]
      await db.automationStep.create({ data: {
        id: s.id, automationId: a.id, type: e(s.type), label: s.label,
        config: s.config as any, sortOrder: i,
      }}).catch(() => {})
    }
  }
  console.log(`  ${automations.length} automations`)

  for (const r of reviews) {
    await db.review.upsert({ where: { id: r.id }, update: {}, create: {
      id: r.id, platform: e(r.platform), author: r.author, rating: r.rating,
      body: r.body, date: new Date(r.date), responded: r.responded,
      responseBody: r.responseBody,
    }}).catch(() => {})
  }
  console.log(`  ${reviews.length} reviews`)

  // Billing config
  await db.billingConfig.create({ data: {
    hourlyRate: billingConfig.hourlyRate, monthlyCap: billingConfig.monthlyCap,
    registrationFee: billingConfig.registrationFee, lateFee: billingConfig.lateFee,
    lateFeeGraceDays: billingConfig.lateFeeGraceDays,
    siblingDiscount: billingConfig.siblingDiscount, trialFee: billingConfig.trialFee,
  }}).catch(() => {})
  console.log("  billing config")

  console.log("\nSeed complete!")
}

main().catch(console.error).finally(() => db.$disconnect())
