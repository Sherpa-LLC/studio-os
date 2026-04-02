import ClientPage from "./client-page"

export default async function Page({
  params,
}: {
  params: Promise<{ classId: string }>
}) {
  const resolvedParams = await params
  return <ClientPage params={resolvedParams} />
}
