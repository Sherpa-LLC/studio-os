import { getTeams } from "@/lib/dal/competition"
import ClientPage from "./client-page"

export default async function Page() {
  const teams = await getTeams()
  return <ClientPage teams={teams} />
}
