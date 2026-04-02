/**
 * Enum mappers: convert between Prisma enum values (underscores)
 * and frontend display values (hyphens/formatted strings).
 *
 * Prisma stores: hip_hop, musical_theatre, tiny_tots, per_session, etc.
 * Frontend expects: hip-hop, musical-theatre, tiny-tots, per-session, etc.
 */

// ── Generic converter ────────────────────────────────────────────────────────

/** Replace underscores with hyphens: "hip_hop" -> "hip-hop" */
export function dbToFrontend<T extends string>(value: T): string {
  return value.replace(/_/g, "-")
}

/** Replace hyphens with underscores: "hip-hop" -> "hip_hop" */
export function frontendToDb<T extends string>(value: string): T {
  return value.replace(/-/g, "_") as T
}

// ── Discipline ───────────────────────────────────────────────────────────────

import type { Discipline as FrontendDiscipline } from "@/lib/types"
import type { Discipline as PrismaDiscipline } from "@/generated/prisma/enums"

export function mapDiscipline(d: PrismaDiscipline): FrontendDiscipline {
  return dbToFrontend(d) as FrontendDiscipline
}

export function mapDisciplines(ds: PrismaDiscipline[]): FrontendDiscipline[] {
  return ds.map(mapDiscipline)
}

export function toPrismaDiscipline(d: FrontendDiscipline): PrismaDiscipline {
  return frontendToDb<PrismaDiscipline>(d)
}

// ── AgeGroup ─────────────────────────────────────────────────────────────────

import type { AgeGroup as FrontendAgeGroup } from "@/lib/types"
import type { AgeGroup as PrismaAgeGroup } from "@/generated/prisma/enums"

export function mapAgeGroup(ag: PrismaAgeGroup): FrontendAgeGroup {
  return dbToFrontend(ag) as FrontendAgeGroup
}

// ── BillingType ──────────────────────────────────────────────────────────────

import type { BillingType as FrontendBillingType } from "@/lib/types"
import type { BillingType as PrismaBillingType } from "@/generated/prisma/enums"

export function mapBillingType(bt: PrismaBillingType): FrontendBillingType {
  return dbToFrontend(bt) as FrontendBillingType
}

// ── StaffRole ────────────────────────────────────────────────────────────────

import type { StaffRole as FrontendStaffRole } from "@/lib/types"
import type { StaffRole as PrismaStaffRole } from "@/generated/prisma/enums"

const staffRoleMap: Record<PrismaStaffRole, FrontendStaffRole> = {
  instructor: "instructor",
  assistant: "assistant",
  sub: "sub",
  staff_admin: "admin",
}

export function mapStaffRole(r: PrismaStaffRole): FrontendStaffRole {
  return staffRoleMap[r]
}

export function toPrismaStaffRole(r: FrontendStaffRole): PrismaStaffRole {
  const reverse: Record<FrontendStaffRole, PrismaStaffRole> = {
    instructor: "instructor",
    assistant: "assistant",
    sub: "sub",
    admin: "staff_admin",
  }
  return reverse[r]
}

// ── StaffStatus ──────────────────────────────────────────────────────────────

import type { StaffStatus as FrontendStaffStatus } from "@/lib/types"
import type { StaffStatus as PrismaStaffStatus } from "@/generated/prisma/enums"

export function mapStaffStatus(s: PrismaStaffStatus): FrontendStaffStatus {
  return dbToFrontend(s) as FrontendStaffStatus
}

// ── Room ─────────────────────────────────────────────────────────────────────

import type { Room as PrismaRoom } from "@/generated/prisma/enums"

const roomMap: Record<PrismaRoom, string> = {
  studio_a: "Studio A",
  studio_b: "Studio B",
  studio_c: "Studio C",
  studio_d: "Studio D",
}

export function mapRoom(r: PrismaRoom): "Studio A" | "Studio B" | "Studio C" | "Studio D" {
  return roomMap[r] as "Studio A" | "Studio B" | "Studio C" | "Studio D"
}

// ── SeasonStatus (no transformation needed, but included for completeness) ──

import type { SeasonStatus as PrismaSeasonStatus } from "@/generated/prisma/enums"

export function mapSeasonStatus(s: PrismaSeasonStatus): "upcoming" | "active" | "completed" {
  return s
}

// ── HouseholdStatus ──────────────────────────────────────────────────────────

import type { HouseholdStatus as PrismaHouseholdStatus } from "@/generated/prisma/enums"

export function mapHouseholdStatus(s: PrismaHouseholdStatus): "active" | "inactive" | "archived" {
  return s
}

// ── EnrollmentStatus (no transformation needed) ─────────────────────────────

import type { EnrollmentStatus as FrontendEnrollmentStatus } from "@/lib/types"
import type { EnrollmentStatus as PrismaEnrollmentStatus } from "@/generated/prisma/enums"

export function mapEnrollmentStatus(s: PrismaEnrollmentStatus): FrontendEnrollmentStatus {
  return s
}

// ── LeadStage ────────────────────────────────────────────────────────────────

import type { LeadStage as FrontendLeadStage } from "@/lib/types"
import type { LeadStage as PrismaLeadStage } from "@/generated/prisma/enums"

const leadStageMap: Record<PrismaLeadStage, FrontendLeadStage> = {
  new_lead: "new",
  contacted: "contacted",
  trial_scheduled: "trial-scheduled",
  trial_completed: "trial-completed",
  registered: "registered",
  lost: "lost",
}

export function mapLeadStage(s: PrismaLeadStage): FrontendLeadStage {
  return leadStageMap[s]
}

// ── GuardianRelationship (no transformation needed) ──────────────────────────

import type { GuardianRelationship as PrismaGuardianRelationship } from "@/generated/prisma/enums"
import type { Guardian } from "@/lib/types"

export function mapGuardianRelationship(
  r: PrismaGuardianRelationship,
): Guardian["relationship"] {
  return r
}

// ── Gender (no transformation needed) ────────────────────────────────────────

import type { Gender as PrismaGender } from "@/generated/prisma/enums"

export function mapGender(g: PrismaGender): "female" | "male" | "other" {
  return g
}

// ── Utility: compute age from date of birth ─────────────────────────────────

export function computeAge(dateOfBirth: Date): number {
  const today = new Date()
  let age = today.getFullYear() - dateOfBirth.getFullYear()
  const monthDiff = today.getMonth() - dateOfBirth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--
  }
  return age
}

// ── Utility: Decimal to number ──────────────────────────────────────────────

/** Convert Prisma Decimal to plain number */
export function toNumber(decimal: unknown): number {
  if (typeof decimal === "number") return decimal
  return Number(decimal)
}

// ── Utility: DateTime to ISO date string ────────────────────────────────────

/** Convert Date to "YYYY-MM-DD" string */
export function toISODate(date: Date): string {
  return date.toISOString().split("T")[0]
}

/** Convert Date to ISO datetime string */
export function toISODateTime(date: Date): string {
  return date.toISOString()
}


// Template category mapping
export function mapTemplateCategory(val: string): string {
  return val.replace(/_/g, "-")
}

// Lead stage mapping (Prisma -> frontend)

// Lead source mapping (Prisma -> frontend)
export function mapLeadSource(val: string): string {
  return val.replace(/_/g, "-")
}

// ISO date helper

// ISO datetime helper
