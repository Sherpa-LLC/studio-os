import { recitals } from "@/data/recitals"
import ClientPage from "./client-page"

export function generateStaticParams() {
  return recitals.map((r) => ({ id: r.id }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  return <ClientPage params={resolvedParams} />
}
