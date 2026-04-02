import { getLeads } from "@/lib/dal/leads"
import ClientPage from "./client-page"

export default async function Page() {
  const leads = await getLeads()
  return <ClientPage leads={leads} />
}
