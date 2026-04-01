import type { AttendanceRecord, AttendanceStatus } from "@/lib/types"

// Attendance records for the current week (Mar 23-27, 2026)
// Status mix: ~85% present, ~5% absent, ~5% late, ~5% excused

// ── Helper to generate deterministic attendance ──────────────────────────────

function generateId(classId: string, studentId: string, date: string): string {
  return `att-${classId}-${studentId}-${date}`
}

function pickStatus(seed: number): AttendanceStatus {
  const val = seed % 20
  if (val < 17) return "present"
  if (val === 17) return "absent"
  if (val === 18) return "late"
  return "excused"
}

// Map of classId -> studentIds enrolled (based on students.ts enrolledClassIds)
const classEnrollments: Record<string, string[]> = {
  // Monday classes
  "cls-001": ["stu-023", "stu-039"],
  "cls-002": ["stu-010", "stu-044", "stu-060", "stu-078"],
  "cls-003": ["stu-005", "stu-019", "stu-032", "stu-080"],
  "cls-004": ["stu-028", "stu-055", "stu-068"],
  "cls-005": ["stu-009", "stu-052"],
  "cls-006": ["stu-001", "stu-008", "stu-022", "stu-030", "stu-054"],
  "cls-007": ["stu-025", "stu-038", "stu-083"],
  "cls-008": ["stu-026", "stu-043"],
  "cls-009": ["stu-004", "stu-016", "stu-040", "stu-051"],
  "cls-010": ["stu-018", "stu-031", "stu-058"],
  "cls-011": ["stu-036", "stu-051", "stu-074"],

  "cls-012": [], // Adult Contemporary - no mock students for adults

  // Thursday classes
  "cls-037": ["stu-063"],
  "cls-038": ["stu-010", "stu-044", "stu-055", "stu-060", "stu-068", "stu-078"],
  "cls-039": ["stu-013", "stu-047", "stu-065"],
  "cls-040": ["stu-009", "stu-028", "stu-032", "stu-052"],
  "cls-041": ["stu-011", "stu-029", "stu-045", "stu-049", "stu-058"],
  "cls-042": ["stu-009", "stu-022", "stu-077"],
  "cls-043": ["stu-042", "stu-056", "stu-079", "stu-082"],
  "cls-044": ["stu-056"],
  "cls-045": ["stu-007", "stu-015", "stu-037", "stu-050", "stu-066", "stu-073"],
  "cls-046": ["stu-015", "stu-061"],
  "cls-047": ["stu-003", "stu-034", "stu-050", "stu-073"],
  "cls-048": [],

  // Tuesday classes
  "cls-013": ["stu-023", "stu-063"],
  "cls-014": ["stu-006", "stu-033"],
  "cls-015": ["stu-033", "stu-060"],
  "cls-016": ["stu-059", "stu-072"],
  "cls-017": ["stu-041", "stu-052", "stu-059"],
  "cls-018": ["stu-076"],
  "cls-019": ["stu-001", "stu-026", "stu-040"],
  "cls-020": ["stu-004", "stu-016", "stu-045", "stu-049", "stu-067"],
  "cls-021": ["stu-003", "stu-024", "stu-053", "stu-061"],
  "cls-022": ["stu-012", "stu-034", "stu-066", "stu-082"],
  "cls-023": ["stu-003", "stu-015", "stu-024"],
  "cls-024": ["stu-003", "stu-024"],

  // Wednesday classes
  "cls-025": ["stu-039"],
  "cls-026": ["stu-020", "stu-028", "stu-055", "stu-078"],
  "cls-027": ["stu-044", "stu-068"],
  "cls-028": ["stu-006", "stu-010"],
  "cls-029": ["stu-002", "stu-013", "stu-035", "stu-047", "stu-062", "stu-072"],
  "cls-030": ["stu-025", "stu-038", "stu-071"],
  "cls-031": ["stu-008", "stu-074"],
  "cls-032": ["stu-016", "stu-029", "stu-036", "stu-064"],
  "cls-033": ["stu-012", "stu-021", "stu-048", "stu-070"],
  "cls-034": ["stu-018", "stu-031", "stu-067", "stu-079"],
  "cls-035": ["stu-007", "stu-021", "stu-048", "stu-073"],
  "cls-036": [], // Adult Ballet
  "cls-082": ["stu-002", "stu-013"], // Jazz/Contemporary Combo Juniors (Wed)

  // Friday classes
  "cls-049": ["stu-039", "stu-063"],
  "cls-050": ["stu-017", "stu-071"],
  "cls-051": ["stu-005", "stu-019", "stu-032", "stu-052", "stu-080"],
  "cls-052": ["stu-030", "stu-043"],
  "cls-053": ["stu-027", "stu-046", "stu-077"],
  "cls-054": ["stu-002"],
  "cls-055": ["stu-017", "stu-035", "stu-057", "stu-083"],
  "cls-056": ["stu-027", "stu-054"],
  "cls-057": ["stu-021", "stu-042", "stu-048", "stu-070"],
  "cls-058": ["stu-007", "stu-050", "stu-066"],
  "cls-059": ["stu-012", "stu-024", "stu-061"],
  "cls-060": [], // Adult Tap
  "cls-084": [], // Musical Theatre Adults
}

