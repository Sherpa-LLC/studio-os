import { db } from "@/lib/db"
import type { SavedSegment } from "@/lib/types"

export async function getSavedSegments(): Promise<SavedSegment[]> {
  const rows = await db.savedSegment.findMany({ orderBy: { createdAt: "desc" } })
  return rows.map(s => ({
    id: s.id, name: s.name, rules: s.rules as any,
    contactCount: s.contactCount, createdAt: s.createdAt.toISOString(),
  }))
}
