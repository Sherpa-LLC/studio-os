import { getRecitals } from "@/lib/dal/recitals"
import ClientPage from "./client-page"

export default async function Page() {
  const recitals = await getRecitals()
  return <ClientPage recitals={recitals} />
}
