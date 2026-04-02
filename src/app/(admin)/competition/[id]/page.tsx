import { getTeams, getTeamById } from "@/lib/dal/competition"
import ClientPage from "./client-page"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const team = await getTeamById(id)

  return <ClientPage team={team} />
}
