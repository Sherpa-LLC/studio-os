import { getTeams, getTeamById } from "@/lib/dal/competition"
import ClientPage from "./client-page"

export async function generateStaticParams() {
  const teams = await getTeams()
  return teams.map((t) => ({ id: t.id }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const team = await getTeamById(id)

  return <ClientPage team={team} />
}
