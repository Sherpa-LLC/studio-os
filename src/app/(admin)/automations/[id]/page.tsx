import { getAutomations, getAutomationById } from "@/lib/dal/automations"
import { getTextTemplates } from "@/lib/dal/text-templates"
import ClientPage from "./client-page"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [automation, textTemplates] = await Promise.all([
    getAutomationById(id),
    getTextTemplates(),
  ])

  return <ClientPage automation={automation} textTemplates={textTemplates} />
}
