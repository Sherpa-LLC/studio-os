import { households } from "@/data/households"
import ClientPage from "./client-page"

export function generateStaticParams() {
  return households.map((hh) => ({ householdId: hh.id }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ householdId: string }>
}) {
  const resolvedParams = await params
  return <ClientPage params={resolvedParams} />
}
