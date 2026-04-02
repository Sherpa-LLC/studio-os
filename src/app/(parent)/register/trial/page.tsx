import { getTrialSlots } from "@/lib/dal/trial-slots"
import ClientPage from "./client-page"

export default async function Page() {
  const trialSlots = await getTrialSlots()
  return <ClientPage trialSlots={trialSlots} />
}
