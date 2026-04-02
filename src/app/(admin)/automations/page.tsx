import { getAutomations } from "@/lib/dal/automations"
import ClientPage from "./client-page"

export default async function Page() {
  const automations = await getAutomations()
  return <ClientPage automations={automations} />
}
