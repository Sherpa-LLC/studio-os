import { getInstructors } from "@/lib/dal/instructors"
import { getSeasons } from "@/lib/dal/seasons"
import AddClassClientPage from "./client-page"

export default async function AddClassPage() {
  const [instructors, seasons] = await Promise.all([
    getInstructors(),
    getSeasons(),
  ])

  return <AddClassClientPage instructors={instructors} seasons={seasons} />
}
