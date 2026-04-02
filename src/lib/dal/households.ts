import { db } from "@/lib/db"
import {
  mapHouseholdStatus,
  mapGuardianRelationship,
  toNumber,
  toISODate,
} from "./enum-mappers"
import type { Guardian, Household } from "@/lib/types"

// ── Mappers ──────────────────────────────────────────────────────────────────

type PrismaHousehold = Awaited<
  ReturnType<typeof db.household.findFirst<{
    include: { guardians: true; students: true }
  }>>
>

function mapGuardian(g: NonNullable<PrismaHousehold>["guardians"][number]): Guardian {
  return {
    id: g.id,
    firstName: g.firstName,
    lastName: g.lastName,
    email: g.email,
    phone: g.phone,
    relationship: mapGuardianRelationship(g.relationship),
  }
}

function mapHousehold(row: NonNullable<PrismaHousehold>): Household {
  return {
    id: row.id,
    guardians: row.guardians.map(mapGuardian),
    studentIds: row.students.map((s) => s.id),
    address: {
      street: row.street,
      city: row.city,
      state: row.state,
      zip: row.zip,
    },
    createdAt: toISODate(row.createdAt),
    status: mapHouseholdStatus(row.status),
    balance: toNumber(row.balance),
    paymentMethod: row.paymentMethodType
      ? {
          type: row.paymentMethodType as "visa" | "mastercard" | "amex",
          last4: row.paymentMethodLast4!,
          expiry: row.paymentMethodExpiry!,
        }
      : undefined,
  }
}

// ── Shared include for all queries ──────────────────────────────────────────

const householdInclude = { guardians: true, students: true } as const

// ── Queries ──────────────────────────────────────────────────────────────────

export async function getHouseholds(): Promise<Household[]> {
  const rows = await db.household.findMany({
    include: householdInclude,
    orderBy: { createdAt: "desc" },
  })
  return rows.map(mapHousehold)
}

export async function getHouseholdById(id: string): Promise<Household | undefined> {
  const row = await db.household.findUnique({
    where: { id },
    include: householdInclude,
  })
  return row ? mapHousehold(row) : undefined
}

export async function searchHouseholds(query: string): Promise<Household[]> {
  const q = query.toLowerCase()
  // Search across guardian names, emails, and household address
  const rows = await db.household.findMany({
    where: {
      OR: [
        { guardians: { some: { firstName: { contains: q, mode: "insensitive" } } } },
        { guardians: { some: { lastName: { contains: q, mode: "insensitive" } } } },
        { guardians: { some: { email: { contains: q, mode: "insensitive" } } } },
        { street: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
      ],
    },
    include: householdInclude,
    orderBy: { createdAt: "desc" },
  })
  return rows.map(mapHousehold)
}

export async function getHouseholdsByStatus(
  status: Household["status"],
): Promise<Household[]> {
  const rows = await db.household.findMany({
    where: { status: status as any },
    include: householdInclude,
    orderBy: { createdAt: "desc" },
  })
  return rows.map(mapHousehold)
}

export async function getHouseholdsWithBalance(): Promise<Household[]> {
  const rows = await db.household.findMany({
    where: { balance: { gt: 0 } },
    include: householdInclude,
    orderBy: { balance: "desc" },
  })
  return rows.map(mapHousehold)
}
