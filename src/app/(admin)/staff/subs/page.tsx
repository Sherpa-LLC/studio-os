import {
  getSubRequests,
  getQualifiedSubCandidates,
  getSubHistory,
} from "@/lib/dal/staff"
import SubManagementClientPage from "./client-page"

export default async function SubManagementPage() {
  const [subRequests, qualifiedSubCandidates, subHistory] = await Promise.all([
    getSubRequests(),
    getQualifiedSubCandidates(),
    getSubHistory(),
  ])

  return (
    <SubManagementClientPage
      subRequests={subRequests}
      qualifiedSubCandidates={qualifiedSubCandidates}
      subHistory={subHistory}
    />
  )
}
