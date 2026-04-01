import { teams } from "@/data/competition"
import ClientPage from "./client-page"

export function generateStaticParams() {
  return teams.map((t) => ({ id: t.id }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  return <ClientPage params={resolvedParams} />
}
