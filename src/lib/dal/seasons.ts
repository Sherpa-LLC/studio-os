import { db } from "@/lib/db"
import { mapBillingType, mapSeasonStatus, toNumber, toISODate } from "./enum-mappers"
import type { Season } from "@/lib/types"

// ── Mappers ──────────────────────────────────────────────────────────────────

type PrismaSeason = Awaited<ReturnType<typeof db.season.findFirst>>

function mapSeason(row: NonNullable<PrismaSeason>): Season {
  return {
    id: row.id,
    name: row.name,
    startDate: toISODate(row.startDate),
    endDate: toISODate(row.endDate),
    billingRate: toNumber(row.billingRate),
    billingType: mapBillingType(row.billingType),
    status: mapSeasonStatus(row.status),
  }
}

// ── Queries ──────────────────────────────────────────────────────────────────

export async function getSeasons(): Promise<Season[]> {
  const rows = await db.season.findMany({ orderBy: { startDate: "desc" } })
  return rows.map(mapSeason)
}

export async function getSeasonById(id: string): Promise<Season | undefined> {
  const row = await db.season.findUnique({ where: { id } })
  return row ? mapSeason(row) : undefined
}

export async function getActiveSeason(): Promise<Season | undefined> {
  const row = await db.season.findFirst({ where: { status: "active" } })
  return row ? mapSeason(row) : undefined
}

export async function getSeasonsByStatus(
  status: Season["status"],
): Promise<Season[]> {
  const rows = await db.season.findMany({
    where: { status: status as any },
    orderBy: { startDate: "desc" },
  })
  return rows.map(mapSeason)
}
