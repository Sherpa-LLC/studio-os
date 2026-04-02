import { getSeasons } from "@/lib/dal/seasons"
import ClientPage from "./client-page"

export default async function Page() {
  const seasons = await getSeasons()
  return <ClientPage seasons={seasons} />
}
