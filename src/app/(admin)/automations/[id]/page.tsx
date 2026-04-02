import { getAllAutomations, getAutomationById } from "@/lib/dal/automations"
import { getAllTextTemplates } from "@/lib/dal/text-templates"
import ClientPage from "./client-page"

export async function generateStaticParams() {
  const automations = await getAllAutomations()
  return automations.map((a) => ({ id: a.id }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [automation, textTemplates] = await Promise.all([
    getAutomationById(id),
    getAllTextTemplates(),
  ])

  return <ClientPage automation={automation} textTemplates={textTemplates} />
}
