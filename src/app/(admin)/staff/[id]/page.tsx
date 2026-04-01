import { staffMembers } from "@/data/staff"
import ClientPage from "./client-page"

export function generateStaticParams() {
  return staffMembers.map((s) => ({ id: s.id }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  return <ClientPage params={resolvedParams} />
}
