import type { AgeGroup, DayOfWeek, Discipline } from "./types"

// ── Discipline labels & colors ────────────────────────────────────────────────

export const DISCIPLINE_LABELS: Record<Discipline, string> = {
  ballet: "Ballet",
  jazz: "Jazz",
  tap: "Tap",
  contemporary: "Contemporary",
  "hip-hop": "Hip Hop",
  lyrical: "Lyrical",
  acro: "Acrobatics",
  "musical-theatre": "Musical Theatre",
  pointe: "Pointe",
}

export const DISCIPLINE_COLORS: Record<Discipline, string> = {
  ballet: "#EC4899", // pink
  jazz: "#8B5CF6", // violet
  tap: "#F59E0B", // amber
  contemporary: "#06B6D4", // cyan
  "hip-hop": "#EF4444", // red
  lyrical: "#6366F1", // indigo
  acro: "#10B981", // emerald
  "musical-theatre": "#F97316", // orange
  pointe: "#D946EF", // fuchsia
}

// ── Age group labels & ranges ─────────────────────────────────────────────────

export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  "tiny-tots": "Tiny Tots",
  minis: "Minis",
  juniors: "Juniors",
  teens: "Teens",
  seniors: "Seniors",
  adults: "Adults",
}

export const AGE_GROUP_RANGES: Record<AgeGroup, { min: number; max: number }> =
  {
    "tiny-tots": { min: 3, max: 5 },
    minis: { min: 5, max: 7 },
    juniors: { min: 7, max: 10 },
    teens: { min: 10, max: 14 },
    seniors: { min: 14, max: 18 },
    adults: { min: 18, max: 99 },
  }

// ── Day labels ────────────────────────────────────────────────────────────────

export const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
}

export const DAY_ABBREVIATIONS: Record<DayOfWeek, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
}

// ── Studio rooms ──────────────────────────────────────────────────────────────

export type RoomName = "Studio A" | "Studio B" | "Studio C" | "Studio D"

export interface RoomInfo {
  name: RoomName
  capacity: number
  features: string[]
}

export const ROOMS: Record<RoomName, RoomInfo> = {
  "Studio A": {
    name: "Studio A",
    capacity: 30,
    features: ["Marley floor", "Full mirrors", "Sound system", "Barres"],
  },
  "Studio B": {
    name: "Studio B",
    capacity: 25,
    features: ["Marley floor", "Full mirrors", "Sound system", "Barres"],
  },
  "Studio C": {
    name: "Studio C",
    capacity: 20,
    features: [
      "Sprung floor",
      "Mirrors",
      "Sound system",
      "Tumbling mats",
      "Barres",
    ],
  },
  "Studio D": {
    name: "Studio D",
    capacity: 15,
    features: ["Marley floor", "Mirrors", "Sound system", "Small studio"],
  },
}
