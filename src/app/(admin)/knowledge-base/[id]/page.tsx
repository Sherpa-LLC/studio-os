import { articles } from "@/data/knowledge-base"
import ClientPage from "./client-page"

export function generateStaticParams() {
  return articles.map((a) => ({ id: a.id }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  return <ClientPage params={resolvedParams} />
}
