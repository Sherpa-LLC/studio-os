import { getRecitals, getRecitalById, getMeasurementsByRecitalId, getCostumeFinancials, getLineupConflicts } from "@/lib/dal/recitals"
import ClientPage from "./client-page"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [recital, measurements, financials, lineupConflicts] = await Promise.all([
    getRecitalById(id),
    getMeasurementsByRecitalId(id),
    getCostumeFinancials(id),
    getLineupConflicts(),
  ])

  return (
    <ClientPage
      recital={recital}
      measurements={measurements}
      financials={financials}
      lineupConflicts={lineupConflicts}
    />
  )
}