const weekDates = [
  "2026-03-23", // Monday (cls-001 through cls-012)
  "2026-03-24", // Tuesday (cls-013 through cls-024)
  "2026-03-25", // Wednesday (cls-025 through cls-036)
  "2026-03-26", // Thursday (cls-037 through cls-048)
  "2026-03-27", // Friday (cls-049 through cls-060)
]

const dayToClasses: Record<string, string[]> = {
  "2026-03-23": ["cls-001", "cls-002", "cls-003", "cls-004", "cls-005", "cls-006", "cls-007", "cls-008", "cls-009", "cls-010", "cls-011", "cls-012"],
  "2026-03-24": ["cls-013", "cls-014", "cls-015", "cls-016", "cls-017", "cls-018", "cls-019", "cls-020", "cls-021", "cls-022", "cls-023", "cls-024"],
  "2026-03-25": ["cls-025", "cls-026", "cls-027", "cls-028", "cls-029", "cls-030", "cls-031", "cls-032", "cls-033", "cls-034", "cls-035", "cls-036", "cls-082"],
  "2026-03-26": ["cls-037", "cls-038", "cls-039", "cls-040", "cls-041", "cls-042", "cls-043", "cls-044", "cls-045", "cls-046", "cls-047", "cls-048"],
  "2026-03-27": ["cls-049", "cls-050", "cls-051", "cls-052", "cls-053", "cls-054", "cls-055", "cls-056", "cls-057", "cls-058", "cls-059", "cls-060", "cls-084"],
}

// Generate all attendance records
function generateRecords(): AttendanceRecord[] {
  const records: AttendanceRecord[] = []
  let seedCounter = 0

  for (const date of weekDates) {
    const classIds = dayToClasses[date] ?? []
    for (const classId of classIds) {
      const studentIds = classEnrollments[classId] ?? []
      for (const studentId of studentIds) {
        seedCounter++
        const status = pickStatus(seedCounter)
        records.push({
          id: generateId(classId, studentId, date),
          classId,
          studentId,
          date,
          status,
          markedBy: "inst-001",
          markedAt: `${date}T${status === "late" ? "16:15" : "15:30"}:00`,
        })
      }
    }
  }

  return records
}

export const attendanceRecords: AttendanceRecord[] = generateRecords()

// ── Helper functions ──────────────────────────────────────────────────────────

export function getAttendanceByClass(classId: string, date: string): AttendanceRecord[] {
  return attendanceRecords.filter(
    (r) => r.classId === classId && r.date === date,
  )
}

export function getAttendanceByStudent(studentId: string): AttendanceRecord[] {
  return attendanceRecords.filter((r) => r.studentId === studentId)
}

export function getAttendanceByDate(date: string): AttendanceRecord[] {
  return attendanceRecords.filter((r) => r.date === date)
}

export function getAttendanceByClassAndDate(
  classId: string,
  date: string,
): AttendanceRecord[] {
  return getAttendanceByClass(classId, date)
}

export function getAttendanceStats(records: AttendanceRecord[]): Record<AttendanceStatus, number> {
  const stats: Record<AttendanceStatus, number> = {
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
  }
  for (const r of records) {
    stats[r.status]++
  }
  return stats
}

export function getAttendanceRate(records: AttendanceRecord[]): number {
  if (records.length === 0) return 0
  const present = records.filter(
    (r) => r.status === "present" || r.status === "late",
  ).length
  return present / records.length
}

export function getClassAttendanceSummary(
  classId: string,
  date: string,
): { present: number; absent: number; late: number; excused: number; total: number } {
  const records = getAttendanceByClass(classId, date)
  return {
    present: records.filter((r) => r.status === "present").length,
    absent: records.filter((r) => r.status === "absent").length,
    late: records.filter((r) => r.status === "late").length,
    excused: records.filter((r) => r.status === "excused").length,
    total: records.length,
  }
}
