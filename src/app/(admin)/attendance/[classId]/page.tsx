import { classes } from "@/data/classes"
import ClientPage from "./client-page"

export function generateStaticParams() {
  return classes.map((cls) => ({ classId: cls.id }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ classId: string }>
}) {
  const resolvedParams = await params
  return <ClientPage params={resolvedParams} />
}
