import type { Season } from "@/lib/types"

export const seasons: Season[] = [
  {
    id: "season-fall-2025",
    name: "Fall 2025",
    startDate: "2025-09-02",
    endDate: "2025-12-19",
    billingRate: 95,
    status: "completed",
  },
  {
    id: "season-spring-2026",
    name: "Spring 2026",
    startDate: "2026-01-12",
    endDate: "2026-05-29",
    billingRate: 95,
    status: "active",
  },
  {
    id: "season-summer-2026",
    name: "Summer 2026",
    startDate: "2026-06-15",
    endDate: "2026-08-14",
    billingRate: 85,
    status: "upcoming",
  },
]

export function getSeasonById(id: string): Season | undefined {
  return seasons.find((s) => s.id === id)
}

export function getActiveSeason(): Season | undefined {
  return seasons.find((s) => s.status === "active")
}

export function getSeasonsByStatus(
  status: Season["status"],
): Season[] {
  return seasons.filter((s) => s.status === status)
}
