import { classes } from "@/data/classes"
import ClientPage from "./client-page"

export function generateStaticParams() {
  return classes.map((cls) => ({ id: cls.id }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  return <ClientPage params={resolvedParams} />
}
