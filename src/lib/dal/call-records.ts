import { db } from "@/lib/db"
import type { CallRecord } from "@/lib/types"

export async function getCallRecords(): Promise<CallRecord[]> {
  const rows = await db.callRecord.findMany({ orderBy: { timestamp: "desc" } })
  return rows.map(r => ({
    id: r.id, contactId: r.contactId, contactName: r.contactName,
    direction: r.direction, duration: r.duration,
    timestamp: r.timestamp.toISOString(), status: r.status,
  }))
}
export { formatDuration } from "@/data/call-records"
