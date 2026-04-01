import type { CallRecord } from "@/lib/types"

export const callRecords: CallRecord[] = [
  { id: "call-001", contactId: "lead-001", contactName: "Amanda Simmons", direction: "outbound", duration: 185, timestamp: "2026-03-31T09:30:00", status: "completed" },
  { id: "call-002", contactId: "hh-002", contactName: "Maria Garcia", direction: "inbound", duration: 0, timestamp: "2026-03-31T08:45:00", status: "missed" },
  { id: "call-003", contactId: "lead-004", contactName: "David Thompson", direction: "outbound", duration: 240, timestamp: "2026-03-30T14:20:00", status: "completed" },
  { id: "call-004", contactId: "hh-004", contactName: "Lisa Thompson", direction: "inbound", duration: 120, timestamp: "2026-03-30T11:00:00", status: "completed" },
  { id: "call-005", contactId: "lead-007", contactName: "Susan Clarke", direction: "inbound", duration: 310, timestamp: "2026-03-29T16:15:00", status: "completed" },
  { id: "call-006", contactId: "lead-006", contactName: "Marcus Williams", direction: "outbound", duration: 0, timestamp: "2026-03-29T10:30:00", status: "voicemail" },
  { id: "call-007", contactId: "hh-001", contactName: "Jennifer Anderson", direction: "outbound", duration: 95, timestamp: "2026-03-28T15:45:00", status: "completed" },
  { id: "call-008", contactId: "lead-003", contactName: "Rachel Park", direction: "outbound", duration: 180, timestamp: "2026-03-28T10:00:00", status: "completed" },
  { id: "call-009", contactId: "hh-005", contactName: "Priya Patel", direction: "inbound", duration: 0, timestamp: "2026-03-27T13:30:00", status: "missed" },
  { id: "call-010", contactId: "lead-002", contactName: "Carlos Mendez", direction: "outbound", duration: 0, timestamp: "2026-03-27T09:15:00", status: "voicemail" },
  { id: "call-011", contactId: "hh-003", contactName: "Sarah Chen", direction: "inbound", duration: 65, timestamp: "2026-03-26T14:00:00", status: "completed" },
  { id: "call-012", contactId: "lead-005", contactName: "Nina Kowalski", direction: "outbound", duration: 195, timestamp: "2026-03-26T11:30:00", status: "completed" },
  { id: "call-013", contactId: "hh-008", contactName: "Angela Rivera", direction: "inbound", duration: 145, timestamp: "2026-03-25T16:00:00", status: "completed" },
  { id: "call-014", contactId: "lead-010", contactName: "Tom Bradley", direction: "outbound", duration: 0, timestamp: "2026-03-25T10:00:00", status: "voicemail" },
  { id: "call-015", contactId: "hh-007", contactName: "Keiko Tanaka", direction: "inbound", duration: 90, timestamp: "2026-03-24T15:30:00", status: "completed" },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

export function formatDuration(seconds: number): string {
  if (seconds === 0) return "—"
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}
