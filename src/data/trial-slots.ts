import type { TrialSlot } from "@/lib/types"

export const trialSlots: TrialSlot[] = [
  // ── Week 1: March 31 – April 5 ─────────────────────────────────────────────
  { id: "ts-001", classId: "cls-001", className: "Tiny Tots Ballet", discipline: "ballet", date: "2026-03-31", startTime: "15:30", endTime: "16:15", room: "Studio D", instructorName: "Miss Elena", availableSpots: 3, bookedCount: 2 },
  { id: "ts-002", classId: "cls-005", className: "Minis Jazz", discipline: "jazz", date: "2026-03-31", startTime: "16:30", endTime: "17:30", room: "Studio B", instructorName: "Coach Destiny", availableSpots: 4, bookedCount: 1 },
  { id: "ts-003", classId: "cls-010", className: "Juniors Hip Hop", discipline: "hip-hop", date: "2026-04-01", startTime: "17:30", endTime: "18:30", room: "Studio A", instructorName: "Coach Marcus", availableSpots: 5, bookedCount: 0 },
  { id: "ts-004", classId: "cls-015", className: "Teens Contemporary", discipline: "contemporary", date: "2026-04-01", startTime: "18:30", endTime: "19:30", room: "Studio B", instructorName: "Ms. Tanya", availableSpots: 2, bookedCount: 3 },
  { id: "ts-005", classId: "cls-002", className: "Minis Ballet", discipline: "ballet", date: "2026-04-02", startTime: "16:00", endTime: "17:00", room: "Studio A", instructorName: "Miss Elena", availableSpots: 3, bookedCount: 2 },
  { id: "ts-006", classId: "cls-008", className: "Juniors Tap", discipline: "tap", date: "2026-04-02", startTime: "17:00", endTime: "18:00", room: "Studio C", instructorName: "Mr. Brian", availableSpots: 6, bookedCount: 0 },
  { id: "ts-007", classId: "cls-012", className: "Juniors Lyrical", discipline: "lyrical", date: "2026-04-03", startTime: "16:30", endTime: "17:30", room: "Studio B", instructorName: "Ms. Tanya", availableSpots: 4, bookedCount: 1 },
  { id: "ts-008", classId: "cls-020", className: "Teens Jazz", discipline: "jazz", date: "2026-04-03", startTime: "18:00", endTime: "19:00", room: "Studio A", instructorName: "Coach Destiny", availableSpots: 3, bookedCount: 2 },
  { id: "ts-009", classId: "cls-025", className: "Minis Acrobatics", discipline: "acro", date: "2026-04-04", startTime: "15:30", endTime: "16:30", room: "Studio C", instructorName: "Coach Alex", availableSpots: 2, bookedCount: 4 },
  { id: "ts-010", classId: "cls-001", className: "Tiny Tots Ballet", discipline: "ballet", date: "2026-04-04", startTime: "16:30", endTime: "17:15", room: "Studio D", instructorName: "Miss Elena", availableSpots: 3, bookedCount: 2 },
  { id: "ts-011", classId: "cls-030", className: "Juniors Musical Theatre", discipline: "musical-theatre", date: "2026-04-05", startTime: "10:00", endTime: "11:00", room: "Studio A", instructorName: "Ms. Rachel", availableSpots: 5, bookedCount: 1 },
  // ── Week 2: April 6 – April 11 ─────────────────────────────────────────────
  { id: "ts-012", classId: "cls-005", className: "Minis Jazz", discipline: "jazz", date: "2026-04-07", startTime: "16:30", endTime: "17:30", room: "Studio B", instructorName: "Coach Destiny", availableSpots: 4, bookedCount: 1 },
  { id: "ts-013", classId: "cls-010", className: "Juniors Hip Hop", discipline: "hip-hop", date: "2026-04-07", startTime: "17:30", endTime: "18:30", room: "Studio A", instructorName: "Coach Marcus", availableSpots: 6, bookedCount: 0 },
  { id: "ts-014", classId: "cls-001", className: "Tiny Tots Ballet", discipline: "ballet", date: "2026-04-08", startTime: "15:30", endTime: "16:15", room: "Studio D", instructorName: "Miss Elena", availableSpots: 4, bookedCount: 1 },
  { id: "ts-015", classId: "cls-015", className: "Teens Contemporary", discipline: "contemporary", date: "2026-04-08", startTime: "18:30", endTime: "19:30", room: "Studio B", instructorName: "Ms. Tanya", availableSpots: 3, bookedCount: 2 },
  { id: "ts-016", classId: "cls-008", className: "Juniors Tap", discipline: "tap", date: "2026-04-09", startTime: "17:00", endTime: "18:00", room: "Studio C", instructorName: "Mr. Brian", availableSpots: 5, bookedCount: 1 },
  { id: "ts-017", classId: "cls-002", className: "Minis Ballet", discipline: "ballet", date: "2026-04-09", startTime: "16:00", endTime: "17:00", room: "Studio A", instructorName: "Miss Elena", availableSpots: 4, bookedCount: 1 },
  { id: "ts-018", classId: "cls-020", className: "Teens Jazz", discipline: "jazz", date: "2026-04-10", startTime: "18:00", endTime: "19:00", room: "Studio A", instructorName: "Coach Destiny", availableSpots: 3, bookedCount: 2 },
  { id: "ts-019", classId: "cls-012", className: "Juniors Lyrical", discipline: "lyrical", date: "2026-04-10", startTime: "16:30", endTime: "17:30", room: "Studio B", instructorName: "Ms. Tanya", availableSpots: 5, bookedCount: 0 },
  { id: "ts-020", classId: "cls-030", className: "Juniors Musical Theatre", discipline: "musical-theatre", date: "2026-04-11", startTime: "10:00", endTime: "11:00", room: "Studio A", instructorName: "Ms. Rachel", availableSpots: 6, bookedCount: 0 },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

export function getSlotsByDate(date: string): TrialSlot[] {
  return trialSlots.filter((s) => s.date === date)
}

export function getAvailableSlots(): TrialSlot[] {
  return trialSlots.filter((s) => s.availableSpots > 0)
}
