import { vi } from "vitest"

// Mock the db module so DAL tests don't need a real database
export function createMockDb() {
  return {
    season: { findMany: vi.fn(), findUnique: vi.fn(), findFirst: vi.fn() },
    household: { findMany: vi.fn(), findUnique: vi.fn() },
    guardian: { findMany: vi.fn() },
    student: { findMany: vi.fn(), findUnique: vi.fn() },
    staffMember: { findMany: vi.fn(), findUnique: vi.fn(), findFirst: vi.fn() },
    class: { findMany: vi.fn(), findUnique: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
    classSchedule: { create: vi.fn() },
    enrollment: { findMany: vi.fn(), upsert: vi.fn(), update: vi.fn(), count: vi.fn(), groupBy: vi.fn() },
    invoice: { findMany: vi.fn(), findUnique: vi.fn(), create: vi.fn(), update: vi.fn() },
    invoiceLineItem: { create: vi.fn() },
    billingOverride: { findMany: vi.fn(), findUnique: vi.fn(), create: vi.fn() },
    billingConfig: { findFirst: vi.fn() },
    attendanceRecord: { findMany: vi.fn(), upsert: vi.fn() },
    lead: { findMany: vi.fn(), findUnique: vi.fn(), create: vi.fn(), update: vi.fn() },
    conversation: { findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), aggregate: vi.fn() },
    conversationMessage: { create: vi.fn(), updateMany: vi.fn() },
    message: { findMany: vi.fn(), findUnique: vi.fn(), create: vi.fn(), update: vi.fn() },
    review: { findMany: vi.fn(), count: vi.fn(), aggregate: vi.fn() },
    $transaction: vi.fn((fns: unknown[]) => Promise.all(fns)),
    $executeRawUnsafe: vi.fn(),
  }
}
