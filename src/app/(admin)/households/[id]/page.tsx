import { households } from "@/data/households"
import ClientPage from "./client-page"

export function generateStaticParams() {
  return households.map((hh) => ({ id: hh.id }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  return <ClientPage params={resolvedParams} />
}
